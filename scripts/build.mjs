import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const metrics = JSON.parse(read('scripts/metrics.json'));

const content = {
  name: 'Thomas Laurent',
  tagline: 'Independent AI developer. Web apps, AI agents and the servers they run on.',
  now: 'Now building Arcane with Chamans',
  place: 'Saint-Raphaël, France',
  links: [
    { id: 'weapzy', label: 'weapzy.com', logo: 'weapzy' },
    { id: 'chamans', label: 'chamans.io', logo: 'logos/chamans.svg' },
    { id: 'shadowcoders', label: 'shadowcoders.io', logo: 'logos/shadow.svg' },
    { id: 'linkedin', label: 'linkedin', icon: 'linkedin' },
    { id: 'mail', label: 'thomas@weapzy.com', icon: 'mail' },
  ],
  work: [
    { name: 'Autonomous AI agents', icon: { image: 'logos/chamans-agent.png' }, text: 'Agents that work on their own, inside real tools, and report back to the team.', examples: ['Support desk', 'Site and server watch', 'Telegram assistant', 'MCP servers', 'Agent skills', 'Scheduled jobs'], stack: ['claude', 'modelcontextprotocol', 'nodedotjs', 'python', 'telegram'] },
    { name: 'FORMAJES', icon: { mono: 'FJ', tile: '#000091' }, text: 'Training platform for the Ministère des Sports, designed and built from scratch, no AI involved.', examples: ['Multi-role access', 'Validation workflow', 'DSFR interface', 'Exports and reports'], stack: ['php', 'laravel'] },
    { name: 'MadBullDog', icon: { logo: { light: 'logos/madbulldog-light.png', dark: 'logos/madbulldog-dark.png' } }, text: 'Video production pipeline and AI content tools we build and run together.', examples: ['Derush board', 'Transcription', 'Scripts', 'AI voice-over', 'Subtitles', 'Promo videos'], stack: ['nextdotjs', 'ffmpeg', 'elevenlabs', 'sqlite'] },
    { name: 'Business apps', icon: { tabler: 'dashboard' }, text: 'Custom tools shaped around how each company actually works.', examples: ['CRMs', 'Quotes and e-signature', 'Billing exports', 'Mail sync', 'Helpdesks', 'Dashboards'], stack: ['laravel', 'php', 'react', 'typescript'] },
    { name: 'Websites and e-commerce', icon: { tabler: 'monitor' }, text: 'Sites and shops built, hosted, secured and watched around the clock.', examples: ['WordPress', 'WooCommerce', 'Shopify', 'Memberships', '100+ sites monitored', 'Security fixes'], stack: ['wordpress', 'shopify', 'stripe', 'cloudflare', 'playwright'] },
    { name: 'Native and mobile apps', icon: { tabler: 'devices' }, text: 'Mac, Windows and mobile apps that feel at home on each platform.', examples: ['P2P file transfer', 'AI assistant app', 'Booking apps', 'Auto-updates'], stack: ['swift', 'apple', 'dotnet', 'expo'] },
  ],
  repos: [
    {
      id: 'humanizer-fr',
      name: 'humanizer-fr',
      lines: ['Rewrites French text that reads as AI-generated,', 'so it sounds like its author again.'],
      language: 'Python',
      color: '#3572A5',
      kind: 'Agent skill',
    },
    {
      id: 'claude-video-maker',
      name: 'claude-video-maker',
      lines: ['Records a polished tutorial video of any web app', 'with /video: voice-over, subtitles, ffmpeg edit.'],
      language: 'JavaScript',
      color: '#f1e05a',
      kind: 'Claude Code plugin',
    },
  ],
  toolbox: [
    { title: 'Build', items: [['laravel', 'Laravel'], ['php', 'PHP 8'], ['wordpress', 'WordPress'], ['nextdotjs', 'Next.js'], ['react', 'React'], ['typescript', 'TypeScript'], ['swift', 'SwiftUI'], ['expo', 'Expo']] },
    { title: 'AI', items: [['claude', 'Claude Code'], ['anthropic', 'Claude API'], ['modelcontextprotocol', 'MCP servers'], ['elevenlabs', 'ElevenLabs'], ['huggingface', 'Hugging Face'], ['n8n', 'n8n'], ['python', 'Python']] },
    { title: 'Run', items: [['proxmox', 'Proxmox VE'], ['docker', 'Docker'], ['nginx', 'Nginx'], ['cloudflare', 'Cloudflare'], ['tailscale', 'Tailscale'], ['postgresql', 'PostgreSQL'], ['mysql', 'MySQL'], ['sqlite', 'SQLite']] },
    { title: 'Ship', items: [['githubactions', 'GitHub Actions'], ['pm2', 'PM2'], ['playwright', 'Playwright'], ['ffmpeg', 'FFmpeg'], ['figma', 'Figma'], ['shopify', 'Shopify'], ['stripe', 'Stripe'], ['nodedotjs', 'Node.js']] },
  ],
};

