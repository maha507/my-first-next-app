#!/bin/bash

# Deployment script for Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo ""

# Build the project
echo "Step 1: Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build complete!"
echo ""

# Create clean deployment directory
echo "Step 2: Creating deployment directory..."
rm -rf .next-deploy
mkdir -p .next-deploy
cp -r .next/* .next-deploy/
rm -rf .next-deploy/cache

echo "✅ Deployment directory ready!"
echo ""

# Deploy to Cloudflare Pages
echo "Step 3: Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next-deploy --project-name=my-first-next-app --branch=main --commit-dirty=true

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🌐 Your app is live at: https://my-first-next-app.pages.dev"
echo ""
echo "📝 View deployment logs:"
echo "   npx wrangler pages deployment tail --project-name=my-first-next-app"
