import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  adminLoginChallenges,
} from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq, gt, isNull } from "drizzle-orm";
import { hashAdminLoginToken } from "@/lib/admin-otp";
import { sendAdminLoginSecurityAlert } from "@/lib/admin-login-notifications";
import { getLoginRequestInfo } from "@/lib/login-request-info";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        challengeId: { label: "Challenge ID", type: "text" },
        loginToken: { label: "One-time login token", type: "password" },
      },
      async authorize(credentials, request) {
        const challengeId =
          typeof credentials?.challengeId === "string" ? credentials.challengeId : "";
        const loginToken =
          typeof credentials?.loginToken === "string" ? credentials.loginToken : "";

        if (!challengeId || !loginToken) {
          return null;
        }

        const now = new Date();
        const loginTokenHash = hashAdminLoginToken(challengeId, loginToken);
        const [claimedChallenge] = await db
          .update(adminLoginChallenges)
          .set({ usedAt: now })
          .where(
            and(
              eq(adminLoginChallenges.id, challengeId),
              eq(adminLoginChallenges.loginTokenHash, loginTokenHash),
              isNull(adminLoginChallenges.usedAt),
              gt(adminLoginChallenges.expiresAt, now),
            ),
          )
          .returning({
            userId: adminLoginChallenges.userId,
            email: adminLoginChallenges.email,
          });

        if (!claimedChallenge) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, claimedChallenge.userId))
          .limit(1);
        if (
          !user ||
          user.role !== "admin" ||
          claimedChallenge.email.toLowerCase() !== user.email.toLowerCase()
        ) {
          return null;
        }

        await sendAdminLoginSecurityAlert({
          to: user.email,
          status: "successful",
          attemptedEmail: user.email,
          requestInfo: getLoginRequestInfo(request.headers, now),
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "member";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
    authorized({ auth: session }) {
      return (session?.user as { role?: string } | undefined)?.role === "admin";
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  // AUTH_SECRET is the Auth.js v5 name. Keep NEXTAUTH_SECRET as a fallback so
  // existing local and production environments continue to work.
  secret: authSecret,
  trustHost: true,
});
