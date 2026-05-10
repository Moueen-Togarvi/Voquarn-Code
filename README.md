# Voquarn Code - Next.js + Neon + Drizzle

This is a premium Next.js project setup with Neon PostgreSQL and Drizzle ORM.

## Features

- **Next.js 16 (App Router)**: The latest features of Next.js.
- **Neon PostgreSQL**: Serverless Postgres for modern apps.
- **Drizzle ORM**: Type-safe ORM for SQL.
- **Tailwind CSS 4**: Modern styling.
- **Premium UI**: Custom dark-themed landing page with glassmorphism.

## Getting Started

### 1. Database Setup

1. Create a project on [Neon](https://neon.tech).
2. Copy your connection string.
3. Add it to your `.env` file:
   ```env
   DATABASE_URL=postgres://user:password@host/dbname?sslmode=require
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration

Sync your schema with the database:

```bash
npm run db:push
```

### 4. Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the results.

### 5. Drizzle Studio

Visualize your data:

```bash
npm run db:studio
```

## Project Structure

- `src/db/`: Database configuration and schema.
- `src/app/`: Next.js pages and components.
- `drizzle.config.ts`: Drizzle configuration.
- `drizzle/`: Generated migrations (if using `generate`).
