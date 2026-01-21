# WebWaka Suite Partner Dashboard UI

## Overview
Phase 4C Partner Dashboard UI - A pure declarative consumer of canonical @webwaka/* control packages following WebWaka Ecosystem Constitution v1.5+.

## Project Architecture
- **Framework**: Next.js 16 with React 19 (server-side rendering)
- **Port**: 5000 (development and production)
- **Build Output**: `.next/` directory
- **Control Consumer Pattern**: Single consumer at `src/lib/control-consumer.ts`

## Constitutional Compliance
- All control logic from npm-published @webwaka/* packages
- Server-side dashboard resolution only
- Client components are pure renderers
- Nigeria-first: ₦ (NGN) currency only
- Deterministic: explicit evaluationTime, no Date.now() or Math.random()

## Dependencies (npm only)
- @webwaka/core-dashboard-control
- @webwaka/core-permissions
- @webwaka/core-entitlements
- @webwaka/core-feature-flags
- @webwaka/core-branding
- @webwaka/suite-partner-dashboard-control

## File Structure
```
src/
  lib/
    control-consumer.ts  - ONLY file importing @webwaka/* packages
  components/
    DashboardUI.tsx      - Pure declarative UI component
app/
  page.tsx               - Server-side resolution (Next.js server component)
  layout.tsx             - Root layout
  globals.css            - Global styles
__tests__/
  control-consumer.test.ts - Required tests (determinism, visibility, currency)
```

## Running the Project
- **Development**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm start`
- **Test**: `npm test`

## Tests
- Dashboard visibility changes when control inputs change
- Determinism (10x identical evaluations)
- Single control consumer pattern enforced
- Snapshot integrity verification
- Nigeria-first currency enforcement

## Recent Changes
- 2026-01-21: Phase 4C implementation with @webwaka/* npm packages
- Server-side dashboard resolution via Next.js
- Pure declarative UI components
- All required tests passing

## User Preferences
- None documented yet
