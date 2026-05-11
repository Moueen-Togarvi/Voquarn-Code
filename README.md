# Voquarn Code

This is a multi-page agency website for Voquarn Code, built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- **Homepage and route tree**: Home, About, Services, Portfolio, Pricing, Blog, Blog Post, and Contact.
- **Reusable components**: Sticky navbar, hero, service cards, portfolio filter, pricing toggle, testimonials, footer, and floating WhatsApp CTA.
- **API routes**: Contact form and newsletter subscription endpoints.
- **Tailwind CSS 4**: Custom visual system with responsive layouts.
- **Content-driven setup**: Centralized marketing content in `src/lib/site-data.ts`.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the values you want to use.

- `RESEND_API_KEY`: Enables contact form delivery.
- `CONTACT_TO_EMAIL`: Where contact inquiries should go.
- `MAILCHIMP_*`: Enables real newsletter subscriptions.
- `DATABASE_URL`: Optional if you still plan to use the included Drizzle/Neon setup.

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
