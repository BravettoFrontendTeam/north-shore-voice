# Security Configuration Guide

## Required Environment Variables

Create a `.env` file in the `backend` directory with these settings:

### JWT Configuration (REQUIRED)

```bash
# Use a strong random string, at least 32 characters
JWT_SECRET=your-very-long-and-secure-random-secret-key-here
JWT_EXPIRES_IN=7d
```

Generate a secure secret:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

### Twilio Configuration

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
```

Get these from: https://console.twilio.com

### Other Providers (Optional)

```bash
# Plivo
PLIVO_AUTH_ID=your-auth-id
PLIVO_AUTH_TOKEN=your-auth-token

# SignalWire
SIGNALWIRE_PROJECT_ID=your-project-id
SIGNALWIRE_AUTH_TOKEN=your-auth-token
SIGNALWIRE_SPACE_URL=your-space.signalwire.com

# Telnyx
TELNYX_API_KEY=your-api-key
```

## Security Features Implemented

### 1. Input Validation
- Phone numbers validated using E.164 format
- Email validation with format checking
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- String sanitization to prevent injection attacks

### 2. Rate Limiting
- Registration: 5 attempts per IP per hour
- Login: 10 attempts per IP per 15 minutes
- API endpoints: 100 requests per IP per 15 minutes

### 3. Webhook Security
- Twilio webhook signature validation
- Request origin verification
- Timing-safe comparison for signatures

### 4. Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt (12 rounds)
- Token refresh mechanism

### 5. API Security
- CORS configured for specific origins
- Helmet.js for HTTP security headers
- No sensitive data in error responses

## Production Checklist

- [ ] Set strong JWT_SECRET (64+ characters)
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS_ORIGIN
- [ ] Use HTTPS for all endpoints
- [ ] Set up proper database (PostgreSQL)
- [ ] Configure webhook URLs with HTTPS
- [ ] Enable request logging
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Webhook URL Configuration

For production, use your public HTTPS URL:
```bash
WEBHOOK_BASE_URL=https://yourdomain.com/api/telephony/webhooks
```

For local development, use ngrok:
```bash
ngrok http 5000
# Then set WEBHOOK_BASE_URL to the ngrok URL
```

