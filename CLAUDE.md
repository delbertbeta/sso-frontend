# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Single Sign-On (SSO) frontend application built with Vue 3 + TypeScript + Vite. It implements OIDC (OpenID Connect) authentication flow and provides both user-facing authentication pages and administrative dashboards for managing applications and secrets.

## Common Commands

```bash
# Development server (runs on port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

Note: The project uses yarn but package.json shows npm scripts - both work due to yarn's compatibility.

## Architecture

### Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 5.0.12
- **Language**: TypeScript 5.3.3 (strict mode enabled)
- **State Management**: Vuex 4.1.0
- **Routing**: Vue Router 4
- **UI Framework**: TDesign Vue Next 1.8.0 (Tencent design system)
- **Key Libraries**: Day.js, Lodash-es, JSEncrypt for RSA encryption

### Path Aliases

The project uses extensive path aliases configured in both vite.config.ts and tsconfig.json:

- `@/` → `src/`
- `$router/` → `src/router/`
- `$api/` → `src/api/`
- `$pages/` → `src/pages/`
- `$components/` → `src/components/`
- `$utils/` → `src/utils/`
- `$layouts/` → `src/layouts/`
- `$store/` → `src/store/`
- `$typings/` → `src/typings/`
- `$constants/` → `src/constants/`

### API Layer

- Centralized HTTP client in `src/api/request.ts` with typed responses
- All APIs return `OkResponse<T>` or `ErrorResult` types
- Automatic error handling and CORS configuration
- API endpoints configured in `src/api/url.ts`
- Build-time API endpoint configuration via `API_END_POINT` constant

### State Management

- Vuex store with user authentication module in `src/store/user/`
- Automatic login validation and token refresh
- Redirect to login when token expires (error code 106)
- Route preservation for post-login redirects

### Routing & Layouts

- Dual layout system: `LoginLayout` for auth pages, `DefaultLayout` for main app
- Authentication protection on routes
- Login pages: `/login`, `/register`
- Admin dashboard: `/admin/users`, `/admin/apps`, `/admin/secrets`
- OIDC consent: `/oidc/authorize`

## Development Configuration

### Environment Setup

- App environment config in `config/app.ts` with `dev` / `staging` / `prod` variants
- HMR configured for port 3001
- Host binding to `0.0.0.0` for network access

### Auto-imports

- TDesign components are auto-imported via unplugin
- Vue composables from TDesign are auto-imported
- No manual imports needed for TDesign components

### Build Process

- TypeScript compilation with `vue-tsc` for type checking
- Vite handles module bundling and asset optimization
- Production builds output to `/dist` directory

## CI/CD Pipeline

Drone CI configuration in `.drone.yml`:

- Triggers on push to main branch
- Uses Node.js 20 Docker image
- Production build uses `npm run build` and staging can use `npm run build:staging`
- Builds and deploys to S3 storage
- Static asset serving from S3

## Key Implementation Details

### Authentication Flow

1. RSA encryption for login/register form data using JSEncrypt
2. JWT token-based authentication with automatic refresh
3. Session persistence and validation
4. Chinese mobile number validation supported

### OIDC Integration

- OpenID Connect authorization endpoint at `/oidc/authorize`
- Consent page for third-party application authorization
- Redirect URL parameter support
- User consent management

### Admin Features

- User management with search/filter capabilities
- Application CRUD operations with image uploads
- Application secrets generation and management
- Icon upload functionality for applications

### Security Measures

- CORS protection with credentials
- XSRF protection through cookies
- Secure credential handling
- Input validation and sanitization

## File Structure Patterns

- Components organized by feature (auth/, admin/, oidc/)
- Shared reusable components in `src/components/`
- TypeScript definitions in `src/typings/`
- Utility functions in `src/utils/`
- Constants in `src/constants/`

## Development Notes

1. **Port Configuration**: Dev server runs on port 3001, ensure it's available
2. **API Integration**: All API calls are strongly typed - check `src/api/` for response formats
3. **Authentication**: Login state automatically validated on app load
4. **Chinese Localization**: App uses `zh-cn` locale for dayjs and UI components
5. **TDesign Components**: Use the TDesign Vue Next documentation for component props
6. **Build Dependencies**: CI uses yarn but npm scripts work for local development
