#!/bin/bash
# Quick Sentry Removal Script
# Run this if you want to completely remove Sentry from the project

echo "🗑️  Removing Sentry from JobPay Frontend..."

# Remove Sentry configuration files
rm -f sentry.client.config.ts
rm -f sentry.server.config.ts  
rm -f sentry.edge.config.ts
rm -f instrumentation.ts

# Remove Sentry from package.json
npm uninstall @sentry/nextjs

# Remove Sentry documentation
rm -f docs/MONITORING.md

# Remove Sentry-related environment variables from .env.example
sed -i '' '/SENTRY/d' .env.example

echo "✅ Sentry completely removed!"
echo "📝 You may also want to:"
echo "   - Remove any Sentry imports from your code"
echo "   - Remove SENTRY_DSN from your environment variables"
echo "   - Update next.config.js if you had Sentry webpack config"
