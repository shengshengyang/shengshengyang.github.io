// 把 ig/<題目>/slides.html 逐張截成 1080x1350 PNG，輸出到 ig/<題目>/out/
// 用法：node ig/render.js leetcode-3694
// 需要本機安裝 Chrome 或 Edge（不需要額外套件）
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const name = process.argv[2];
if (!name) {
  console.error('用法：node ig/render.js <資料夾名稱>');
  process.exit(1);
}

const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const chrome = browsers.find(p => fs.existsSync(p));
if (!chrome) {
  console.error('找不到 Chrome 或 Edge');
  process.exit(1);
}

const dir = path.resolve(__dirname, name);
const html = fs.readFileSync(path.join(dir, 'slides.html'), 'utf8');
const total = (html.match(/<section class="slide/g) || []).length;
const outDir = path.join(dir, 'out');
fs.mkdirSync(outDir, { recursive: true });
const base = pathToFileURL(path.join(dir, 'slides.html')).href;

for (let i = 1; i <= total; i++) {
  const file = path.join(outDir, String(i).padStart(2, '0') + '.png');
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1080,1350',
    '--virtual-time-budget=2000',
    `--screenshot=${file}`,
    `${base}?s=${i}`,
  ], { stdio: 'ignore' });
  console.log('✔', file);
}
