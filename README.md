TESTING CHANGES AFTER POWER OUTAGE

# strife-front

Frontend for **Strife** — a military encyclopedia covering vehicles and weapons used by countries throughout history.

This is a clean Next.js rewrite of the original SiteStrife project, consuming the [`strife-api`](https://github.com/your-org/strife-api) Spring Boot REST backend.

---

## Tech stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **API:** Fetches from `strife-api` running locally on `http://localhost:8080`

---

## Prerequisites

- Node.js
- [`strife-api`](https://github.com/your-org/strife-api) running on port `8080`

---

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
app/
├── page.tsx                        # Home — lists all 5 domains
├── [domain]/
│   └── page.tsx                    # Lists countries in a domain
│   └── [country]/
│       └── page.tsx                # Lists families for a country
│       └── [family]/
│           └── page.tsx            # Lists models in a family
│           └── [model]/
│               └── page.tsx        # Full article page for a model
├── admin/
│   ├── page.tsx                    # Login
│   ├── dashboard/
│   │   └── page.tsx                # Admin dashboard
│   ├── new/
│   │   └── page.tsx                # Multi-step form to create a new article
│   └── edit/
│       └── [model]/
│           └── page.tsx            # Edit form for an existing model
lib/
└── api.ts                          # Central API client — all fetch calls to strife-api
components/
├── ArticleContent.tsx              # Generic spec renderer (replaces old domain-specific components)
├── InfoRow.tsx                     # Label/value pair
└── SectionTitle.tsx                # Section header
```

---

## API

All requests go through `lib/api.ts`, which targets `http://localhost:8080/api`.

| Endpoint | Description |
|----------|-------------|
| `GET /api/domains` | All domains |
| `GET /api/domains/{domain}/countries` | Countries in a domain |
| `GET /api/domains/{domain}/countries/{country}/families` | Families for a country |
| `GET /api/families/{family}/models` | Models in a family |
| `GET /api/models/{model}` | Full model detail |

Admin endpoints (`/api/admin/**`) require a JWT token obtained via `POST /api/admin/auth/login`.

---

## Related

- [`strife-api`](https://github.com/your-org/strife-api) — Spring Boot 3.5 / Java 21 backend