#!/usr/bin/env node

/**
 * GitHub Webhook Server for Automated Deployment
 * Listens for GitHub push events and triggers deployment
 */

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3002;
const SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const PROJECT_PATH = process.env.DEPLOY_PATH || '/var/www/pagina-ale-frontend';

app.use(express.json());

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
  if (!SECRET) {
    console.warn('⚠️  GITHUB_WEBHOOK_SECRET not set, skipping signature verification');
    return true;
  }
  
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(payload, 'utf8').digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Deploy function
function deploy() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting deployment...');
    
    const deployScript = path.join(PROJECT_PATH, 'scripts', 'deploy.sh');
    
    exec(`chmod +x ${deployScript} && ${deployScript}`, { 
      cwd: PROJECT_PATH,
      env: { ...process.env, NODE_ENV: 'production' }
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Deployment failed:', error);
        reject(error);
        return;
      }
      
      console.log('✅ Deployment completed successfully');
      console.log('📤 Output:', stdout);
      if (stderr) console.log('📤 Stderr:', stderr);
      resolve({ stdout, stderr });
    });
  });
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature
  if (!verifySignature(payload, signature)) {
    console.log('❌ Invalid signature');
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.headers['x-github-event'];
  
  // Only handle push events to main branch
  if (event === 'push' && req.body.ref === 'refs/heads/main') {
    console.log('📥 Received push to main branch');
    console.log('👤 Pushed by:', req.body.pusher?.name);
    console.log('📝 Commits:', req.body.commits?.length || 0);
    
    try {
      await deploy();
      res.status(200).send('Deployment started successfully');
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      res.status(500).send('Deployment failed');
    }
  } else {
    console.log(`ℹ️  Ignoring ${event} event or non-main branch push`);
    res.status(200).send('Event ignored');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    project: 'pagina-ale-frontend-webhook'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎣 Webhook server listening on port ${PORT}`);
  console.log(`🔗 Endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Project path: ${PROJECT_PATH}`);
  console.log(`🔐 Secret configured: ${SECRET ? 'Yes' : 'No'}`);
});