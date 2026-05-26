/**
 * Builds the dual-track audio for the Amplify intro film and muxes it onto the
 * 60fps MP4, following huashu-design/audio-design-rules.md:
 *   - SFX layer: highpass 800Hz, full volume, frame-aligned cues (adelay)
 *   - BGM layer: lowpass 4kHz, ~0.42 vol, 0.3s fade-in / 1.5s fade-out
 *   - amix normalize=0 (preserve dynamic range; ~6-8dB SFX>BGM separation)
 *
 * Usage: NODE_PATH=$(npm root -g) node _build-audio.mjs <input.mp4> <output.mp4>
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const SKILL = '/Users/chapeltech/amplifybrands/.agents/skills/huashu-design';
const SFX = path.join(SKILL, 'assets/sfx');
const BGM = path.join(SKILL, 'assets/bgm-ad.mp3');
const DUR = 85;

const IN = process.argv[2];
const OUT = process.argv[3];
if (!IN || !OUT) { console.error('usage: node _build-audio.mjs in.mp4 out.mp4'); process.exit(1); }

// [timeSec, fileUnderSfx, gain] — curated cue list (dense chaos → sparse calm → punchy slams)
const CUES = [
  // S1 · opening chaos (notification build + word slams + hard cut)
  [0.30, 'feedback/notification-pop', 0.8], [0.60, 'feedback/notification-pop', 0.8],
  [0.95, 'feedback/notification-pop', 0.8], [1.30, 'feedback/notification-pop', 0.8],
  [1.70, 'feedback/notification-pop', 0.8],
  [2.40, 'impact/drop-thud', 0.85], [2.95, 'impact/drop-thud', 0.85],
  [3.50, 'impact/drop-thud', 0.9], [4.05, 'impact/drop-thud', 1.0],
  [6.30, 'transition/whoosh-fast', 0.9], [7.45, 'impact/drop-thud', 1.0],
  // S2 · business owner pain
  [8.60, 'ui/tap-finger', 0.6], [9.40, 'ui/tap-finger', 0.6], [10.20, 'ui/tap-finger', 0.6],
  [14.90, 'feedback/notification-pop', 0.9], [17.20, 'impact/drop-thud', 1.0],
  // S3 · AI spaghetti
  [19.40, 'feedback/notification-pop', 0.55], [20.00, 'transition/whoosh', 0.7],
  [20.60, 'feedback/notification-pop', 0.55], [21.30, 'feedback/notification-pop', 0.55],
  [23.20, 'impact/brand-stamp', 1.0], [24.10, 'feedback/error-tone', 0.45],
  [31.80, 'transition/whoosh-fast', 0.9],
  // S4 · the shift (sparse — let order breathe)
  [32.10, 'magic/transform', 0.9], [34.00, 'magic/sparkle', 0.6], [35.85, 'ui/toggle-on', 0.9],
  // S5 · what we do (modular)
  [45.05, 'transition/slide-in', 0.8], [45.70, 'container/card-snap', 0.65],
  [48.75, 'transition/slide-in', 0.8], [49.40, 'container/card-snap', 0.65],
  [52.45, 'transition/slide-in', 0.8], [53.10, 'container/card-snap', 0.65],
  [54.30, 'feedback/success-chime', 0.7],
  [56.15, 'transition/slide-in', 0.8], [56.80, 'container/card-snap', 0.65],
  [62.40, 'impact/drop-thud', 1.0],
  // S6 · differentiator (gaudy → SMASH CUT → punch)
  [63.20, 'feedback/notification-pop', 0.7], [64.30, 'feedback/notification-pop', 0.7],
  [65.60, 'impact/drop-thud', 1.0], [67.00, 'impact/drop-thud', 0.8], [68.25, 'impact/drop-thud', 0.9],
  // S7 · close + logo reveal
  [76.50, 'impact/drop-thud', 0.9], [77.70, 'transition/whoosh', 0.9],
  [79.40, 'impact/logo-reveal-v2', 1.0], [80.80, 'feedback/success-chime', 0.8],
];

// ── 1. build SFX track ──
const sfxInputs = [];
const sfxFilters = [];
CUES.forEach(([t, f, g], i) => {
  sfxInputs.push('-i', path.join(SFX, f + '.mp3'));
  const ms = Math.round(t * 1000);
  sfxFilters.push(`[${i}:a]adelay=${ms}|${ms},volume=${g}[a${i}]`);
});
const mixIn = CUES.map((_, i) => `[a${i}]`).join('');
const sfxTrack = path.resolve('sfx-track.mp3');
const sfxFilter = sfxFilters.join(';') + ';' + `${mixIn}amix=inputs=${CUES.length}:duration=longest:normalize=0[mix]`;

console.log(`▸ Building SFX track (${CUES.length} cues)…`);
let r = spawnSync('ffmpeg', ['-y', ...sfxInputs, '-filter_complex', sfxFilter, '-map', '[mix]', '-t', String(DUR), sfxTrack], { stdio: ['ignore', 'ignore', 'pipe'] });
if (r.status !== 0) { console.error('SFX build failed:\n' + r.stderr.toString().slice(-1500)); process.exit(1); }

// ── 2. mux video + SFX (highpass) + BGM (lowpass, fade, ducked) ──
console.log('▸ Muxing video + SFX + BGM (frequency-isolated)…');
const finalFilter =
  `[2:a]atrim=0:${DUR},afade=in:st=0:d=0.3,afade=out:st=${DUR - 1.5}:d=1.5,lowpass=f=4000,volume=0.42[bgm];` +
  `[1:a]highpass=f=800,volume=1.0[sfx];` +
  `[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]`;
r = spawnSync('ffmpeg', ['-y', '-i', IN, '-i', sfxTrack, '-i', BGM,
  '-filter_complex', finalFilter, '-map', '0:v', '-map', '[a]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', OUT],
  { stdio: ['ignore', 'ignore', 'pipe'] });
if (r.status !== 0) { console.error('Mux failed:\n' + r.stderr.toString().slice(-1500)); process.exit(1); }
console.log('✓ ' + OUT);
