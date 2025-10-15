#!/bin/bash

# Development script to run Next.js app with D1 database support
echo "🚀 Starting Next.js app with D1 database support..."
echo ""
echo "Step 1: Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "Step 2: Starting Wrangler dev server with D1 binding..."
echo "📦 Your app will be available at: http://localhost:8788"
echo ""
echo "🗄️  Using D1 database: students-db"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run wrangler with D1 binding
npx wrangler pages dev .next --compatibility-date=2025-01-01 --d1=DB=students-db
