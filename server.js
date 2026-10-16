const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION =
  process.env.RAILWAY_GIT_COMMIT_SHA ||
  process.env.RAILWAY_DEPLOYMENT_ID ||
  process.env.GIT_COMMIT_SHA ||
  'local';

app.use((req, res, next) => {
  res.setHeader('X-AlienNode-Version', APP_VERSION);
  res.setHeader('X-BMNS-Version', APP_VERSION); // Legacy clients
  next();
});

app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    // Allow SharedArrayBuffer for potential future use
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    // Prevent stale HTML from being cached after deploys.
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Serve the AlienNode project launcher as root.
// (The legacy bundled file can become stale unless regenerated.)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'AlienNode.html'));
});

app.get('/__version', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    ok: true,
    app: 'aliennode',
    version: APP_VERSION,
    servedRoot: 'AlienNode.html',
    railwayEnvironment: process.env.RAILWAY_ENVIRONMENT_NAME || null,
    railwayProject: process.env.RAILWAY_PROJECT_NAME || null,
    railwayService: process.env.RAILWAY_SERVICE_NAME || null,
    time: new Date().toISOString(),
  });
});

const server = app.listen(PORT, () => {
  console.log(`AlienNode running on port ${server.address().port}`);
});
