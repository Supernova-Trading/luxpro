// Generates public/qr-tip.png — a zero-dependency placeholder that *looks* like a
// QR code (quiet zone + three finder patterns + deterministic module fill) so the
// Bank Transfer tip modal never 404s. Not a scannable code; swap for the real
// payment QR before production.
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const MODULES = 29;      // module grid (odd → centered timing)
const SCALE = 9;         // px per module
const QUIET = 3;         // quiet-zone modules each side
const GRID = MODULES + QUIET * 2;
const SIZE = GRID * SCALE;

// 1 = dark, 0 = light. Start all-light (includes quiet zone).
const cells = Array.from({ length: GRID }, () => new Array(GRID).fill(0));

function finder(r, c) {
  for (let dr = 0; dr < 7; dr++)
    for (let dc = 0; dc < 7; dc++) {
      const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6;
      const core = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
      cells[r + dr][c + dc] = edge || core ? 1 : 0;
    }
}
// three finders, inset by the quiet zone
finder(QUIET, QUIET);
finder(QUIET, QUIET + MODULES - 7);
finder(QUIET + MODULES - 7, QUIET);

// deterministic pseudo-random data fill, skipping the finder regions
let seed = 0x9e3779b9;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0xffffffff);
for (let r = 0; r < MODULES; r++)
  for (let c = 0; c < MODULES; c++) {
    const inFinder =
      (r < 8 && c < 8) || (r < 8 && c >= MODULES - 8) || (r >= MODULES - 8 && c < 8);
    if (inFinder) continue;
    if (rand() > 0.52) cells[QUIET + r][QUIET + c] = 1;
  }

// rasterize grayscale (0=black,255=white), one filter byte per scanline
const raw = Buffer.alloc((SIZE + 1) * SIZE);
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE + 1)] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const dark = cells[(y / SCALE) | 0][(x / SCALE) | 0];
    raw[y * (SIZE + 1) + 1 + x] = dark ? 0 : 255;
  }
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td) >>> 0, 0);
  return Buffer.concat([len, td, crc]);
}
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 0;  // color type: grayscale
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(__dirname, "..", "public", "qr-tip.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log(`Wrote ${out} (${SIZE}x${SIZE}, ${png.length} bytes)`);