const themes = {
  light: {
    bg: '#ffffff',
    fg: '#1f2328',
    muted: '#59636e',
    subtle: '#59636e',
    line: '#d1d9e0',
    card: '#f6f8fa',
    heat: ['#eff2f5', '#ffc4da', '#ff86b6', '#ff3a85', '#e0007c'],
  },
  dark: {
    bg: '#0d1117',
    fg: '#f0f6fc',
    muted: '#9198a1',
    subtle: '#9198a1',
    line: '#3d444d',
    card: '#151b23',
    heat: ['#151b23', '#4b0d2d', '#8e0c4c', '#d6086b', '#ff3d9a'],
  },
};

const brandStops = [
  [0, '#ff0059'],
  [0.12, '#ff0064'],
  [0.34, '#ff0083'],
  [0.63, '#ff00b5'],
  [0.98, '#ff00fa'],
  [1, '#ff00ff'],
];
const stops = brandStops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');

const markPaths = [
  'm56.95,24.63l-4.57-2.57-10.64,5.99,8.39,4.72c.9.5.9,1.79,0,2.3l-8.39,4.72-10.64,5.99-5.32,2.99-13.43,7.55c-.86.48-1.91-.14-1.91-1.12V12.63c0-.98,1.06-1.6,1.91-1.12l13.43,7.55,10.64-5.99L15.55,1.34C13.96.45,12.2,0,10.44,0,7.58,0,4.73,1.17,2.63,3.5.86,5.45,0,8.07,0,10.71v46.39c0,2.64.86,5.26,2.62,7.22,2.1,2.33,4.96,3.5,7.81,3.5,1.76,0,3.53-.45,5.12-1.34l20.87-11.74,5.32-2.99,10.64-5.99,4.91-2.76c4.09-2.3,6.23-7.11,4.95-11.88-.75-2.79-2.76-5.08-5.28-6.5Z',
  'm73.04,12.63v42.57c0,.98-1.06,1.6-1.91,1.12l-13.43-7.55-10.64,5.99,20.87,11.74c1.59.89,3.35,1.34,5.12,1.34,2.85,0,5.7-1.17,7.81-3.5,1.77-1.96,2.63-4.58,2.63-7.22V10.73c0-2.64-.85-5.26-2.62-7.22-2.1-2.34-4.96-3.51-7.82-3.51-1.76,0-3.53.45-5.12,1.34l-20.87,11.74-5.32,2.99-10.64,5.99-4.57,2.57c-2.52,1.42-4.53,3.71-5.28,6.5-1.29,4.77.86,9.58,4.95,11.88l4.91,2.76,10.64-5.99-8.39-4.72c-.9-.5-.9-1.79,0-2.3l8.39-4.72,10.64-5.99,5.32-2.99,13.43-7.55c.86-.48,1.91.14,1.91,1.12Z',
];

