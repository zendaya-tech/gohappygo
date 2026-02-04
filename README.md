# GoHappyGo Frontend

React Router + Vite frontend for the GoHappyGo app.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
```

Create a local env file from the example:

```bash
cp .env.example .env
```

## Development

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## Build and Run

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Dev server with HMR
- `npm run build` - Production build
- `npm run start` - Serve the built app
- `npm run lint` - ESLint checks
- `npm run lint:fix` - Fix lint issues
- `npm run format` - Prettier format
- `npm run format:check` - Prettier check
- `npm run typecheck` - Route types + TS
- `npm run check` - Format check + lint + typecheck

## Environment Variables

Defined in `.env.example`:

- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key (starts with `pk_test_` or `pk_live_`)

## Project Structure

- `app/pages/` - Route modules
- `app/components/` - Shared UI components
- `app/services/` - Data fetching and API helpers
- `app/store/` - State management
- `public/` - Static assets

## Notes

- Styling uses Tailwind CSS.
- React Router handles server-side rendering and data loaders.
