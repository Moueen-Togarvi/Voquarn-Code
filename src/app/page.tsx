import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  let latestUsers = [];
  let dbError = null;

  try {
    if (process.env.DATABASE_URL) {
      latestUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);
    }
  } catch (error: any) {
    dbError = error.message;
  }

  return (
    <main className="flex-1 bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_20%_30%,rgba(168,85,247,0.08)_0%,transparent_100%)]" />
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Next.js + Neon + Drizzle
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Premium Full-Stack Setup
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Your modern application architecture is ready. Built with Next.js App Router, 
              Neon Serverless Postgres, and Drizzle ORM for maximum performance and developer velocity.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="https://neon.tech"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-200 transition-all duration-200"
              >
                Neon Console
              </a>
              <a
                href="https://orm.drizzle.team"
                className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors"
              >
                Drizzle Docs <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Database Connection Status Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Database Connection</h2>
            
            {!process.env.DATABASE_URL ? (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-amber-400 text-sm">
                  <span className="font-bold">Action Required:</span> Set your <code className="bg-amber-500/20 px-1 rounded">DATABASE_URL</code> in <code className="bg-amber-500/20 px-1 rounded">.env</code> to enable database features.
                </p>
              </div>
            ) : dbError ? (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-red-400 text-sm font-mono">Error: {dbError}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Successfully connected to Neon PostgreSQL
                </div>
                
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Latest Users</h3>
                  {latestUsers.length > 0 ? (
                    <div className="grid gap-4">
                      {latestUsers.map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 italic">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No users found. Run `npm run db:push` to sync your schema and add some data!</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Push Schema</h4>
                <code className="text-xs text-slate-300">npm run db:push</code>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Open Studio</h4>
                <code className="text-xs text-slate-300">npm run db:studio</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
