# Config Service Setup Guide

## Overview

A type-safe configuration service for managing environment variables with automatic validation using Zod.

## Files Created

```
src/lib/config.ts              # Server-side config service with validation
src/lib/config.client.ts       # Client-safe config (public variables only)
src/lib/CONFIG.md              # Detailed documentation
app/api/config/route.ts        # Example API route using config service
```

## Quick Start

### Server-Side Usage (API Routes, Server Components)

```typescript
import { config } from '@/lib/config'

// Get a specific variable
const siteUrl = config.get('NEXT_PUBLIC_SITE_URL')
const dbUrl = config.get('DATABASE_URL')

// Check environment
if (config.isProduction()) {
  // Production-specific logic
}

// Get cleaned URL
const url = config.getSiteUrl() // removes trailing slash
```

### Client-Side Usage (React Components)

```typescript
'use client'

import { publicConfig } from '@/lib/config.client'

export function Component() {
  const email = publicConfig.EMAIL_MAIL
  const resumeUrl = publicConfig.RESUME_URL
  
  return <a href={resumeUrl}>Download Resume</a>
}
```

## Environment Variables

### Public Variables (Accessible in Browser)

- `NEXT_PUBLIC_SITE_URL` - Website URL
- `NEXT_PUBLIC_EMAIL_MAIL` - Contact email
- `NEXT_PUBLIC_EMAIL_USER` - Email sender
- `NEXT_PUBLIC_EMAIL_APP_PASS` - Email password
- `NEXT_PUBLIC_MAILCHIMP_URL` - Newsletter URL
- `NEXT_PUBLIC_RESUME_URL` - Resume download URL

### Private Variables (Server-Only)

- `DATABASE_URL` - Primary database connection
- `POSTGRES_URL` - PostgreSQL with pooler
- `POSTGRES_URL_NON_POOLING` - Direct PostgreSQL connection
- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`

## Features

✅ **Type-Safe** - Full TypeScript support with inference
✅ **Validated** - Zod schema validation on startup
✅ **Error Reporting** - Clear error messages for missing vars
✅ **Environment Detection** - Built-in `isProduction()` and `isDevelopment()` methods
✅ **Singleton Pattern** - Single instance across app
✅ **Client Safety** - Separate module for public variables

## Configuration

### Add New Variables

1. Add to `.env.example`:
```bash
MY_NEW_VAR="value"
```

2. Update schema in `src/lib/config.ts`:
```typescript
const envSchema = z.object({
  // ... existing
  MY_NEW_VAR: z.string(),
})
```

3. Export from `src/lib/config.client.ts` if public:
```typescript
export const publicConfig = {
  // ... existing
  MY_NEW_VAR: process.env.NEXT_PUBLIC_MY_NEW_VAR ?? "",
} as const
```

## Example API Route

```typescript
// app/api/config/route.ts
import { config } from '@/lib/config'

export async function GET() {
  return Response.json({
    siteUrl: config.get('NEXT_PUBLIC_SITE_URL'),
    environment: config.isDevelopment() ? 'dev' : 'prod',
  })
}
```

## Validation Rules

Common Zod validators:

```typescript
z.string()              // Any string
z.string().email()      // Valid email
z.string().url()        // Valid URL
z.string().optional()   // Optional string
z.string().min(5)       # Minimum length
z.string().default()    # Default value
```

## Error Handling

If validation fails on startup:

```
❌ Invalid environment variables:
NEXT_PUBLIC_EMAIL_MAIL: Invalid email
DATABASE_URL: Required

Please check your .env.local file.
```

## Best Practices

✅ Use `NEXT_PUBLIC_` prefix for public variables
✅ Add all variables to `.env.example`
✅ Use the config service, not `process.env` directly
✅ Add validation rules to schema
✅ Never hardcode secrets
✅ Never expose private variables in client code

## Testing

```bash
# Build with validation
pnpm build

# Test dev server
pnpm dev

# Check config in browser
curl http://localhost:3000/api/config?endpoint=health
```

## Migration Path

If you have hardcoded URLs/values, replace with config:

```typescript
// Before
const url = 'https://hardcoded.url/path'

// After
import { publicConfig } from '@/lib/config.client'
const url = publicConfig.RESUME_URL
```

## See Also

- [`src/lib/CONFIG.md`](./CONFIG.md) - Detailed documentation
- [`next.config.js`](/next.config.js) - Next.js configuration
- [`.env.example`](/.env.example) - Environment variable template
- [Zod Documentation](https://zod.dev/) - Schema validation library
