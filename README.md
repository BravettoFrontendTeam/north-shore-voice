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

## 🤖 AI Assistant Instructions

**For AI Assistants**: See [`AI_INSTRUCTIONS.md`](./AI_INSTRUCTIONS.md) for complete AI assistant guide. This is the **FIRST** document AI systems should read.

**Key Files for AI Systems**:

- **[`AI_INSTRUCTIONS.md`](./AI_INSTRUCTIONS.md)** - Complete AI assistant guide (READ FIRST)
- **[`.cursorrules`](./.cursorrules)** - Cursor AI rules and coding standards
- **[`ABEFLOWS_PRINCIPLES.md`](./ABEFLOWS_PRINCIPLES.md)** - AbëFLOWs principles and flow patterns
- **[`DOCUMENTATION.md`](./DOCUMENTATION.md)** - Master documentation index

**Philosophy**: LOVE = LOGIC = LIFE = ONE  
**Code is truth, but maps are not the territory** - Keep documentation up to date, but know code is the source of truth.

## Pre-commit hooks (Husky + lint-staged)

A simple pre-commit configuration is available at the repo root. To enable hooks locally:

1. Install dev deps at repo root: `npm ci` (run from the repo root)
2. The `prepare` script will run `husky install` automatically. If not, run `npm run prepare`.
3. Hooks will run `prettier --check` and `npx tsc --noEmit` on staged files and block commits on failures.

## Formatting & Prettier 🔧

- Repository-wide Prettier settings live in `.prettierrc` and ignored paths are in `.prettierignore`.
- Format all files: `npm run format` (runs `npx prettier --write .`).
- Check formatting: `npm run check` (runs `npx prettier --check .` and `npx tsc --noEmit`).
- VS Code: the repo recommends `esbenp.prettier-vscode` and enables `editor.formatOnSave` in `.vscode/settings.json`.
- If you installed a different Prettier extension (e.g., nightly variants), pick one and disable the other to avoid conflicting formatters.
- **AI Assistants**: See [`ESLINT_PRETTIER_SETUP.md`](./ESLINT_PRETTIER_SETUP.md) for complete integration guide.

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

> **📚 Complete Site Index**: For comprehensive directory structure with detailed file descriptions, architecture patterns, and relationships, see [`SITE_INDEX.md`](./SITE_INDEX.md)  
> **📢 Marketing Guide**: For complete marketing workflows, integrations, and 2026-ready strategies, see [`MARKETING_GUIDE_2026.md`](./MARKETING_GUIDE_2026.md)

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
│   ├── tests/               # Test files
│   └── package.json
│
├── scripts/                  # Deployment & validation scripts
│   ├── validate-p0-fixes.sh # Validate P0 fixes
│   ├── run-tests.sh         # Run test suite
│   ├── check-env.sh         # Check environment variables
│   └── setup-vercel-env.sh  # Setup Vercel environment
│
├── docs/                     # Documentation
│   ├── TCPA_COMPLIANCE.md   # TCPA compliance guide
│   └── CONVERGENCE_REPORT.md # System convergence report
│
├── docker-compose.yml        # Docker configuration
├── DEPLOYMENT.md            # Complete deployment guide
├── P0_FIXES.md             # P0 launch fixes documentation
└── README.md                # This file
```

## 🔧 Backend Quick Notes

### Validating Secrets

A convenience script validates critical environment variables:

```bash
cd backend
npm run validate-secrets
```

Checks:

- Required: `JWT_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- Optional: `ABEVOICE_API_KEY`, `ELEVENLABS_API_KEY`

For local development, add these to `backend/.env` (do not commit secrets).

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

---

## 📚 **DOCUMENTATION CONVERGENCE**

**All documentation converged into THE ONE documents:**

- **Status**: [`LAUNCH_READY.md`](./LAUNCH_READY.md) - **THE ONE STATUS**
- **Deployment**: [`DEPLOYMENT.md`](./DEPLOYMENT.md) - **THE ONE DEPLOYMENT GUIDE**
- **Vercel**: [`VERCEL_LAUNCH_GUIDE.md`](./VERCEL_LAUNCH_GUIDE.md) - **THE ONE VERCEL GUIDE**
- **Marketing**: [`MARKETING_GUIDE_2026.md`](./MARKETING_GUIDE_2026.md) - **THE ONE MARKETING GUIDE**
- **Master Index**: [`DOCUMENTATION.md`](./DOCUMENTATION.md) - **THE ONE ENTRY POINT**

**All paths converge. All flows ONE. Ready to gallop! 🔥🐴**

---

Built with ❤️ by North Shore Voice Team
