/**
 * Generates simple original placeholder tracks (no copyright) into public/music.
 * Run:  node scripts/make-placeholder-music.cjs   (needs ffmpeg on PATH)
 * Replace the MP3s with professionally made royalty-free music before launch;
 * keep the same file names and nothing else needs to change.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SR = 44100;
const OUT = path.join(__dirname, "..", "public", "music");
const hz = (semi) => 440 * Math.pow(2, (semi - 9) / 12); // semitones above C4

function makeBuf(seconds) { return new Float32Array(Math.floor(seconds * SR)); }
function add(buf, start, samples, gain = 1) {
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < samples.length && s0 + i < buf.length; i++) buf[s0 + i] += samples[i] * gain;
}
// Karplus-Strong plucked string (sitar / guitar-like)
function pluck(freq, dur, bright = 0.996) {
  const n = Math.floor(dur * SR), N = Math.max(2, Math.round(SR / freq));
  const line = new Float32Array(N).map(() => Math.random() * 2 - 1);
  const out = new Float32Array(n);
  let p = 0;
  for (let i = 0; i < n; i++) {
    const a = line[p], b = line[(p + 1) % N];
    out[i] = a;
    line[p] = bright * 0.5 * (a + b);
    p = (p + 1) % N;
  }
  return out;
}
// Soft piano-ish tone: harmonics with exponential decay
function tone(freq, dur, decay = 3, harmonics = [1, 0.5, 0.25, 0.12]) {
  const n = Math.floor(dur * SR), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = Math.exp(-decay * t) * Math.min(1, t * 200);
    let v = 0;
    harmonics.forEach((h, k) => (v += h * Math.sin(2 * Math.PI * freq * (k + 1) * t)));
    out[i] = v * env;
  }
  return out;
}
function pad(freq, dur) {
  const n = Math.floor(dur * SR), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = Math.min(1, t / 2) * Math.min(1, (dur - t) / 2);
    out[i] = env * (Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 1.005 * t) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * t)) / 1.8;
  }
  return out;
}
function thump(dur = 0.25, f0 = 90) {
  const n = Math.floor(dur * SR), out = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; out[i] = Math.sin(2 * Math.PI * (f0 + 120 * Math.exp(-30 * t)) * t) * Math.exp(-14 * t); }
  return out;
}
function tick(dur = 0.08) {
  const n = Math.floor(dur * SR), out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() * 2 - 1) * Math.exp(-50 * (i / SR));
  return out;
}
function simpleReverb(buf, mix = 0.25) {
  const out = Float32Array.from(buf);
  [[0.043, 0.45], [0.071, 0.35], [0.113, 0.25], [0.167, 0.18]].forEach(([d, g]) => {
    const off = Math.floor(d * SR);
    for (let i = off; i < buf.length; i++) out[i] += buf[i - off] * g * mix * 2;
  });
  return out;
}
function writeMp3(name, buf) {
  let peak = 0; buf.forEach((v) => (peak = Math.max(peak, Math.abs(v))));
  const fade = 1.5 * SR;
  const pcm = Buffer.alloc(buf.length * 2);
  for (let i = 0; i < buf.length; i++) {
    const f = Math.min(1, i / (0.05 * SR)) * Math.min(1, (buf.length - i) / fade);
    pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round((buf[i] / peak) * 0.8 * f * 32767))), i * 2);
  }
  const wav = path.join(OUT, name + ".wav");
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(wav, Buffer.concat([header, pcm]));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "80k", path.join(OUT, name + ".mp3")]);
  fs.unlinkSync(wav);
  console.log("✔", name + ".mp3", Math.round(fs.statSync(path.join(OUT, name + ".mp3")).size / 1024) + "KB");
}

// 1) Sitar-style melody over a tanpura drone (Bhairavi-like scale)
(() => {
  const T = 48, buf = makeBuf(T);
  const scale = [0, 1, 3, 5, 7, 8, 10, 12, 13, 15]; // semitones
  const melody = [0, 3, 4, 3, 2, 0, 1, 0, 4, 5, 4, 3, 2, 1, 0, 2, 3, 4, 6, 5, 4, 3, 2, 0];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) add(buf, r * 12 + k * 3, pluck(hz(-12 + (k % 2 ? 7 : 0)), 3.2, 0.9985), 0.35);
  let t = 0.5, i = 0;
  while (t < T - 4) {
    const note = scale[melody[i % melody.length]] + 0;
    const d = i % 4 === 3 ? 1.2 : 0.6;
    add(buf, t, pluck(hz(note), 2.2, 0.994), 0.9);
    if (i % 3 === 0) add(buf, t + 0.3, pluck(hz(note + 12), 1.4, 0.99), 0.25);
    t += d; i++;
  }
  writeMp3("shahi-sitar", simpleReverb(buf, 0.5));
})();

// 2) Soft piano — slow arpeggiated chords
(() => {
  const T = 48, buf = makeBuf(T);
  const chords = [[0, 4, 7, 12], [-3, 0, 4, 9], [-7, -3, 0, 5], [-5, -1, 2, 7]]; // C, Am, F, G
  for (let c = 0; c < 8; c++) {
    const ch = chords[c % 4], t0 = c * 6;
    for (let r = 0; r < 12; r++) add(buf, t0 + r * 0.5, tone(hz(ch[r % 4] + (r % 8 > 3 ? 12 : 0)), 2.5, 2.2), 0.55);
    add(buf, t0, tone(hz(ch[0] - 12), 5, 0.9), 0.5);
  }
  writeMp3("soft-piano", simpleReverb(buf, 0.6));
})();

// 3) Festive dhol rhythm + bright plucks (≈ 112 BPM)
(() => {
  const T = 40, buf = makeBuf(T), beat = 60 / 112;
  const scale = [0, 2, 4, 7, 9, 12, 14, 16];
  for (let b = 0; b * beat < T - 2; b++) {
    const t = b * beat;
    if (b % 4 === 0 || b % 4 === 2) add(buf, t, thump(0.3, 80), 0.9);
    if (b % 4 === 3) { add(buf, t, thump(0.2, 110), 0.6); add(buf, t + beat / 2, thump(0.2, 130), 0.5); }
    add(buf, t + beat / 2, tick(), 0.35); add(buf, t, tick(0.05), 0.2);
    add(buf, t, pluck(hz(scale[(b * 3) % scale.length]), 0.9, 0.99), 0.55);
    if (b % 2) add(buf, t + beat / 2, pluck(hz(scale[(b * 5 + 2) % scale.length] + 12), 0.5, 0.985), 0.3);
  }
  writeMp3("festive-dhol", simpleReverb(buf, 0.3));
})();

// 4) Calm ambient pads with soft bell notes
(() => {
  const T = 48, buf = makeBuf(T);
  const roots = [-12, -15, -17, -19];
  for (let c = 0; c < 4; c++) [0, 7, 12, 16].forEach((s) => add(buf, c * 12, pad(hz(roots[c] + s), 13), 0.28));
  const notes = [12, 16, 19, 24, 19, 16, 14, 19];
  for (let i = 0; i < 16; i++) add(buf, 1 + i * 2.7, tone(hz(notes[i % notes.length]), 3.5, 1.4, [1, 0.2, 0.08]), 0.5);
  writeMp3("calm-pads", simpleReverb(buf, 0.7));
})();
