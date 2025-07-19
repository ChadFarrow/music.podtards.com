# Deployment Guide for Podtardstr Music

This guide will help you deploy the Podtardstr Music site to `music.podtards.com`.

## 🚀 Vercel Deployment

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository (GitHub, GitLab, etc.)
4. Select the `podtardstr-music` repository

### Step 2: Configure Build Settings

Set the following build configuration:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `./` (leave empty)

### Step 3: Configure Domain

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add custom domain: `music.podtards.com`
3. Configure DNS records as instructed by Vercel

### Step 4: Environment Variables

No environment variables are required for this project as it's a static site.

### Step 5: Deploy

1. Push your code to the main branch
2. Vercel will automatically build and deploy
3. Your site will be available at `https://music.podtards.com`

## 🔧 DNS Configuration

You'll need to add the following DNS records to your domain provider:

```
Type: CNAME
Name: music
Value: cname.vercel-dns.com
TTL: 3600
```

## 📱 PWA Configuration

The site includes PWA support with:

- **Service Worker**: Automatic caching for offline support
- **Web App Manifest**: Installable on mobile devices
- **Icons**: Various sizes for different devices

## 🔄 Continuous Deployment

Once configured, Vercel will automatically:

- Build and deploy on every push to main branch
- Provide preview deployments for pull requests
- Handle SSL certificates automatically
- Optimize assets and enable CDN caching

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance Optimization

The build includes:

- **Code Splitting**: Automatic chunking for faster loading
- **Asset Optimization**: Minified CSS and JavaScript
- **Image Optimization**: WebP format support
- **Caching**: Long-term caching for static assets

## 🔍 Monitoring

After deployment, monitor:

- **Performance**: Use Vercel Analytics or Google PageSpeed Insights
- **Errors**: Check Vercel function logs
- **Uptime**: Vercel provides 99.9% uptime SLA

## 🚨 Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally

### Domain Issues

1. Verify DNS records are correct
2. Check domain propagation (can take up to 48 hours)
3. Ensure SSL certificate is provisioned

### Performance Issues

1. Check bundle size in build logs
2. Optimize images and assets
3. Consider code splitting for large components

## 📞 Support

For deployment issues:

1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Test locally with `npm run build`
4. Contact Vercel support if needed 