/* Second Voice: natural neural voices (Kokoro-82M), run off the main thread.
   Loaded only after the learner opts in. The model comes from Hugging Face once and the
   browser caches it; the text to speak never leaves this computer. */
import { KokoroTTS } from 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
let tts = null;
let chain = Promise.resolve(); // one generation at a time: the ONNX session is not re-entrant

self.onmessage = (e) => {
  const m = e.data || {};
  if (m.type === 'load') load(m);
  else if (m.type === 'speak') chain = chain.then(() => speak(m));
};

const progress_callback = (p) => {
  if (p && p.status === 'progress' && /\.onnx$/.test(p.file || '')) self.postMessage({ type: 'progress', loaded: p.loaded, total: p.total });
};

/* With a GPU: the full model (about 330 MB, roughly 1 s per sentence). Without one, or if the GPU
   fails: the small CPU model (about 90 MB, slower to start). */
async function load(m) {
  const gpu = m.gpu && self.navigator && self.navigator.gpu && (await self.navigator.gpu.requestAdapter().catch(() => null));
  if (gpu) {
    try {
      tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'fp32', device: 'webgpu', progress_callback });
      self.postMessage({ type: 'ready', device: 'webgpu', voices: Object.keys(tts.voices || {}) });
      return;
    } catch (err) {
      self.postMessage({ type: 'note', message: 'GPU voice failed, using the CPU model: ' + String((err && err.message) || err).slice(0, 200) });
    }
  }
  try {
    tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'q8', device: 'wasm', progress_callback });
    self.postMessage({ type: 'ready', device: 'wasm', voices: Object.keys(tts.voices || {}) });
  } catch (err) {
    self.postMessage({ type: 'error', message: String((err && err.message) || err).slice(0, 300) });
  }
}

async function speak(m) {
  if (!tts) { self.postMessage({ type: 'audio', id: m.id, error: 'not loaded' }); return; }
  try {
    const out = await tts.generate(String(m.text || ''), { voice: m.voice, speed: m.speed || 1 });
    const pcm = out.audio;
    self.postMessage({ type: 'audio', id: m.id, pcm, sr: out.sampling_rate }, [pcm.buffer]);
  } catch (err) {
    self.postMessage({ type: 'audio', id: m.id, error: String((err && err.message) || err).slice(0, 300) });
  }
}
