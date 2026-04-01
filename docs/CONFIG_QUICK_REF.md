# Config Service - Quick Reference

## Import & Use

### Server-Side
```typescript
import { config } from '@/lib/config'

config.get('DATABASE_URL')           // Get specific variable
config.get('NEXT_PUBLIC_SITE_URL')   // Type-safe access
config.isProduction()                // Check environment
config.isDevelopment()               // Check environment
config.getSiteUrl()                  // Get URL without trailing slash
config.getAll()                      // Get all config (for logging)
```

### Client-Side
```typescript
import { publicConfig } from '@/lib/config.client'

publicConfig.SITE_URL
publicConfig.EMAIL_MAIL
publicConfig.RESUME_URL
publicConfig.MAILCHIMP_URL
```

## Add New Variable

### 1. Add to `.env.example` & `.env.local`
```bash
MY_NEW_VAR="some_value"
# or for public:
NEXT_PUBLIC_MY_VAR="some_value"
```

### 2. Update `src/lib/config.ts`
```typescript
const envSchema = z.object({
  // ... existing vars
  MY_NEW_VAR: z.string(),  // or z.string().optional()
})
```

### 3. If Public, Update `src/lib/config.client.ts`
```typescript
export const publicConfig = {
  // ... existing vars
  MY_VAR: process.env.NEXT_PUBLIC_MY_VAR ?? "",
} as const
```

## Validation Rules

```typescript
z.string()              # Any string
z.string().email()      # Valid email
z.string().url()        # Valid URL
z.string().optional()   # Optional (can be undefined)
z.string().default("x") # Default value
z.string().min(5)       # Minimum length
z.string().max(100)     # Maximum length
```

## Error Handling

If validation fails on startup, Next.js will show:
```
❌ Invalid environment variables:
EMAIL_MAIL: Invalid email
DATABASE_URL: Required
```

Check `.env.local` and make sure all required vars are set.

## Best Practices

✅ Always use config service instead of `process.env`
✅ Use `NEXT_PUBLIC_` prefix for public variables
✅ Add validation rules for new variables
✅ Never hardcode secrets (use env vars)
✅ Use `isProduction()` for environment-specific logic

## Common Variables

```typescript
// Email
config.get('NEXT_PUBLIC_EMAIL_MAIL')
config.get('NEXT_PUBLIC_EMAIL_USER')
config.get('NEXT_PUBLIC_EMAIL_APP_PASS')

// Database (server-only)
config.get('DATABASE_URL')
config.get('POSTGRES_URL')

// Website
config.get('NEXT_PUBLIC_SITE_URL')
config.getSiteUrl()  // Removes trailing slash

// Links
publicConfig.RESUME_URL
publicConfig.MAILCHIMP_URL
```

## Debugging

```typescript
// Log all config (server-side only!)
console.log(config.getAll())

// Check environment
console.log('Environment:', config.isDevelopment() ? 'dev' : 'prod')

// Verify a single variable
console.log('Site URL:', config.get('NEXT_PUBLIC_SITE_URL'))
```

## See Also

- [`CONFIG_SERVICE.md`](./CONFIG_SERVICE.md) - Full setup guide
- [`src/lib/CONFIG.md`](./src/lib/CONFIG.md) - Detailed reference
- [Zod Docs](https://zod.dev) - Validation library
