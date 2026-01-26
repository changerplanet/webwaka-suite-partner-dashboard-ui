# Authentication Documentation

**Last Updated:** 2026-01-26  
**Authority:** Constitution Section 17 (System-Wide Authority Map)

## Overview

This document describes the authentication implementation in the Partner Dashboard, which uses the canonical `@webwaka/core-auth-ui` package for all authentication concerns.

## Architecture

The Partner Dashboard implements authentication using the following components from `@webwaka/core-auth-ui@v0.1.0`:

1. **ClerkAuthProvider** - Wraps the application with Clerk authentication provider
2. **RequireAuth** - Component-level authentication guard
3. **withAuthGuard** - Middleware for server-side route protection
4. **SignIn** - Login page component

## Implementation Details

### 1. Root Layout (`app/layout.tsx`)

The root layout wraps all children with `<ClerkAuthProvider>`:

```tsx
import { ClerkAuthProvider } from '@webwaka/core-auth-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkAuthProvider>
          {children}
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
```

### 2. Protected Pages (`app/page.tsx`)

All protected pages wrap their content with `<RequireAuth>`:

```tsx
import { RequireAuth } from '@webwaka/core-auth-ui';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <YourPageContent />
    </RequireAuth>
  );
}
```

### 3. Login Page (`app/login/page.tsx`)

The login page uses the `<SignIn>` component:

```tsx
import { SignIn } from '@webwaka/core-auth-ui';

export default function LoginPage() {
  return (
    <div>
      <SignIn />
    </div>
  );
}
```

### 4. Middleware (`middleware.ts`)

Server-side route protection using `withAuthGuard`:

```tsx
import { withAuthGuard } from '@webwaka/core-auth-ui';

export default withAuthGuard({
  publicRoutes: ['/login(.*)'],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## Environment Variables

### Required Variables

The following environment variables **MUST** be configured in Vercel for authentication to work:

#### Server-Side (Secret)

- **`CLERK_SECRET_KEY`** (REQUIRED)
  - **Purpose:** Server-side secret key for Clerk authentication
  - **Why Required:** Without this key, Clerk middleware silently no-ops on the server side, causing authentication to be bypassed
  - **Format:** `sk_live_...` (production) or `sk_test_...` (development)
  - **Where to Get:** Clerk Dashboard → WebWaka Application → API Keys
  - **Environment:** All (Production, Preview, Development)

#### Client-Side (Public)

- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** (REQUIRED)
  - **Purpose:** Public key for Clerk client-side SDK
  - **Format:** `pk_live_...` (production) or `pk_test_...` (development)

- **`NEXT_PUBLIC_CLERK_FRONTEND_API_URL`** (REQUIRED)
  - **Purpose:** Clerk frontend API endpoint
  - **Format:** `https://clerk.[domain].com`

- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`** (REQUIRED)
  - **Purpose:** URL for the login page
  - **Format:** `/login`

- **`NEXT_PUBLIC_CORE_API_BASE_URL`** (REQUIRED)
  - **Purpose:** Base URL for WebWaka Core API
  - **Format:** `https://api.webwaka.com`

## Symptoms When CLERK_SECRET_KEY is Missing

When `CLERK_SECRET_KEY` is not configured in Vercel, the following symptoms occur:

1. **Silent Authentication Bypass**
   - Dashboard loads without requiring login
   - No redirect to `/login` page
   - Protected content is publicly accessible

2. **Middleware No-Op**
   - `withAuthGuard` middleware silently fails
   - No authentication checks are performed
   - Server-side protection is completely bypassed

3. **Static Prerendering**
   - Pages may be statically prerendered at build time
   - Middleware doesn't run for prerendered pages
   - Old cached versions are served without authentication

## How to Validate Authentication

### Method 1: curl Test (Recommended)

Test the deployment URL with curl to verify authentication is enforced:

```bash
curl -I https://[deployment-url]
```

