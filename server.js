const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    // Allow SharedArrayBuffer for potential future use
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  }
}));

// Serve 노드 디자인 시스템 as root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'BetterMonday 노드 디자인 시스템.html'));
});

app.listen(PORT, () => {
  console.log(`BetterMonday Node System running on port ${PORT}`);
});
