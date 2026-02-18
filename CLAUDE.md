# GUI App - Claude Code Guide

## Overview

React 18 + TypeScript SPA. Vite build, Tailwind CSS styling, Axios HTTP client with JWT token management.

## Build & Run

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (port 5173)
pnpm build            # Production build (tsc + vite)
pnpm lint             # ESLint check
npx tsc --noEmit      # Type check only
```

## Architecture: Modular by Feature

```
src/modules/
├── core/       # Shared: MainRouter, MainLayout, Header, Sidebar, Axios interceptor
├── auth/       # Login, Register, ForgotPassword, ResetPassword, AcceptInvitation, AuthContext
├── home/       # Dashboard, Profile, Audit, ChangePassword modal
├── face-reg/   # Face register & recognize UI (camera + upload)
├── admin/      # Admin dashboard, UserManagement, RoleManagement (SUPERADMIN only)
└── todo/       # Todo list feature
```

Each module has: `components/`, `pages/`, `services/`, `models/`, and optionally `hooks/`, `context/`, `utils/`, `styles/`

## Key Files

| Purpose | Path |
|---------|------|
| App entry | `src/main.tsx` → `App.tsx` |
| Router | `modules/core/components/MainRouter.tsx` |
| Layout (auth pages) | `modules/auth/components/AuthLayout.tsx` |
| Layout (app pages) | `modules/core/components/MainLayout.tsx` |
| Sidebar nav | `modules/home/Sidebar.tsx` |
| Axios interceptor | `modules/core/services/axios.ts` |
| Auth context | `modules/auth/context/authContext.tsx` |
| Auth types | `modules/auth/models/auth.ts` |
| Auth API client | `modules/auth/services/api.ts` |
| Admin API client | `modules/admin/services/adminApi.ts` |
| Admin types | `modules/admin/models/admin.ts` |
| Route guards | `modules/auth/components/PrivateComponent.tsx`, `AdminRoute.tsx` |

## Routing

**Public routes** (under `AuthLayout`):
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/accept-invitation`

**Protected routes** (under `PrivateComponent` → `MainLayout` + `Sidebar`):
- `/`, `/dashboard` → Dashboard
- `/profile` → Profile management
- `/audit` → Audit logs (AdminRoute guard)
- `/face-regconize/register` → Face registration (permission guard)
- `/face-regconize/recognize` → Face recognition (permission guard)
- `/admin`, `/admin/users`, `/admin/roles` → Admin panel (AdminRoute guard)

## Auth & Token Management

**Login flow:** `LoginAPI` → store `access_token` + `refresh_token` in localStorage → `GetProfileAPI` → hydrate `AuthContext`.

**Token refresh:** Axios response interceptor catches 401 → queues concurrent requests → calls `/api/v1/user/refresh` → retries all queued requests with new token. On refresh failure → clears localStorage → redirects to `/login`.

**RBAC helpers** in `AuthContext`:
- `hasPermission(perm: string)` — checks `profile.role.permissions` array
- `hasRole(name: string)` — exact role name match
- `isSuperAdmin()` — checks role name === "SUPERADMIN"

**Route guards:**
- `PrivateComponent` — redirects unauthenticated to `/login`
- `AdminRoute` — redirects non-SUPERADMIN to `/dashboard`
- `FaceRegRouteGuard` — checks `face:register` or `face:recognize` permission

## API Integration

All API clients use the shared Axios interceptor from `core/services/axios.ts`. Module-specific clients:

- `auth/services/api.ts` — Login, Register, Profile, ChangePassword, ForgotPassword, ResetPassword, AcceptInvitation, Logout, Refresh
- `admin/services/adminApi.ts` — Users CRUD, Roles CRUD, Permissions, InviteUser
- `home/services/auditApi.ts` — Audit log queries

**API base URL:** Set via `VITE_APP_API_URL` env var. In Docker builds defaults to `/gateway` (nginx proxies to backend).

## Conventions

- **Types:** All in `models/` files with `I` prefix (e.g., `IProfile`, `ILoginForm`)
- **API responses:** Backend returns `{ data: T }` or `{ error: { code, message } }`. Typed as `ApiResponse<T>`.
- **Forms:** React Hook Form + Yup validation schemas in `auth/models/schema.ts`
- **Notifications:** `enqueueSnackbar()` from notistack for success/error toasts
- **Styling:** Tailwind utility classes. No CSS modules. Module-specific CSS only in `face-reg/`.
- **Components:** UI library is Material Tailwind (`@material-tailwind/react`) for buttons, typography, etc.
- **Icons:** Heroicons (`@heroicons/react`) for UI icons, Lucide/React Icons for others

## Adding a New Page

1. Create component in the relevant module's `pages/` or `components/`
2. Add API functions to the module's `services/` file
3. Add route in `MainRouter.tsx` (under appropriate guard if protected)
4. Add sidebar link in `home/Sidebar.tsx` if needed (set `adminOnly: true` for admin pages)

## Environment

```bash
VITE_APP_API_URL=http://localhost:3000   # API base URL (dev)
```

In Docker: defaults to `/gateway`, nginx proxies `/gateway/*` → backend:8080.
