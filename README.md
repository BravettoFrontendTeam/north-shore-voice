# 🎤 North Shore Voice

> AI-Powered Phone System Platform with AbëVoice Integration

North Shore Voice is a modern, professional AI phone system platform that integrates with the AbëVoice API infrastructure. It provides voice-first AI capabilities with 24/7 availability and instant scaling.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20%2B-green.svg)
![React](https://img.shields.io/badge/react-18%2B-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5%2B-blue.svg)

## ✨ Features

- **🎙️ Custom Voice AI** - Clone your voice or create unique AI voices for your brand
- **⏰ 24/7 Availability** - Never miss a call with always-on AI assistance
- **📈 Instant Scaling** - Handle unlimited concurrent calls without additional staff
- **📊 Real-time Analytics** - Track call performance, sentiment, and key metrics
- **📝 Full Transcriptions** - Every conversation transcribed and searchable
- **🔒 Enterprise Security** - SOC 2 compliant with end-to-end encryption
- **⚡ Lightning Fast** - Sub-second response times for natural conversations
- **🔌 Easy Integration** - Connect with your CRM, calendar, and existing systems

## 🏗️ Tech Stack

### Frontend
- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js/Express with TypeScript
- PostgreSQL with Prisma ORM
- JWT-based authentication
- WebSocket for real-time updates
- AbëVoice API integration

### Infrastructure
- Docker & Docker Compose
- Nginx for frontend serving
- Redis for caching (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker & Docker Compose (for production)
- PostgreSQL (or use Docker)
- AbëVoice API server running

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/northshore-voice.git
   cd northshore-voice
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/northshore_voice"
   JWT_SECRET=your-secret-key-change-in-production
   ABEVOICE_API_URL=http://localhost:8000
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
northshore-voice/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/     # Landing page components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── shared/      # Shared components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   │   └── abevoice-api.ts
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── abevoice-integration.ts
│   │   │   ├── call-handler.ts
│   │   │   └── websocket.ts
│   │   ├── middleware/      # Express middleware
│   │   └── index.ts
│   ├── prisma/              # Database schema
│   └── package.json
│
├── docker-compose.yml        # Docker configuration
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Voice Generation
- `GET /api/voice/status` - Check AbëVoice API status
- `GET /api/voice/voices` - List available voices
- `POST /api/voice/generate` - Generate speech from text
- `GET /api/voice/usage` - Get usage statistics

### Call Management
- `POST /api/calls/initialize` - Start new call session
- `POST /api/calls/:id/speech` - Process caller speech
- `POST /api/calls/:id/end` - End call session
- `GET /api/calls/:id/transcript` - Get call transcript
- `GET /api/calls` - List call sessions

### Voice Training
- `POST /api/training/upload` - Upload training sample
- `POST /api/training/start` - Start model training
- `GET /api/training/:id/status` - Get training status
- `GET /api/training/models` - List voice models

### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/calls` - Call analytics
- `GET /api/analytics/sentiment` - Sentiment analysis
- `GET /api/analytics/report` - Generate report

## 🎨 Customization

### Brand Colors

Update `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#2563eb',  // Main brand color
    700: '#1e40af',  // Darker shade
  },
  // ...
}
```

### Voice Configuration

Configure default voice settings in the AbëVoice integration:
```typescript
const defaultConfig = {
  stability: 0.5,
  similarity: 0.75,
  style: 0.0,
};
```

## 📊 Dashboard Features

- **Overview** - Real-time call statistics and metrics
- **Analytics** - Detailed call performance analysis
- **Voice Training** - Train and customize AI voice models
- **Call Logs** - View and search call history
- **Settings** - Configure business context and preferences

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation with Zod

## 📈 Performance

- Redis caching for frequent queries
- CDN-ready static assets
- Optimized database queries
- WebSocket for real-time updates
- Lazy loading for dashboard components

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AbëVoice](https://github.com/your-org/abevoice) for the voice synthesis API
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org) for data visualization

---

Built with ❤️ by North Shore Voice Team

