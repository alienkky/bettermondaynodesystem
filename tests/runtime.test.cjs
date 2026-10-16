'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const storageSource = fs.readFileSync(path.join(root, 'aliennode-storage.js'), 'utf8');

function storage(search, data) {
  const window = {
    location: { search },
    document: { addEventListener() {} },
    localStorage: {
      getItem: name => data.get(name) ?? null,
      setItem: (name, value) => data.set(name, String(value)),
      removeItem: name => data.delete(name),
    },
  };
  vm.runInNewContext(storageSource, { window, URLSearchParams });
  return window.AlienNodeStorage;
}

test('default project retains legacy keys and existing browser data', () => {
  const data = new Map([['bm-editor-canvas', 'old graph']]);
  const current = storage('', data);
  assert.equal(current.getItem('bm-editor-canvas'), 'old graph');
  assert.equal(current.key('bm-ref-canvas-db'), 'bm-ref-canvas-db');
  current.setItem('bm-ref-nextid', 123);
  assert.equal(data.get('bm-ref-nextid'), '123');
});

test('projects isolate canvas, id counter, settings and database names', () => {
  const data = new Map([['bm-editor-canvas', 'legacy']]);
  const a = storage('?project=alpha', data);
  const b = storage('?project=beta', data);
  for (const key of ['bm-editor-canvas', 'bm-ref-nextid', 'bm-ui-prefs']) {
    a.setItem(key, 'A');
    b.setItem(key, 'B');
    assert.equal(a.getItem(key), 'A');
    assert.equal(b.getItem(key), 'B');
  }
  a.removeItem('bm-editor-canvas');
  assert.equal(a.getItem('bm-editor-canvas'), null);
  assert.equal(b.getItem('bm-editor-canvas'), 'B');
  assert.equal(data.get('bm-editor-canvas'), 'legacy');
  assert.notEqual(a.key('bm-ref-canvas-db'), b.key('bm-ref-canvas-db'));
  const unicode = storage('?project=' + encodeURIComponent('고객 / A:B'), data);
  assert.equal(unicode.project, '고객 / A:B');
  assert.notEqual(unicode.key('bm-ref-canvas-db'), a.key('bm-ref-canvas-db'));
});

test('source canvases parse and load the storage boundary before canvas code', () => {
  for (const name of ['Reference Canvas.html', 'Flow Editor.html', 'Flow Diagrams.html', 'Structure + Flow Dashboard.html']) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert.ok(html.indexOf('src="aliennode-storage.js"') < html.indexOf('<script>'));
    assert.ok(!html.includes('localStorage.'));
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!match[1].includes('src=') && !match[1].includes('type=')) new vm.Script(match[2], { filename: name });
    }
    for (const match of html.matchAll(/(?:src|href)="([^"#?]+\.(?:js|css))"/g)) {
      assert.ok(fs.existsSync(path.join(root, match[1])), `${name}: ${match[1]}`);
    }
  }
});

test('starter graph is renderable, has unique IDs and valid edge endpoints', () => {
  const graph = JSON.parse(fs.readFileSync(path.join(root, 'templates/project-starter.json'), 'utf8'));
  const ids = new Set();
  const html = fs.readFileSync(path.join(root, 'Reference Canvas.html'), 'utf8');
  for (const node of graph.nodes) {
    assert.ok(!ids.has(node.id));
    ids.add(node.id);
    assert.match(html, new RegExp('\\b' + node.kind + ':'));
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y));
  }
  for (const edge of graph.edges) {
    assert.ok(!ids.has(edge.id));
    ids.add(edge.id);
    assert.ok(graph.nodes.some(n => n.id === edge.from));
    assert.ok(graph.nodes.some(n => n.id === edge.to));
  }
});

test('server serves AlienNode launcher, version and project canvases', async t => {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(() => child.kill());
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('server startup timeout')), 10000);
    child.once('error', reject);
    child.stdout.on('data', chunk => {
      const match = String(chunk).match(/port (\d+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`server exited ${code}`)); });
  });
  const base = `http://127.0.0.1:${port}`;
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /プロジェクト|프로젝트 ID/);
  assert.ok(response.headers.has('x-aliennode-version'));
  assert.deepEqual((await (await fetch(base + '/__version')).json()).servedRoot, 'AlienNode.html');
  const canvas = await fetch(base + '/Reference%20Canvas.html?project=sample');
  assert.equal(canvas.status, 200);
  assert.match(await canvas.text(), /AlienNodeStorage/);
});
