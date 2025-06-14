# SIRME Deployment Checklist

## Pre-Deployment Checklist

Before deploying to Vercel, make sure you've completed all these steps:

### ✅ Environment Setup

- [ ] **Bun installed** locally (`bun --version` works)
- [ ] **Vercel account** created and accessible
- [ ] **Git repository** set up and code pushed
- [ ] **Environment variables** documented in `.env.example`

### ✅ Configuration Files

- [ ] **`vercel.json`** - Configured with Bun build commands
- [ ] **`package.json`** - Contains all necessary scripts
- [ ] **`vite.config.ts`** - Optimized for production builds
- [ ] **`.env.example`** - All required variables documented

### ✅ Code Quality

- [ ] **TypeScript check passes** (`bun run type-check`)
- [ ] **Linting passes** (`bun run lint`)
- [ ] **Build succeeds locally** (`bun run build`)
- [ ] **Preview works** (`bun run preview`)

### ✅ GraphQL Configuration

- [ ] **Hasura endpoint** is accessible and working
- [ ] **Admin secret** is correct and secure
- [ ] **GraphQL queries** tested and working
- [ ] **Error handling** implemented for API failures

### ✅ Vercel Setup

- [ ] **Project connected** to Git repository
- [ ] **Environment variables** set in Vercel dashboard:
  - `VITE_HASURA_ADMIN_SECRET`
  - `VITE_GRAPHQL_ENDPOINT`
  - `NODE_ENV=production`
- [ ] **Build settings** verified (should auto-detect from `vercel.json`)

### ✅ Performance & Security

- [ ] **Bundle size** acceptable (check build output)
- [ ] **Security headers** configured in `vercel.json`
- [ ] **SPA routing** configured for React Router
- [ ] **Asset caching** headers set up

## Deployment Commands

### Quick Test Build
```bash
# Clean and build
rm -rf dist
bun install
bun run build
```

### Manual Deploy
```bash
# Using custom script
./scripts/deploy.sh --deploy

# Using Vercel CLI directly
vercel --prod
```

### Post-Deployment Verification

- [ ] **Site loads** correctly
- [ ] **GraphQL queries** work in production
- [ ] **Routing** works for all pages
- [ ] **Environment variables** are properly loaded
- [ ] **Performance** is acceptable (check Lighthouse scores)
- [ ] **Error handling** works as expected

## Common Issues & Solutions

### Build Failures
- Clear `node_modules` and `dist` directories
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Environment Issues
- Ensure all `VITE_*` variables are set in Vercel
- Verify GraphQL endpoint accessibility
- Check for typos in variable names

### Performance Issues
- Review bundle size warnings
- Optimize images and assets
- Check network requests in browser dev tools

### Routing Issues
- Verify `vercel.json` rewrites configuration
- Test direct URL access to routes
- Check React Router setup

## Notes

- Builds typically take 1-3 minutes with Bun
- Automatic deployments trigger on every push to main branch
- Use Vercel dashboard to monitor build logs and deployment status
- Production builds have console logs removed automatically 