# Config Service Documentation

## Overview

The config service provides type-safe access to environment variables with automatic validation using Zod.

## Files

- **`src/lib/config.ts`** - Server-side config service with full validation
- **`src/lib/config.client.ts`** - Client-safe config with only public variables
- **`.env.example`** - Environment variable template

## Usage

### Server-Side (API Routes, Server Components)

```typescript
import { config } from '@/lib/config'

// Get a specific variable
const siteUrl = config.get('NEXT_PUBLIC_SITE_URL')
const d1AccountId = config.get('D1_ACCOUNT_ID')

// Check environment
if (config.isProduction()) {
  // Production-specific logic
}

// Get all config (for logging/debugging)
console.log(config.getAll())

// Helper methods
const url = config.getSiteUrl() // URL without trailing slash
```

### Client-Side (React Components, Browser)

```typescript
'use client'

import { publicConfig } from '@/lib/config.client'

export function ContactButton() {
  const email = publicConfig.EMAIL_MAIL
  const siteUrl = publicConfig.SITE_URL

  return (
    <button onClick={() => window.open(`mailto:${email}`)}>
      Contact Me
    </button>
  )
}
```

### In Environment Variable Access

```typescript
// ✅ DO: Use the config service
import { config } from '@/lib/config'
const accountId = config.get('D1_ACCOUNT_ID')

// ❌ DON'T: Access process.env directly
const accountId = process.env.D1_ACCOUNT_ID // loses type safety
```

## Environment Variables

### Public Variables (NEXT_PUBLIC_*)

These are accessible in browser and server:

- `NEXT_PUBLIC_SITE_URL` - Website URL (e.g., https://njmtech.vercel.app)
- `NEXT_PUBLIC_EMAIL_MAIL` - Contact email address
- `NEXT_PUBLIC_EMAIL_USER` - Email account for sending
- `NEXT_PUBLIC_EMAIL_APP_PASS` - Email app password
- `NEXT_PUBLIC_MAILCHIMP_URL` - Mailchimp newsletter subscribe URL
- `NEXT_PUBLIC_RESUME_URL` - Resume/CV download URL

### Private Variables (Server-only)

These are only accessible in server-side code:

- `D1_ACCOUNT_ID` - Cloudflare account identifier
- `D1_DATABASE_ID` - Cloudflare D1 database identifier
- `D1_API_TOKEN` - Cloudflare API token with D1 access

## Validation

The config service automatically validates environment variables on startup using Zod schema.

If validation fails, you'll see an error like:

```
❌ Invalid environment variables:
NEXT_PUBLIC_EMAIL_MAIL: Invalid email
D1_ACCOUNT_ID: Required

Please check your .env.local file.
```

## Type Safety

The config service is fully typed with TypeScript:

```typescript
import { config, Config } from '@/lib/config'

// Type inference
const url = config.get('NEXT_PUBLIC_SITE_URL') // string
const d1AccountId = config.get('D1_ACCOUNT_ID') // string | undefined

// Access typed config directly
const allConfig: Config = config.getAll()
```

## Adding New Variables

To add a new environment variable:

1. Add to `.env.example`
2. Add to `src/lib/config.ts` schema
3. Add to `src/lib/config.client.ts` if it's public

Example:

```typescript
// In src/lib/config.ts
const envSchema = z.object({
  // ... existing vars
  MY_NEW_VAR: z.string().optional(),
})
```

## Best Practices

1. ✅ Use `NEXT_PUBLIC_` prefix for public variables
2. ✅ Add all variables to `.env.example`
3. ✅ Use the config service instead of `process.env`
4. ✅ Add validation rules to the Zod schema
5. ❌ Never hardcode sensitive values
6. ❌ Don't expose private variables in client code
