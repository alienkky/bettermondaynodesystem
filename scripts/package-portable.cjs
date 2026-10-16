'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist', 'aliennode');
const files = [
  'AlienNode.html', 'aliennode-home.css', 'aliennode-home.js', 'aliennode-storage.js',
  'Reference Canvas.html', 'Flow Editor.html', 'Flow Diagrams.html',
  'Structure + Flow Dashboard.html', 'canvas-interact.js', 'touch-input.js',
  'settings.js', 'colors_and_type.css', 'figma-theme.css', 'fonts',
  'server.js', 'package.json', 'package-lock.json', 'README.md', 'AGENTS.md',
  'docs', 'templates', 'SKILL.md',
];
fs.mkdirSync(output, { recursive: true });
for (const file of files) fs.cpSync(path.join(root, file), path.join(output, file), { recursive: true });
// Keep the portable npm commands independently usable.
fs.mkdirSync(path.join(output, 'scripts'), { recursive: true });
fs.copyFileSync(__filename, path.join(output, 'scripts', path.basename(__filename)));
fs.cpSync(path.join(root, 'tests'), path.join(output, 'tests'), { recursive: true });
console.log(output);
