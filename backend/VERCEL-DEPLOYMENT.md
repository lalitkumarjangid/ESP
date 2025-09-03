# Email Analysis Backend - Vercel Deployment

This backend is configured for deployment on Vercel as a serverless function.

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard

Go to your Vercel project dashboard and set the following environment variables:

#### Required Environment Variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `IMAP_USER` - Your Gmail address
- `IMAP_PASSWORD` - Your Gmail app password (16 characters)
- `IMAP_HOST` - imap.gmail.com
- `IMAP_PORT` - 993
- `FRONTEND_URL` - Your frontend Vercel URL (e.g., https://your-frontend.vercel.app)
- `NODE_ENV` - production

#### Optional Environment Variables:
- `PORT` - 3001 (default)
- `API_BASE_URL` - Your backend Vercel URL

## 📋 API Endpoints

Once deployed, your API will be available at:
```
https://your-backend-project.vercel.app/api/
```

Available endpoints:
- `GET /api/email/all` - Get all processed emails
- `POST /api/email/process` - Process a new email manually
- `GET /api/email/summary` - Get email processing summary
- `GET /api/email/generate` - Generate test email credentials

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `api/index.js` - Serverless function entry point
- `.vercelignore` - Files to exclude from deployment

## ⚠️ Important Notes

1. **IMAP Limitations**: Vercel's serverless functions have execution time limits. The IMAP polling feature may not work reliably in serverless environments.

2. **Database Connection**: Ensure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` or Vercel's IP ranges.

3. **Environment Variables**: Never commit sensitive data to version control. Always use Vercel's environment variable system.

4. **Cold Starts**: Serverless functions may have cold start delays (typically 1-3 seconds).

## 🔄 Alternative Deployment Options

If IMAP polling doesn't work well with Vercel, consider:
- **Railway**: Better for long-running processes
- **Render**: Good for web services
- **Heroku**: Traditional hosting with better background process support

## 📞 Support

For deployment issues, check:
- Vercel deployment logs
- MongoDB Atlas network access
- Gmail IMAP settings and app passwords
