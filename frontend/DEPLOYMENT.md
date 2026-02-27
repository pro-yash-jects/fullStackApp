# Vercel Deployment Guide

This guide will help you deploy the TradeGate frontend to Vercel.

## Prerequisites

- A GitHub account with your project repo
- A Vercel account (sign up at https://vercel.com)
- Your backend API URL (e.g., from Heroku, Railway, or another hosting service)

## Step 1: Prepare Your Backend

Make sure your backend API is deployed and accessible online. You'll need the full URL (e.g., `https://your-backend.herokuapp.com/api`).

Your backend should have these endpoints:
- `POST /auth/login`
- `POST /auth/signup`
- `GET /stocks/search/:symbol`
- `GET /stocks/history/:symbol`
- `GET /watchlist`
- `POST/DELETE /watchlist`
- `GET /transactions`
- `POST /transactions/buy`
- `POST /transactions/sell`

## Step 2: Deploy to Vercel via GitHub

1. Push your code to GitHub if you haven't already:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Go to https://vercel.com and sign in with GitHub

3. Click "Add New..." → "Project"

4. Select your TradeGate repository

5. Under "Framework Preset", select "Vite"

6. Click "Deploy"

Vercel will automatically build and deploy your frontend!

## Step 3: Configure Environment Variables

After deployment, you need to set the API URL:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.herokuapp.com/api` (replace with your actual backend URL)
   - Select "Production" environment

4. Go back to "Deployments" and redeploy by clicking the three dots on the latest deployment → "Redeploy"

## Step 4: Test Your Deployment

Once redeployed, visit your Vercel URL and test:
- Sign up / Login
- Search for stocks
- Add to watchlist
- Place trades (if backend supports it)

## Common Issues

### **404 errors on page refresh**
This should be automatically fixed by `vercel.json`. If not, ensure it's in the frontend root directory.

### **API requests failing in production**
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify your backend API is responding to requests
- Check browser console for CORS errors

### **Images not loading**
Ensure your image assets are in the `public/` folder and referenced correctly.

### **Build fails**
- Check that all dependencies are in `package.json`
- Verify there are no TypeScript errors (we use JavaScript, so no TS issues)
- Check build logs in Vercel dashboard

## Rebuilding After Changes

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

3. Vercel will automatically redeploy! No manual action needed.

## Enabling Production Logs

To debug issues in production:
1. Go to your Vercel project
2. Click "Deployments" → Select your deployment
3. Click "Logs" to see real-time logs

## Next Steps

- Set up a custom domain in Vercel Settings → Domains
- Enable automatic deployments for pull requests
- Consider adding analytics or monitoring

Good luck! 🚀
