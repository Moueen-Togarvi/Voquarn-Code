# Voquarn Code

This is a multi-page agency website for Voquarn Code, built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- **Homepage and route tree**: Home, About, Services, Portfolio, Blog, Blog Post, and Contact.
- **Reusable components**: Sticky navbar, hero, service cards, portfolio filter, testimonials, footer, and floating WhatsApp CTA.
- **API routes**: Contact form endpoint.
- **Tailwind CSS 4**: Custom visual system with responsive layouts.
- **Content-driven setup**: Centralized marketing content in `src/lib/site-data.ts`.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the values you want to use.

- `AUTH_SECRET`: Required by Auth.js to encrypt sessions. Generate it with
  `openssl rand -base64 33` and configure the same variable in your deployment.
- `AUTH_URL`: Use `http://localhost:3000` locally and your public site URL in
  production.
- `RESEND_API_KEY`: Enables contact form delivery.
- `CONTACT_TO_EMAIL`: Where contact inquiries should go.
- `DATABASE_URL`: Optional if you still plan to use the included Drizzle/Neon setup.
- `BLOB_READ_WRITE_TOKEN`: Enables persistent admin image/video uploads. On
  Vercel, create a public Blob store in the project Storage tab; Vercel adds
  this variable automatically. Pull the project environment locally to test
  uploads outside production.

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Quality Checks

```bash
npm run lint
npm run build
```

## Project Structure

- `src/app/`: App Router pages and API routes.
- `src/components/`: Shared UI and layout components.
- `src/lib/site-data.ts`: Marketing content and route data.
- `src/db/`: Existing Drizzle/Neon configuration preserved for future product work.