const tech = JSON.parse(read('logos/tech.json'));

const icons = {
  monitor: '<path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/><path d="M7 10h2l2 3l2 -6l1 3h3"/>',
  dashboard: '<path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"/><path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"/><path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"/><path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"/>',
  devices: '<path d="M13 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-10"/><path d="M18 8v-3a1 1 0 0 0 -1 -1h-13a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h9"/><path d="M16 9h2"/>',
  linkedin: '<path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/>',
  arrow: '<path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>',
  mail: '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M3 7l9 6l9 -6"/>',
  repo: '<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>',
};

const fonts = {
  display: ['Bricolage', 'fonts/bricolage.ttf', '400 700'],
  text: ['Hanken', 'fonts/hanken.ttf', '100 900'],
  mono: ['GeistMono', 'fonts/geist-mono.ttf', '500'],
};

function embedFont(file, text) {
  const dir = mkdtempSync(join(tmpdir(), 'readme-font-'));
  try {
    const outFile = join(dir, 'font.woff');
    execFileSync(process.env.PYFTSUBSET || 'pyftsubset', [
      fileURLToPath(new URL(file, root)),
      `--text=${text} `,
      '--flavor=woff',
      '--layout-features=kern,liga',
      '--no-hinting',
      `--output-file=${outFile}`,
    ], { stdio: 'ignore' });
    return `url(data:font/woff;base64,${readFileSync(outFile).toString('base64')}) format('woff')`;
  } catch {
    return `url(data:font/ttf;base64,${read(file).toString('base64')}) format('truetype')`;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const fontFace = (texts) =>
  Object.entries(texts)
    .map(([key, text]) => {
      const [family, file, weight] = fonts[key];
      return `@font-face{font-family:${family};src:${embedFont(file, text)};font-weight:${weight};font-display:block}`;
    })
    .join('');

const ease = 'cubic-bezier(.16,1,.3,1)';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const measure = (text, font, size) => [...text].reduce((w, c) => w + (metrics[font][c] ?? 0.5), 0) * size;
const MONO = 0.6;

const svg = (w, h, title, style, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><style>${style}</style>${body}</svg>\n`;

function header(t) {
  const W = 900;
  const H = 248;
  const style = `${fontFace({ display: content.name, text: content.tagline, mono: content.now + content.place })}
.n{font-family:Bricolage,system-ui,sans-serif;font-size:84px;font-weight:600;font-variation-settings:'opsz' 96,'wght' 600;letter-spacing:-2.2px;word-spacing:4px;fill:${t.fg}}
.t{font-family:Hanken,system-ui,sans-serif;font-size:23px;fill:${t.muted}}
.m{font-family:GeistMono,ui-monospace,monospace;font-size:13px;fill:${t.muted}}
.m tspan{fill:${t.fg}}
@media (prefers-reduced-motion:no-preference){
.r{animation:rise 1.1s ${ease} both}
.d1{animation-delay:.09s}.d2{animation-delay:.18s}.d3{animation-delay:.3s}
.l{transform-box:fill-box;transform-origin:left;animation:draw 1.8s ${ease} .45s both}
.p{transform-box:fill-box;transform-origin:center;animation:pulse 2.8s ${ease} 1.6s infinite}
}
@keyframes rise{from{opacity:0;transform:translateY(14px);filter:blur(8px)}}
@keyframes draw{from{transform:scaleX(0)}}
@keyframes pulse{0%{opacity:.45;transform:scale(1)}75%,to{opacity:0;transform:scale(3.6)}}`;
  const body = `<defs><linearGradient id="m1" x1="-4.12" y1="57.6" x2="43.22" y2="10.26" gradientUnits="userSpaceOnUse">${stops}</linearGradient><linearGradient id="m2" x1="40.26" y1="10.26" x2="87.6" y2="57.6" gradientUnits="userSpaceOnUse">${stops}</linearGradient><linearGradient id="hl" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient></defs>
<text class="n r d1" x="-4" y="84">${esc(content.name)}</text>
<text class="t r d2" x="0" y="136">${esc(content.tagline)}</text>
<g class="r d3"><circle class="p" cx="5" cy="197" r="4" fill="#ff0059"/><circle cx="5" cy="197" r="4" fill="#ff0059"/><text class="m" x="20" y="201.5"><tspan>${esc(content.now.split(' ')[0])}</tspan> ${esc(content.now.split(' ').slice(1).join(' '))}</text><text class="m" x="${W}" y="201.5" text-anchor="end">${esc(content.place)}</text></g>
<rect x="0" y="235" width="${W}" height="1" fill="${t.line}"/>
<rect class="l" x="0" y="234" width="120" height="3" rx="1.5" fill="url(#hl)"/>`;
  return svg(W, H, `${content.name}. ${content.tagline}`, style, body);
}

const hexRgb = (hex) => hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16));
const lum = (hex) => {
  const [r, g, b] = hexRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (hex, to, k) =>
  `#${hexRgb(hex)
    .map((v, i) => Math.round(v + (hexRgb(to)[i] - v) * k).toString(16).padStart(2, '0'))
    .join('')}`;

function logoColor(hex, t, bg) {
  const color = `#${hex}`;
  const [r, g, b] = hexRgb(color);
  if (Math.max(r, g, b) - Math.min(r, g, b) < 40) return t.fg;
  const toward = lum(bg) > 0.5 ? '#000000' : '#ffffff';
  let out = color;
  for (let k = 0.1; contrast(out, bg) < 2.4 && k < 0.95; k += 0.1) out = mix(color, toward, k);
  return out;
}

const dataUri = (file) => `data:${file.endsWith('.svg') ? 'image/svg+xml' : 'image/png'};base64,${read(file).toString('base64')}`;
const image = (file, x, y, w, h, align = 'xMidYMid meet') =>
  `<image href="${dataUri(file)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${align}"/>`;

function techLogo(slug, x, y, size, t, bg) {
  if (slug === 'playwright') return image('logos/playwright.svg', x, y, size, size);
  const icon = tech[slug];
  return `<g transform="translate(${x} ${y}) scale(${size / 24})"><path fill="${logoColor(icon.hex, t, bg)}" d="${icon.path}"/></g>`;
}

const markDefs = `<linearGradient id="m1" x1="-4.12" y1="57.6" x2="43.22" y2="10.26" gradientUnits="userSpaceOnUse">${stops}</linearGradient><linearGradient id="m2" x1="40.26" y1="10.26" x2="87.6" y2="57.6" gradientUnits="userSpaceOnUse">${stops}</linearGradient>`;
const mark = (x, y, width) =>
  `<g transform="translate(${x} ${y}) scale(${width / 87.6})"><path fill="url(#m1)" d="${markPaths[0]}"/><path fill="url(#m2)" d="${markPaths[1]}"/></g>`;

function wrap(text, font, size, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, font, size) > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function linkPill(link, t) {
  const size = 13;
  const H = 36;
  const padL = 11;
  const iconSize = 18;
  const gap = 9;
  const padR = 16;
  const textW = link.label.length * MONO * size;
  const W = Math.round(padL + iconSize + gap + textW + padR);
  const iy = (H - iconSize) / 2;
  let icon;
  if (link.logo === 'weapzy') icon = `<defs>${markDefs}</defs>${mark(padL, iy + (iconSize - 67.83 * (iconSize / 87.6)) / 2, iconSize)}`;
  else if (link.logo) icon = image(link.logo, padL, iy, iconSize, iconSize);
  else icon = `<g transform="translate(${padL} ${iy}) scale(${iconSize / 24})" fill="none" stroke="${t.fg}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icons[link.icon]}</g>`;
  const style = `${fontFace({ mono: link.label })}
.m{font-family:GeistMono,ui-monospace,monospace;font-size:${size}px;fill:${t.fg}}`;
  const body = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${(H - 1) / 2}" fill="${t.card}" stroke="${t.line}"/>
${icon}
<text class="m" x="${padL + iconSize + gap}" y="${H / 2 + 4.5}">${esc(link.label)}</text>`;
  return svg(W, H, link.label, style, body);
}

function workIcon(icon, x, y, t, id) {
  const size = 44;
  if (icon.image) {
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="11"/></clipPath><image href="${dataUri(icon.image)}" x="${x}" y="${y}" width="${size}" height="${size}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/><rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="10.5" fill="none" stroke="${t.fg}" stroke-opacity=".08"/>`;
  }
  if (icon.mono) {
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="11" fill="${icon.tile}"/><text class="mono" x="${x + size / 2}" y="${y + 28.5}" text-anchor="middle" fill="#ffffff">${esc(icon.mono)}</text>`;
  }
  const tile = `<rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="10.5" fill="${t.bg}" stroke="${t.line}"/>`;
  if (icon.logo) return tile + image(icon.logo[t.mode], x + 7, y + 7, size - 14, size - 14);
  return `${tile}<g transform="translate(${x + 11} ${y + 11}) scale(${22 / 24})" fill="none" stroke="${t.fg}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[icon.tabler]}</g>`;
}

function chips(items, x, y, maxW, t) {
  const size = 13.5;
  const h = 27;
  const pad = 11;
  const gap = 7;
  let cx = x;
  let cy = y;
  let out = '';
  for (const label of items) {
    const w = Math.round(measure(label, 'hanken', size) + pad * 2);
    if (cx > x && cx + w > x + maxW) {
      cx = x;
      cy += h + gap;
    }
    out += `<rect x="${cx + 0.5}" y="${cy + 0.5}" width="${w - 1}" height="${h - 1}" rx="${(h - 1) / 2}" fill="${t.bg}" stroke="${t.line}"/><text class="c" x="${cx + pad}" y="${cy + 18.2}">${esc(label)}</text>`;
    cx += w + gap;
  }
  return { svg: out, bottom: cy + h };
}

function work(t) {
  const W = 900;
  const gap = 16;
  const cols = 2;
  const cardW = (W - gap) / cols;
  const chipsH = Math.max(...content.work.map((w) => chips(w.examples, 0, 0, cardW - 48, t).bottom));
  const cardH = 148 + chipsH + 22 + 24 + 24;
  const rows = Math.ceil(content.work.length / cols);
  const H = rows * cardH + (rows - 1) * gap;
  const style = `${fontFace({
    display: content.work.map((w) => w.name + (w.icon.mono ?? '')).join(''),
    text: content.work.map((w) => w.text + w.examples.join('')).join(''),
  })}
.n{font-family:Bricolage,system-ui,sans-serif;font-size:21px;font-weight:600;font-variation-settings:'opsz' 28,'wght' 600;letter-spacing:-.35px;fill:${t.fg}}
.d{font-family:Hanken,system-ui,sans-serif;font-size:15.5px;fill:${t.muted}}
.c{font-family:Hanken,system-ui,sans-serif;font-size:13.5px;font-weight:500;fill:${t.fg}}
.mono{font-family:Bricolage,system-ui,sans-serif;font-size:18px;font-weight:650;font-variation-settings:'opsz' 24,'wght' 650}`;
  const body = content.work
    .map((item, i) => {
      const x = (i % cols) * (cardW + gap);
      const y = Math.floor(i / cols) * (cardH + gap);
      const lines = wrap(item.text, 'hanken', 15.5, cardW - 52);
      if (lines.length > 2) throw new Error(`Too long: ${item.name}`);
      const ex = chips(item.examples, x + 24, y + 148, cardW - 48, t);
      const logos = item.stack.map((slug, k) => techLogo(slug, x + 24 + k * 36, y + cardH - 48, 24, t, t.card)).join('');
      return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cardW - 1}" height="${cardH - 1}" rx="14" fill="${t.card}" stroke="${t.line}"/>
${workIcon(item.icon, x + 24, y + 24, t, `w${i}`)}
<text class="n" x="${x + 82}" y="${y + 53.5}">${esc(item.name)}</text>
${lines.map((line, k) => `<text class="d" x="${x + 24}" y="${y + 102 + k * 24}">${esc(line)}</text>`).join('')}
${ex.svg}
${logos}`;
    })
    .join('\n');
  return svg(W, H, content.work.map((w) => `${w.name}: ${w.text} ${w.examples.join(', ')}.`).join(' '), style, body);
}

function repoCard(repo, t) {
  const W = 440;
  const H = 166;
  const style = `${fontFace({ display: repo.name, text: repo.lines.join(''), mono: repo.language + repo.kind })}
.n{font-family:Bricolage,system-ui,sans-serif;font-size:21px;font-weight:600;font-variation-settings:'opsz' 24,'wght' 600;letter-spacing:-.3px;fill:${t.fg}}
.d{font-family:Hanken,system-ui,sans-serif;font-size:14.5px;fill:${t.muted}}
.m{font-family:GeistMono,ui-monospace,monospace;font-size:12px;fill:${t.muted}}`;
  const lines = repo.lines.map((line, i) => `<text class="d" x="24" y="${78 + i * 22}">${esc(line)}</text>`).join('');
  const body = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.card}" stroke="${t.line}"/>
<g transform="translate(24 27)" fill="${t.muted}">${icons.repo}</g>
<text class="n" x="48" y="42">${esc(repo.name)}</text>
${lines}
<circle cx="30" cy="${H - 30}" r="6" fill="${repo.color}"/>
<text class="m" x="44" y="${H - 26}">${esc(repo.language)}</text>
<text class="m" x="${W - 24}" y="${H - 26}" text-anchor="end">${esc(repo.kind)}</text>`;
  return svg(W, H, `${repo.name}: ${repo.lines.join(' ')}`, style, body);
}

function toolbox(t) {
  const W = 900;
  const col = W / content.toolbox.length;
  const rows = Math.max(...content.toolbox.map((c) => c.items.length));
  const rowH = 34;
  const H = 44 + rows * rowH;
  const style = `${fontFace({ text: content.toolbox.flatMap((c) => c.items.map(([, label]) => label)).join(''), mono: content.toolbox.map((c) => c.title).join('') })}
.h{font-family:GeistMono,ui-monospace,monospace;font-size:12px;fill:${t.subtle}}
.i{font-family:Hanken,system-ui,sans-serif;font-size:15.5px;fill:${t.fg}}`;
  const body = content.toolbox
    .map((c, ci) => {
      const x = Math.round(ci * col);
      const items = c.items
        .map(([slug, label], i) => {
          const y = 44 + i * rowH;
          return `${techLogo(slug, x, y, 20, t, t.bg)}<text class="i" x="${x + 32}" y="${y + 15.5}">${esc(label)}</text>`;
        })
        .join('');
      return `<text class="h" x="${x}" y="14">${esc(c.title)}</text><rect x="${x}" y="25" width="${Math.round(col - 28)}" height="1" fill="${t.line}"/>${items}`;
    })
    .join('');
  return svg(W, H, `Toolbox: ${content.toolbox.map((c) => `${c.title}: ${c.items.map(([, l]) => l).join(', ')}`).join('. ')}`, style, body);
}

function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN || execFileSync('gh', ['auth', 'token']).toString().trim();
  const query = `{ user(login:"Thomaslrt"){ contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`;
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'Thomaslrt-profile' },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .then((json) => {
      if (!json.data) throw new Error(JSON.stringify(json.errors ?? json));
      return json.data.user.contributionsCollection.contributionCalendar;
    });
}

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function activity(calendar, t) {
  const W = 900;
  const cell = 14;
  const step = 17;
  const top = 64;
  const H = top + 7 * step + 34;
  const style = `${fontFace({ text: '0123456789, contributions in the last year', mono: `${MONTHS.join('')}most of them in private reposLessMore` })}
.h{font-family:Hanken,system-ui,sans-serif;font-size:16px;fill:${t.fg}}
.h tspan{font-weight:650}
.m{font-family:GeistMono,ui-monospace,monospace;font-size:12px;fill:${t.subtle}}
@media (prefers-reduced-motion:no-preference){
.c{transform-box:fill-box;transform-origin:center;animation:pop .9s ${ease} both}
}
@keyframes pop{from{opacity:0;transform:scale(.3)}}`;
  const weeks = calendar.weeks;
  const offsetX = Math.round((W - (weeks.length * step - (step - cell))) / 2);
  let cells = '';
  let months = '';
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const x = offsetX + wi * step;
    const firstDay = new Date(`${week.contributionDays[0].date}T00:00:00Z`);
    const month = firstDay.getUTCMonth();
    if (month !== lastMonth && wi < weeks.length - 2) {
      if (lastMonth !== -1 || firstDay.getUTCDate() <= 7) months += `<text class="m" x="${x}" y="${top - 12}">${MONTHS[month]}</text>`;
      lastMonth = month;
    }
    week.contributionDays.forEach((day) => {
      const d = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      const level = LEVELS[day.contributionLevel] ?? 0;
      const delay = Math.round(wi * 16 + d * 22);
      cells += `<rect class="c" style="animation-delay:${delay}ms" x="${x}" y="${top + d * step}" width="${cell}" height="${cell}" rx="3.5" fill="${t.heat[level]}"><title>${day.contributionCount} on ${day.date}</title></rect>`;
    });
  });
  const total = calendar.totalContributions.toLocaleString('en-US');
  const legendY = top + 7 * step + 16;
  const legendCells = t.heat
    .map((c, i) => `<rect x="${W - offsetX - 5 * 17 + 3 + i * 17 - 44}" y="${legendY}" width="${cell}" height="${cell}" rx="3.5" fill="${c}"/>`)
    .join('');
  const legend = `<text class="m" x="${W - offsetX - 5 * 17 - 49}" y="${legendY + 11}" text-anchor="end">Less</text>${legendCells}<text class="m" x="${W - offsetX}" y="${legendY + 11}" text-anchor="end">More</text>`;
  const body = `<text class="h" x="${offsetX}" y="20"><tspan>${total}</tspan> contributions in the last year</text>
<text class="m" x="${W - offsetX}" y="20" text-anchor="end">most of them in private repos</text>
${months}${cells}${legend}`;
  return svg(W, H, `${total} contributions in the last year, most of them in private repos`, style, body);
}

const out = (name, data) => {
  mkdirSync(new URL('assets/', root), { recursive: true });
  writeFileSync(new URL(`assets/${name}`, root), data);
};

const only = process.argv[2];
for (const [mode, t] of Object.entries(themes)) {
  t.mode = mode;
  if (!only || only === 'static') {
    out(`header-${mode}.svg`, header(t));
    out(`work-${mode}.svg`, work(t));
    content.links.forEach((link) => out(`link-${link.id}-${mode}.svg`, linkPill(link, t)));
    content.repos.forEach((repo) => out(`repo-${repo.id}-${mode}.svg`, repoCard(repo, t)));
    out(`toolbox-${mode}.svg`, toolbox(t));
  }
}
if (!only || only === 'activity') {
  const calendar = await fetchCalendar();
  for (const [mode, t] of Object.entries(themes)) out(`activity-${mode}.svg`, activity(calendar, t));
}
