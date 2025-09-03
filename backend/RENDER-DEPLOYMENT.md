# Email Analysis Backend - Render Deployment

This backend is configured for deployment on Render with full support for IMAP polling and background processes.

## 🚀 Deployment Steps

### Method 1: Using render.yaml (Recommended)

1. **Connect your GitHub repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

2. **Set Environment Variables**
   In your Render service settings, add these environment variables:

   | Variable | Value | Example |
   |----------|-------|---------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
   | `IMAP_USER` | Your Gmail address | `your-email@gmail.com` |
   | `IMAP_PASSWORD` | Gmail app password (16 chars) | `abcd efgh ijkl mnop` |
   | `FRONTEND_URL` | Your frontend Render URL | `https://your-frontend.onrender.com` |

### Method 2: Manual Setup

1. **Create a new Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:

     | Setting | Value |
     |---------|-------|
     | **Name** | email-analysis-backend |
     | **Runtime** | Node |
     | **Build Command** | `npm run build` |
     | **Start Command** | `npm run start:prod` |
     | **Instance Type** | Starter (Free) or higher |

2. **Set Environment Variables** (same as above)

## 📋 API Endpoints

Once deployed, your API will be available at:
```
https://your-backend-project.onrender.com/api/
```

Available endpoints:
- `GET /api/email/all` - Get all processed emails
- `POST /api/email/process` - Process a new email manually
- `GET /api/email/summary` - Get email processing summary
- `GET /api/email/generate` - Generate test email credentials

## 🔧 Configuration Files

- `render.yaml` - Render deployment configuration
- `package.json` - Build and start scripts
- `.env.example` - Environment variables template

## ⚠️ Important Notes

1. **IMAP Functionality**: Render supports long-running processes, so IMAP polling will work perfectly!

2. **Database Connection**: Ensure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` or add Render's IP ranges.

3. **Free Tier Limitations**:
   - Services sleep after 15 minutes of inactivity
   - Maximum 750 hours/month
   - Consider upgrading for production use

4. **Environment Variables**: Never commit sensitive data to version control.

## 🔄 Alternative Deployment Options

- **Railway**: Similar to Render, great for full-stack apps
- **Heroku**: More expensive but very reliable
- **Vercel**: Good for frontend, but limited for backend with IMAP

## 📞 Support

For deployment issues, check:
- Render deployment logs
- MongoDB Atlas network access
- Gmail IMAP settings and app passwords
- Environment variable configuration

## 🚀 Quick Deploy

1. Push this code to GitHub
2. Go to Render Dashboard
3. Create new Blueprint from your repo
4. Render auto-detects `render.yaml`
5. Set environment variables
6. Deploy! 🎉
