#!/bin/bash

echo "🚀 Deploying Email Analysis Backend to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Login to Vercel if not already logged in
echo "🔐 Checking Vercel authentication..."
vercel login

# Deploy to production
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Set the following environment variables:"
echo "   - MONGODB_URI"
echo "   - IMAP_USER"
echo "   - IMAP_PASSWORD"
echo "   - FRONTEND_URL"
echo "3. Update your frontend to use the new backend URL"
echo ""
echo "📖 For detailed instructions, see VERCEL-DEPLOYMENT.md"
