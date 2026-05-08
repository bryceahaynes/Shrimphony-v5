// build.js — wraps the <script> block in eval(atob(...)) so source isn't readable in DevTools
// Usage: node build.js
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract the single <script>...</script> block (no type attr)
const match = src.match(/<script>\r?\n([\s\S]*?)\r?\n<\/script>/);
if (!match) { console.error('Could not find <script> block'); process.exit(1); }

const jsSource = match[1];
const encoded = Buffer.from(jsSource, 'utf8').toString('base64');
const replacement = `<script>eval(atob("${encoded}"))</script>`;

const out = src.replace(/<script>\r?\n[\s\S]*?\r?\n<\/script>/, replacement);

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), out, 'utf8');
console.log('dist/index.html written — script block is base64-encoded.');
