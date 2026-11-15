// Local dev server for Second Voice. Node built-ins only: no packages, no install.
// Serves this folder at http://localhost:5173, reachable from this computer only.
//
// It also bridges the page to the learner's own AI agent (Claude Code, Codex or Gemini CLI).
// The page sends a prompt to POST /api/ask; the server runs the agent's CLI in headless mode
// and sends back what it answered. No API key: the agent uses its own login.
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = __dirname;
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 5173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.woff2': 'font/woff2',
};

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}
const sendJSON = (res, code, obj) => send(res, code, JSON.stringify(obj), 'application/json; charset=utf-8');

/* ================= Agent bridge ================= */

// The page asks for short, self-contained answers (a dictionary entry, a role-play line, JSON feedback).
// The agent gets no tools and runs outside this folder, so it does not load the coach instructions.
const SYSTEM = 'You are the AI inside Second Voice, an English-learning web app. Each message is one self-contained request from the app. '
  + 'Answer it directly and only it. When it asks for JSON, reply with only that JSON object: no code fences, no comments.';

// Faster models for the page: a lookup should not take as long as a coding task. SV_MODEL overrides both.
const CLAUDE_MODEL = { default: 'sonnet', quick: 'haiku' };

const AGENTS = {
  claude: {
    name: 'Claude Code', bin: 'claude',
    args: (tier) => ['-p', '--output-format', 'text', '--model', process.env.SV_MODEL || CLAUDE_MODEL[tier] || CLAUDE_MODEL.default,
      '--tools', '', '--system-prompt', SYSTEM],
    stdin: (prompt) => prompt,
  },
  codex: {
    name: 'Codex', bin: 'codex',
    args: (tier, outFile) => ['exec', '--skip-git-repo-check', '--sandbox', 'read-only', '--color', 'never',
      ...(process.env.SV_MODEL ? ['--model', process.env.SV_MODEL] : []), '--output-last-message', outFile, '-'],
    stdin: (prompt) => `${SYSTEM}\n\n${prompt}`,
    usesOutFile: true,
  },
  gemini: {
    name: 'Gemini CLI', bin: 'gemini',
    args: (tier) => [...(process.env.SV_MODEL ? ['-m', process.env.SV_MODEL] : []), '-p', ''],
    stdin: (prompt) => `${SYSTEM}\n\n${prompt}`,
  },
};

// A server started from an app or an IDE may have a short PATH; look where these CLIs usually live too.
const HOME = os.homedir();
const SEARCH = [...(process.env.PATH || '').split(path.delimiter),
  path.join(HOME, '.local', 'bin'), path.join(HOME, '.claude', 'local'), path.join(HOME, '.npm-global', 'bin'),
  '/opt/homebrew/bin', '/usr/local/bin'].filter(Boolean);

function which(bin) {
  for (const dir of SEARCH) {
    const p = path.join(dir, bin);
    try { fs.accessSync(p, fs.constants.X_OK); if (fs.statSync(p).isFile()) return p; } catch { /* not here */ }
  }
  return null;
}

// SV_AGENT=claude|codex|gemini picks one; otherwise the first one installed wins.
function findAgent() {
  const wanted = (process.env.SV_AGENT || '').toLowerCase();
  const order = AGENTS[wanted] ? [wanted] : Object.keys(AGENTS);
  for (const id of order) {
    const bin = which(AGENTS[id].bin);
    if (bin) return { id, bin, ...AGENTS[id] };
  }
  return null;
}
const AGENT = findAgent();

// The agent runs in an empty folder: no project instructions, no learner files in reach.
const WORK = path.join(os.tmpdir(), 'second-voice-agent');
fs.mkdirSync(WORK, { recursive: true });

const MAX_BODY = 64 * 1024, MAX_OUT = 1024 * 1024, TIMEOUT = 120 * 1000, MAX_RUNNING = 3;
let running = 0, seq = 0;

