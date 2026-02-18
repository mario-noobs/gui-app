# GUI App

React 18 + TypeScript single-page application for the Face Recognition System. Built with Vite, styled with Tailwind CSS + Material Tailwind.

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (http://localhost:5173)
pnpm build            # Production build (tsc + vite)
pnpm lint             # ESLint check
npx tsc --noEmit      # Type check only
```

### Environment

```bash
VITE_APP_API_URL=http://localhost:3000   # API base URL (dev)
```

In Docker: defaults to `/gateway`, nginx proxies `/gateway/*` to `backend:8080`.

## Architecture

Modular by feature under `src/modules/`:

```
src/modules/
├── core/       # Shared: MainRouter, MainLayout, Header, Sidebar, Axios interceptor
├── auth/       # Login, Register, ForgotPassword, ResetPassword, AcceptInvitation, AuthContext
├── home/       # Dashboard, Profile, Audit, ChangePassword modal
├── face-reg/   # Face register & recognize UI (camera + upload)
├── admin/      # Admin dashboard, UserManagement, RoleManagement (SUPERADMIN only)
└── todo/       # Todo list feature
```

Each module has: `components/`, `pages/`, `services/`, `models/`, and optionally `hooks/`, `context/`, `utils/`, `styles/`.

## Routing

**Public routes** (under `AuthLayout`):
- `/login` — Login
- `/register` — Register
- `/forgot-password` — Request password reset email
- `/reset-password` — Set new password via token link
- `/accept-invitation` — Accept admin invitation & set password

**Protected routes** (under `PrivateComponent` + `MainLayout`):
- `/`, `/dashboard` — Dashboard
- `/profile` — Profile management
- `/audit` — Audit logs (AdminRoute guard)
- `/face-regconize/register` — Face registration (permission guard)
- `/face-regconize/recognize` — Face recognition (permission guard)
- `/admin`, `/admin/users`, `/admin/roles` — Admin panel (AdminRoute guard)

## Auth & Token Management

- **Login flow:** Authenticate -> store tokens in localStorage -> fetch profile -> hydrate AuthContext
- **Token refresh:** Axios interceptor catches 401 -> queues concurrent requests -> refreshes token -> retries all
- **RBAC helpers:** `hasPermission()`, `hasRole()`, `isSuperAdmin()` in AuthContext
- **Route guards:** `PrivateComponent` (auth), `AdminRoute` (SUPERADMIN), `FaceRegRouteGuard` (permissions)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Material Tailwind | UI component library |
| React Hook Form + Yup | Form handling & validation |
| Axios | HTTP client with interceptors |
| notistack | Toast notifications |
| Heroicons / Lucide | Icons |

## Docker

```bash
docker build -t gui-app .
```

Multi-stage build: Node builder -> nginx Alpine. Serves static files and proxies `/gateway/*` to backend.
