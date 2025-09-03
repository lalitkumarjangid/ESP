# 📧 Email Analysis System

A full-stack application that automatically identifies the receiving chain and ESP type of emails using IMAP monitoring. Built with modern technologies and a professional trading-app inspired interface.

## 🌟 Project Overview

This system automatically processes incoming emails to extract two key pieces of information:
1. **Receiving Chain**: The sequence of servers the email passed through before reaching the inbox
2. **ESP Type**: The Email Service Provider used to send the email (Gmail, Outlook, Amazon SES, etc.)

## 🚀 Live Demo

- **GitHub Repository**: [https://github.com/lalitkumarjangid/ESP.git](https://github.com/lalitkumarjangid/ESP.git)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Styling**: Tailwind CSS
- **UI**: Modern trading-app inspired design
- **Features**: Real-time analytics, search, pagination

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB Atlas
- **Email Processing**: IMAP with Gmail integration
- **Architecture**: RESTful API with service-based structure

## 📋 Features

### ✅ Automatic Email Processing
- IMAP monitoring for incoming emails
- Real-time processing and storage
- Batch processing with safety limits
- Error handling and recovery

### ✅ Advanced Analytics
- ESP distribution charts
- Processing performance metrics
- Server analysis and statistics
- Real-time dashboard updates

### ✅ Professional UI/UX
- Trading-app inspired design
- Responsive mobile-first approach
- Search and filter capabilities
- Pagination for large datasets

### ✅ Robust Backend
- Modular NestJS architecture
- MongoDB integration
- Comprehensive email header parsing
- RESTful API design

## 🏗️ Project Structure

```
ESP/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── services/       # Business logic
│   │   └── views/          # DTOs and interfaces
│   ├── .env.example        # Environment template
│   └── README.md           # Backend documentation
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and API
│   ├── .env.example       # Environment template
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password

### 1. Clone Repository
```bash
git clone https://github.com/lalitkumarjangid/ESP.git
cd ESP
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB and Gmail credentials
npm run start:dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔐 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-analysis
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📖 Detailed Setup Guides

- **Backend Setup**: [backend/README.md](./backend/README.md)
- **Frontend Setup**: [frontend/README.md](./frontend/README.md)

## 🔍 How It Works

### 1. Email Generation
- System generates unique test email address
- Creates identifiable subject line for filtering
- Displays information to user for testing

### 2. IMAP Monitoring
- Connects to Gmail IMAP server
- Polls for new emails every 60 seconds
- Processes emails in batches (safety limit: 5 emails)
- Filters emails from last 24 hours

### 3. Header Analysis
- Extracts `Received` headers from email
- Parses server information and IP addresses
- Builds receiving chain timeline
- Identifies Email Service Provider

### 4. Data Storage
- Saves processed data to MongoDB
- Stores metadata and processing times
- Maintains processing history
- Provides RESTful API access

### 5. Frontend Display
- Real-time dashboard updates
- Visual ESP distribution charts
- Searchable and filterable results
- Responsive design for all devices

## 🧪 Testing the System

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to http://localhost:3000
3. Click "Generate Test Email" to get email details
4. Send an email to the generated address with the specified subject
5. Watch the system automatically process and display results

### API Testing
```bash
# Generate test email
curl http://localhost:3001/api/email/generate

# Get all processed emails
curl http://localhost:3001/api/email/all

# Get processing summary
curl http://localhost:3001/api/email/summary
```

## 📊 Performance & Monitoring

### Backend Logging
- IMAP connection status
- Email processing progress
- ESP detection results
- Error handling and recovery

### Frontend Analytics
- Real-time processing statistics
- ESP distribution visualization
- Performance metrics dashboard
- Processing time analysis

## 🚀 Deployment

### Production Deployment Options

**Frontend (Vercel)**
```bash
cd frontend
vercel --prod
```

**Backend (Railway/Render)**
```bash
cd backend
npm run build
npm run start:prod
```

**Docker Deployment**
```bash
# Backend
docker build -t esp-backend ./backend
docker run -p 3001:3001 --env-file ./backend/.env esp-backend

# Frontend
docker build -t esp-frontend ./frontend
docker run -p 3000:3000 esp-frontend
```

## 🔧 Configuration & Customization

### Email Processing Settings
- **Polling Interval**: 60 seconds (configurable)
- **Batch Size**: 5 emails per batch (safety limit)
- **Time Filter**: 24 hours (recent emails only)
- **Connection Timeout**: 15 seconds

### UI Customization
- **Theme**: Trading-app inspired (white/black)
- **Pagination**: 20 items per page
- **Search**: Real-time filtering
- **Responsive**: Mobile-first design

## 🔍 Troubleshooting

### Common Issues

**IMAP Connection Problems**
- Verify Gmail App Password is 16 characters
- Ensure 2FA is enabled on Gmail account
- Check IMAP is enabled in Gmail settings

**MongoDB Connection Issues**
- Verify connection string format
- Check network/firewall settings
- Ensure IP whitelist includes your address

**Frontend API Errors**
- Confirm backend is running on correct port
- Check CORS configuration
- Verify environment variables

### Debug Steps
1. Check console logs in both frontend and backend
2. Verify environment variables are set correctly
3. Test API endpoints manually with curl
4. Check database connectivity

## 📈 Performance Metrics

### Current System Stats
- **Processing Speed**: ~200ms per email
- **Batch Processing**: 5 emails per 60 seconds
- **Success Rate**: 95%+ ESP detection accuracy
- **Database**: 400+ emails processed in testing

### Optimization Features
- Efficient MongoDB queries with limits
- Pagination for large datasets
- Optimized React re-rendering
- Connection pooling and timeouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write descriptive commit messages
- Include tests for new functionality

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/lalitkumarjangid/ESP/issues)
- **Documentation**: Check individual README files in backend and frontend directories

## 🙏 Acknowledgments

- **NestJS**: For the robust backend framework
- **Next.js**: For the modern frontend framework
- **MongoDB**: For reliable data storage
- **Tailwind CSS**: For rapid UI development
- **Google Mail**: For IMAP access and testing

---

**Built with ❤️ by [Lalit Kumar Jangid](https://github.com/lalitkumarjangid)**
# bb
