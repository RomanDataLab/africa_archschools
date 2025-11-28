# 🚀 Deployment Guide

## Prepare for GitHub and Vercel

### Step 1: Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit: African Architecture Schools Voronoi Map"
```

### Step 2: Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/RomanDataLab/africa_archschools.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `RomanDataLab/africa_archschools`
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

### Step 4: Environment Variables (if needed)

The Mapbox token is currently hardcoded in `src/config.ts`. For production, consider:

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add: `VITE_MAPBOX_TOKEN` = your token
3. Update `src/config.ts` to use:
   ```typescript
   export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'fallback-token';
   ```

## 📦 What Gets Deployed

### Included Files:
✅ `index.html`
✅ `package.json`
✅ `tsconfig.json`
✅ `vercel.json`
✅ `src/` folder (all TypeScript files)
✅ `African_Architecture_Schools_expanded.csv`
✅ `README.md`
✅ Documentation files (*.md)

### Excluded Files (via .gitignore):
❌ `node_modules/`
❌ `dist/` (generated on build)
❌ Python scripts (*.py)
❌ Old test files (voronoi_map.html, test-voronoi.html)
❌ Videos and screenshots
❌ IDE settings

## 🔍 Verify Deployment

After deployment:

1. ✅ Check map loads correctly
2. ✅ Verify all 141 schools appear
3. ✅ Test Voronoi cells render properly
4. ✅ Test buffer zone displays
5. ✅ Test click interactions work
6. ✅ Check mobile responsiveness

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Map Doesn't Load

- Check Mapbox token is valid
- Check browser console for errors
- Verify network requests aren't blocked

### Voronoi Cells Missing

- Check console for Turf.js errors
- Verify data.ts has all schools
- Check buffer polygon is valid

## 📊 Performance Tips

1. **Optimize Build Size**: Already configured in Vite
2. **Enable Compression**: Vercel handles this automatically
3. **CDN**: Vercel provides global CDN by default
4. **Analytics**: Add Vercel Analytics if needed

## 🔄 Updating the Site

```bash
# Make changes
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy
```

## 📱 Custom Domain (Optional)

In Vercel Dashboard:
1. Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

**Your map will be live at:**
- https://africa-archschools.vercel.app (default)
- https://your-custom-domain.com (if configured)



