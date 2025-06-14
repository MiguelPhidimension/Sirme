#!/bin/bash

# SIRME Deployment Script for Vercel with Bun
# This script helps with manual deployments and troubleshooting

set -e  # Exit on any error

echo "🚀 Starting SIRME deployment process..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    bun add -g vercel
fi

echo "📦 Installing dependencies with Bun..."
bun install

echo "🔍 Running type check..."
if ! bun run type-check; then
    echo "❌ Type check failed! Please fix TypeScript errors before deploying."
    exit 1
fi

# Run linting but don't fail on warnings/errors for deployment
echo "🎨 Running linter (warnings only)..."
bun run lint || echo "⚠️  Linting issues detected but continuing with deployment..."

echo "🏗️  Building project..."
if ! bun run build; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if --deploy flag is passed
if [[ "$1" == "--deploy" ]]; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    echo "🎉 Deployment completed!"
else
    echo "📋 Build completed. To deploy, run:"
    echo "   ./scripts/deploy.sh --deploy"
    echo "   or"
    echo "   vercel --prod"
fi

echo "✨ Done!" 