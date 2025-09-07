# Monitoring Setup

**Ultra-minimal monitoring - everything in one file!** 🎯

## 📁 Files

```
sentry.client.config.ts         # ✅ ONE file with everything
sentry.server.config.ts         # ✅ Just imports client config (1 line)
sentry.edge.config.ts           # ✅ Just imports client config (1 line)
instrumentation.ts              # ✅ Next.js requirement (minimal)
```

## 🚀 Usage

```typescript
import {
  captureError,
  setUser,
  addBreadcrumb,
} from '../../../sentry.client.config';

// Report errors
captureError(error, { tags: { section: 'checkout' } });

// Set user
setUser({ id: user.id, email: user.email });

// Add breadcrumb
addBreadcrumb('User action', { button: 'checkout' });
```

## �️ Removal (if needed)

**Option 1: Quick removal script**

```bash
./remove-sentry.sh
```

**Option 2: Manual removal**

1. Delete 3 sentry files:

   ```bash
   rm sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts instrumentation.ts
   ```

2. Remove package:

   ```bash
   npm uninstall @sentry/nextjs
   ```

3. Remove imports from your code (if any)

4. Remove environment variables:
   ```bash
   # Remove NEXT_PUBLIC_SENTRY_DSN from .env files
   ```

**Done!** ✨ Sentry completely removed.

## ✨ Benefits

- ✅ **One place**: All logic in `sentry.client.config.ts`
- ✅ **Auto-disabled**: Works without Sentry DSN
- ✅ **Easy removal**: Delete 3 files + 1 package
- ✅ **No extra files**: Uses required Next.js files only
- ✅ **Shared setup**: Server/edge just import client config

**Absolute minimum!** One file with logic, two 1-line imports. 🎉
