const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'North Shore Voice API is running!'
  });
});

app.get('/api/telephony/providers', (req, res) => {
  const twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
  res.json({
    providers: twilioConfigured ? ['twilio'] : [],
    twilio: twilioConfigured ? {
      accountSid: process.env.TWILIO_ACCOUNT_SID?.substring(0, 8) + '...',
      status: 'active'
    } : null,
    configured: twilioConfigured,
    message: twilioConfigured 
      ? 'Twilio is configured and ready' 
      : 'Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('===========================================');
  console.log('  North Shore Voice API - RUNNING');
  console.log('===========================================');
  console.log('');
  console.log('  Server: http://localhost:' + PORT);
  console.log('  Status: http://localhost:' + PORT + '/api/status');
  console.log('');
  console.log('===========================================');
});