**Expected Result (Authentication Working):**
```
HTTP/2 401 Unauthorized
cache-control: no-store, max-age=0
set-cookie: _vercel_sso_nonce=...
```

**Incorrect Result (Authentication Bypassed):**
```
HTTP/2 200 OK
x-nextjs-prerender: 1
x-vercel-cache: HIT
```

### Method 2: Browser Test (Incognito)

1. Open incognito/private browsing window
2. Navigate to the dashboard URL
3. **Expected:** Redirect to `/login` page
4. **Incorrect:** Dashboard loads without login

### Method 3: Check Deployment Logs

In Vercel → Deployment → Logs:
- Look for Clerk middleware execution logs
- Verify authentication checks are running

## Relationship to @webwaka/core-auth-ui

This dashboard **MUST NOT**:
- Import `@clerk/nextjs` directly
- Define custom auth middleware
- Implement custom logout logic
- Re-implement any authentication UI

This dashboard **MUST**:
- ONLY consume exports from `@webwaka/core-auth-ui`
- Use provided components and hooks
- Follow authentication patterns defined in the core package

**Authority:** `@webwaka/core-auth-ui` is the **ONLY allowed home** for frontend authentication concerns in the WebWaka platform (Canon Status: LOCKED).

## Known Deployment Caveats

### Domain Misconfiguration (Discovered 2026-01-26)

**Issue:** `partner.webwaka.com` was pointing to an old Vercel project/deployment, causing it to serve stale unauthenticated content despite authentication being fixed in the new deployment.

**Symptoms:**
- Authentication works on Vercel deployment URLs
- Authentication fails on custom domain `partner.webwaka.com`
- curl shows old cached prerendered version on custom domain

**Root Cause:**
- Custom domain was not configured in the correct Vercel project
- DNS was pointing to an outdated deployment
- Old cached static pages were being served

**Resolution:**
1. Verify custom domain is configured in the correct Vercel project
2. Ensure domain points to the latest deployment with authentication
3. Clear Vercel cache if necessary
4. Test authentication on all domains after configuration

## Reference

- **Constitution Section 17:** System-Wide Authority Map
- **Package:** [@webwaka/core-auth-ui](https://github.com/changerplanet/webwaka-core-auth-ui)
- **Clerk Documentation:** [https://clerk.com/docs](https://clerk.com/docs)

## Troubleshooting

### Authentication Not Working

1. **Check Environment Variables**
   - Verify `CLERK_SECRET_KEY` is set in Vercel
   - Verify all public Clerk variables are set
   - Check that variables are available in all environments

2. **Check Deployment**
   - Verify latest code is deployed
   - Check that deployment is assigned to the correct domain
   - Clear Vercel cache if serving old version

3. **Check Middleware**
   - Verify `middleware.ts` exists in project root
   - Verify middleware is using `withAuthGuard` from core-auth-ui
   - Check middleware matcher configuration

4. **Test with curl**
   - Use curl to test deployment URL
   - Expect 401 Unauthorized for unauthenticated access
   - If getting 200 OK, authentication is bypassed

### Common Mistakes

1. **Forgetting CLERK_SECRET_KEY**
   - Most common cause of authentication bypass
   - Always verify this variable is set in Vercel

2. **Wrong Domain Configuration**
   - Custom domain pointing to wrong project
   - Domain pointing to old deployment
   - DNS not updated after domain change

3. **Static Prerendering**
   - Pages must be dynamic for middleware to run
   - Use `export const dynamic = 'force-dynamic'` if needed
   - Avoid static generation for protected pages

## Maintenance Notes

- **Last Authentication Fix:** 2026-01-26 (Commit: 0769c8c)
- **Issue Fixed:** EUV-PARTNER-AUTH-BYPASS
- **Root Cause:** Missing CLERK_SECRET_KEY environment variable
- **Verification:** 401 Unauthorized response confirmed on deployment URL
