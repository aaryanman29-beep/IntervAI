# IntervAI — AI Interview Preparation

A polished, responsive frontend for practicing role-specific interviews, receiving mock AI feedback, browsing questions, and tracking preparation progress.

## Features

- Landing, login, and registration experiences
- Configurable mock interview flow with simulated recording states
- Detailed AI-style results and answer feedback
- Searchable, filterable question bank and bookmarks
- Recharts-powered performance analytics
- Interview history, profile, and frontend-only settings
- Responsive desktop sidebar and mobile navigation
- Mock API service boundary ready for backend integration

## Technology

React 19, Vite, Tailwind CSS v4, React Router, Lucide React, and Recharts.

## Local development

```bash
pnpm install
pnpm dev
```

The Figma Make environment starts the Vite development server automatically. Use `pnpm build` for a production build.

## Structure

- `src/components` — reusable UI, layout, interview, dashboard, feedback, and analytics components
- `src/pages` — route-level screens
- `src/data` — realistic mock datasets
- `src/services/api.js` — replaceable asynchronous mock API layer
- `src/hooks` and `src/utils` — shared application helpers

## Environment variables

Copy `.env.example` to `.env` when connecting a backend:

```bash
VITE_API_URL=http://localhost:5000/api
```

No secrets should be stored in frontend environment variables.

## Connecting a backend

Keep the exported function signatures in `src/services/api.js` and replace each `mockRequest` implementation with `fetch` calls to `API_URL`. Pages and components already depend on this service boundary, so the UI can remain unchanged while the backend is integrated.
