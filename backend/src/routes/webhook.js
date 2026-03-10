const router = require('express').Router();
const { execSync } = require('child_process');
const crypto = require('crypto');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'change-webhook-secret';
const APP_DIR = process.env.APP_DIR || '/root/apps/dental-crm';

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(JSON.stringify(req.body));
  const digest = 'sha256=' + hmac.digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}

// POST /api/webhook/deploy
router.post('/deploy', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = req.headers['x-github-event'];
  const branch = req.body?.ref;

  // Only deploy on push to master
  if (event !== 'push' || branch !== 'refs/heads/master') {
    return res.json({ message: 'Ignored: not a push to master' });
  }

  console.log('🚀 Deploy webhook triggered — pulling and restarting...');

  // Respond immediately so GitHub doesn't time out
  res.json({ message: 'Deploy started' });

  // Run deploy asynchronously
  setImmediate(() => {
    try {
      execSync(`cd ${APP_DIR} && git pull origin master && docker compose build --no-cache && docker compose up -d`, {
        stdio: 'inherit',
        timeout: 300000 // 5 min max
      });
      console.log('✅ Deploy completed successfully');
    } catch (err) {
      console.error('❌ Deploy failed:', err.message);
    }
  });
});

module.exports = router;
