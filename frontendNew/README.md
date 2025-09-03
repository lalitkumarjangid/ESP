# Email Analysis System - Frontend

A modern Next.js frontend application for the Email Analysis System that provides a professional trading-app inspired interface for analyzing email receiving chains and ESP detection.

## 🚀 Features

- **Modern Trading-App UI**: Clean, professional interface inspired by trading applications
- **Real-time Analytics Dashboard**: Visual charts and metrics for email processing
- **Email Results Management**: Search, filter, and paginate through processed emails
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **ESP Visualization**: Clear badges and indicators for different Email Service Providers
- **Receiving Chain Display**: Visual representation of email routing paths
- **Search & Filter**: Advanced filtering by ESP type and text search
- **Pagination**: Efficient browsing through large datasets

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lalitkumarjangid/ESP.git
   cd ESP/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Environment Setup

Create a `.env.local` file in the frontend root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application Configuration
NEXT_PUBLIC_APP_NAME=Email Analysis System
NEXT_PUBLIC_APP_VERSION=1.0.0

# Development Configuration
NODE_ENV=development
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install dependencies
```

## 🔌 API Integration

The frontend communicates with the backend through RESTful APIs:

```typescript
// Get all processed emails
const emails = await fetch('/api/email/all')

// Generate test email
const testEmail = await fetch('/api/email/generate')

// Process manual email
const result = await fetch('/api/email/process', {
  method: 'POST',
  body: JSON.stringify({ rawEmail, subject })
})
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔧 Troubleshooting

### Common Issues

**API Connection Errors:**
- Verify backend is running on correct port
- Check environment variables
- Verify CORS configuration

**Build Errors:**
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules && npm install`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License.
