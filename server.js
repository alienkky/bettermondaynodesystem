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
  res.setHeader('X-BMNS-Version', APP_VERSION);
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

// Serve the actively maintained canvas source as root.
// (The legacy bundled file can become stale unless regenerated.)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'Reference Canvas.html'));
});

app.get('/__version', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    ok: true,
    app: 'bettermondaynodesystem',
    version: APP_VERSION,
    servedRoot: 'Reference Canvas.html',
    railwayEnvironment: process.env.RAILWAY_ENVIRONMENT_NAME || null,
    railwayProject: process.env.RAILWAY_PROJECT_NAME || null,
    railwayService: process.env.RAILWAY_SERVICE_NAME || null,
    time: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`BetterMonday Node System running on port ${PORT}`);
});