function runAgent(prompt, tier) {
  return new Promise((resolve, reject) => {
    const outFile = path.join(WORK, `answer-${process.pid}-${++seq}.txt`);
    const child = spawn(AGENT.bin, AGENT.args(tier, outFile), { cwd: WORK, env: process.env, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '', done = false;
    const finish = (fn, v) => { if (done) return; done = true; clearTimeout(timer); fn(v); };
    const timer = setTimeout(() => { child.kill('SIGTERM'); finish(reject, Object.assign(new Error('Your agent took too long to answer.'), { code: 'timeout' })); }, TIMEOUT);
    child.stdout.on('data', (d) => { if (out.length < MAX_OUT) out += d; });
    child.stderr.on('data', (d) => { if (err.length < MAX_OUT) err += d; });
    child.on('error', (e) => finish(reject, Object.assign(new Error(`Could not start ${AGENT.bin}: ${e.message}`), { code: 'agent_failed' })));
    child.on('close', (code) => {
      let text = out;
      if (AGENT.usesOutFile) { try { text = fs.readFileSync(outFile, 'utf8'); } catch { /* fall back to stdout */ } fs.rm(outFile, { force: true }, () => {}); }
      if (code === 0 && text.trim()) return finish(resolve, text.trim());
      // Only the last line of the agent's error goes back to the page, never the prompt.
      const why = (err.trim() || out.trim()).split('\n').filter(Boolean).pop() || `exited with code ${code}`;
      finish(reject, Object.assign(new Error(why.slice(0, 300)), { code: 'agent_failed' }));
    });
    child.stdin.on('error', () => { /* the child exited early; 'close' reports it */ });
    child.stdin.end(AGENT.stdin(prompt));
  });
}

// Only this page may use the bridge. Another site open in the same browser could otherwise make
// the agent run: the Host check stops DNS rebinding, the custom header forces a CORS preflight
// that this server never approves, and the Origin check covers the rest.
function sameSite(req) {
  const ok = [`localhost:${PORT}`, `127.0.0.1:${PORT}`];
  if (!ok.includes(req.headers.host)) return false;
  if (req.headers['x-second-voice'] !== '1') return false;
  const o = req.headers.origin;
  return !o || ok.some((h) => o === `http://${h}`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (d) => { body += d; if (body.length > MAX_BODY) { reject(new Error('too big')); req.destroy(); } });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function api(req, res, rel) {
  if (!sameSite(req)) return sendJSON(res, 403, { error: 'Forbidden', code: 'forbidden' });

  if (rel === '/api/agent' && req.method === 'GET') {
    return sendJSON(res, 200, AGENT ? { agent: AGENT.id, name: AGENT.name } : { agent: null });
  }

  if (rel === '/api/ask' && req.method === 'POST') {
    if (!AGENT) return sendJSON(res, 503, { error: 'No AI agent found on this computer.', code: 'no_agent' });
    if (running >= MAX_RUNNING) return sendJSON(res, 429, { error: 'Too many requests at once.', code: 'rate_limited' });
    let prompt, tier;
    try { ({ prompt, tier } = JSON.parse(await readBody(req))); } catch { return sendJSON(res, 400, { error: 'Bad request', code: 'bad_request' }); }
    if (typeof prompt !== 'string' || !prompt.trim()) return sendJSON(res, 400, { error: 'Empty prompt', code: 'bad_request' });
    running++;
    const t0 = Date.now();
    try {
      const text = await runAgent(prompt, tier === 'quick' ? 'quick' : 'default');
      console.log(`[agent] ${AGENT.name} answered in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      return sendJSON(res, 200, { text });
    } catch (e) {
      console.error(`[agent] ${AGENT.name} failed after ${((Date.now() - t0) / 1000).toFixed(1)}s: ${e.message}`);
      return sendJSON(res, e.code === 'timeout' ? 504 : 502, { error: e.message, code: e.code || 'agent_failed' });
    } finally { running--; }
  }

  return sendJSON(res, 404, { error: 'Not found', code: 'not_found' });
}

/* ================= Static files ================= */

const server = http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { return send(res, 400, 'Bad request'); }

  if (rel.startsWith('/api/')) return void api(req, res, rel).catch(() => sendJSON(res, 500, { error: 'Server error', code: 'server' }));

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');

  // Never serve hidden files or folders (.git, .claude, .env…).
  if (rel.split('/').some((part) => part.startsWith('.'))) return send(res, 404, 'Not found');

  let file = path.join(ROOT, rel);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return send(res, 404, 'Not found');

  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err2, data) => {
      if (err2) return send(res, 404, 'Not found');
      const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Close the other server, or run with another port: PORT=5174 npm run dev`);
  } else {
    console.error(e.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Second Voice is running at http://localhost:${PORT}  (Ctrl+C to stop)`);
  console.log(AGENT
    ? `AI coach in the page: ${AGENT.name} (${AGENT.bin})`
    : 'AI coach in the page: off. Install Claude Code, Codex or Gemini CLI and restart, or set SV_AGENT.');
});
