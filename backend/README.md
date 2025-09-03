# Email Analysis System - Backend

A NestJS-based backend service that automatically processes incoming emails via IMAP to extract receiving chain information and identify Email Service Providers (ESP).

## 🚀 Features

- **IMAP Email Monitoring**: Automatically monitors Gmail inbox for incoming test emails
- **Receiving Chain Extraction**: Analyzes email headers to trace the path emails traveled through servers
- **ESP Detection**: Identifies the Email Service Provider used to send emails (Gmail, Outlook, Yahoo, etc.)
- **Real-time Processing**: Processes emails automatically as they arrive
- **MongoDB Storage**: Stores processed email data with metadata
- **RESTful API**: Provides endpoints for frontend integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password enabled
- npm or yarn package manager

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalitkumarjangid/ESP.git
   cd ESP/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration (see Environment Setup section below)

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

## 🔐 Environment Setup

### Gmail IMAP Configuration

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail" app
   - Use this password in your `.env` file

3. **Enable IMAP**:
   - Gmail Settings → Forwarding and POP/IMAP
   - Enable IMAP access

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string from "Connect" → "Connect your application"

**Option 2: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/email-analysis`

## 📄 Environment Variables

Create a `.env` file in the backend root directory:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-analysis

# Gmail IMAP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Render Deployment (Recommended)

This backend is optimized for deployment on Render with full IMAP support.

#### Quick Deploy:
1. Connect your GitHub repo to [Render](https://dashboard.render.com)
2. Create a new Blueprint (auto-detects `render.yaml`)
3. Set environment variables
4. Deploy! 🎉

#### Environment Variables for Render:
```bash
MONGODB_URI=your-mongodb-connection-string
IMAP_USER=your-gmail@gmail.com
IMAP_PASSWORD=your-16-char-app-password
FRONTEND_URL=https://your-frontend.onrender.com
NODE_ENV=production
PORT=10000
```

#### Files for Render:
- `render.yaml` - Blueprint configuration
- `Dockerfile` - Docker deployment option
- `RENDER-DEPLOYMENT.md` - Detailed deployment guide

#### Run Deployment Script:
```bash
./deploy-render.sh
```

### Other Deployment Options:
- Railway, Heroku, DigitalOcean App Platform
- Docker containers
- Traditional VPS hosting

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── imap.config.ts
│   ├── controllers/     # API controllers
│   │   └── email.controller.ts
│   ├── models/          # MongoDB schemas
│   │   └── email.model.ts
│   ├── services/        # Business logic
│   │   ├── email.service.ts
│   │   └── imap.service.ts
│   ├── views/           # DTOs and interfaces
│   │   └── email.view.ts
│   ├── app.module.ts    # Main application module
│   └── main.ts          # Application entry point
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🔌 API Endpoints

### Email Processing
- `POST /api/email/process` - Manually process email headers
- `GET /api/email/generate` - Generate test email address and subject
- `GET /api/email/all` - Get all processed emails
- `GET /api/email/summary` - Get processing summary statistics

### Example API Usage

**Generate Test Email:**
```bash
curl http://localhost:3001/api/email/generate
```

**Get All Processed Emails:**
```bash
curl http://localhost:3001/api/email/all
```

**Process Email Headers:**
```bash
curl -X POST http://localhost:3001/api/email/process \
  -H "Content-Type: application/json" \
  -d '{
    "rawEmail": "Received: from mail.example.com...",
    "subject": "Test Email Subject"
  }'
```

## 🔍 How It Works

1. **IMAP Monitoring**: Service connects to Gmail IMAP and polls for new emails every 60 seconds
2. **Email Detection**: Identifies test emails using generated subject lines
3. **Header Analysis**: Extracts `Received` headers to trace email path
4. **ESP Detection**: Analyzes headers and sender information to identify ESP
5. **Data Storage**: Saves processed results to MongoDB
6. **API Access**: Provides RESTful endpoints for frontend consumption

## 🧪 Testing

**Development Mode:**
```bash
npm run start:dev
```

**Production Build:**
```bash
npm run build
npm run start:prod
```

**Testing Email Processing:**
1. Start the backend server
2. Call `/api/email/generate` to get test email details
3. Send an email to the generated address with the specified subject
4. Check `/api/email/all` to see processed results

## 📊 Monitoring

The application provides detailed console logging:
- IMAP connection status
- Email processing progress
- ESP detection results
- Receiving chain analysis

## 🔧 Troubleshooting

### Common Issues

**IMAP Connection Errors:**
- Verify Gmail App Password is correct
- Ensure IMAP is enabled in Gmail settings
- Check firewall/network connectivity

**MongoDB Connection Issues:**
- Verify MongoDB URI format
- Check network connectivity to MongoDB Atlas
- Ensure IP whitelist includes your address (Atlas)

**No Emails Being Processed:**
- Check IMAP polling logs
- Verify email subject matches generated pattern
- Ensure emails are arriving in INBOX

### Debug Logs

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 🚀 Deployment

### Production Checklist
1. Set secure MongoDB URI
2. Use production Gmail credentials
3. Configure proper CORS settings
4. Set `NODE_ENV=production`
5. Use process manager (PM2)

### Docker Deployment
```bash
# Build Docker image
docker build -t email-backend .

# Run container
docker run -p 3001:3001 --env-file .env email-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review console logs for error details
