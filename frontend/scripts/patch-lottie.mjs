/**
 * Patches the Onix orbit Lottie animation for a seamless loop.
 *
 * Source animation (scripts/lottie/source.json): 3708 frames @ 60 fps.
 * Intro (opacity fades + entrances) completes by ~frame 110. Orbit motions
 * are near-periodic but with DIFFERENT per-layer periods — no common seam
 * exists in the original data.
 *
 * Strategy — per-layer time-warp (original trajectories, no curve fitting):
 *  1. Intro segment [0, LOOP_START] plays once.
 *  2. Loop segment [LOOP_START, LOOP_START+LOOP_LEN]: every orbit layer's
 *     keyframes are retimed so that an integer number of its natural
 *     cycles (period P, measured by autocorrelation) spans exactly one
 *     loop: input window [t1, t1 + m·P] → output [t1, t1 + LOOP_LEN].
 *     The curve shape is untouched (same keys, same easing) — only time
 *     is scaled by LOOP_LEN/(m·P) (factors stay within ±11%).
 *     Periodicity then makes the seam value match up to the curve's own
 *     periodicity residual (≤ ~8 px on this composition).
 *  3. Rotation (L[1].ks.r) is rewritten as a constant-speed linear ramp
 *     of exactly N full turns per loop (seam exact mod 360, constant
 *     angular velocity → no kink).
 *  4. Opacity and settled (constant) properties are left untouched.
 *  5. Verifies every keyframe property at the seam with bezier-accurate
 *     evaluation before writing the output.
 *
 * Constants LOOP_START / LOOP_LEN were chosen by an exhaustive search over
 * (t1, D) minimizing max seam residual with per-layer speed factors in
 * [0.80, 1.25]: best = t1 150 (2.5 s), D 2360 (39.3 s).
 *
 * Usage: node scripts/patch-lottie.mjs [input.json] [output.json]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')

const INPUT = resolve(process.argv[2] ?? `${HERE}/lottie/source.json`)
const OUTPUT = resolve(
  process.argv[3] ?? `${ROOT}/src/features/hero/assets/onix-orbit.json`,
)

const LOOP_START = 150 // t1 — intro end / loop start (2.5 s)
const LOOP_LEN = 2360 // loop duration (39.3 s)
const LOOP_END = LOOP_START + LOOP_LEN // 2510
const SRC_END = 3708 // last frame of source data (input windows must fit)

// Natural periods of orbit layers (frames), measured by autocorrelation:
//   residual rms at best lag: L0 3-5px, L1 6-7px, L2 ~1px, L3/L4/L7 5-13px
const PERIODS = {
  'L[0]': 2100,
  'L[1]': 2540,
  'L[2]': 720,
  'L[3]': 1300,
  'L[4]': 1300,
  'L[7]': 1300,
}

const FAC_MIN = 0.8 // allowed time-warp speed factor range
const FAC_MAX = 1.25
const SEAM_TOL_POS = 12 // px — periodicity residual budget at the seam
const SEAM_TOL_ROT = 0.05 // deg
const SEAM_TOL_OTHER = 0.05 // opacity / settled props

const LINEAR = { i: { x: [1], y: [1] }, o: { x: [0], y: [0] } }

// ---------------------------------------------------------------- helpers

const isKf = (v) =>
  Array.isArray(v) &&
  v.length > 0 &&
  typeof v[0] === 'object' &&
  v[0] !== null &&
  't' in v[0] &&
  's' in v[0]

function walk(node, path, visit) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`, visit))
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'k' && isKf(v)) visit(path, v)
      else walk(v, `${path}.${k}`, visit)
    }
  }
}

/** Unwrap possibly-array keyframe start value to a scalar. */
const s0 = (s) => (Array.isArray(s[0]) ? s[0][0] : s[0])

/** Easing component: per-dimension arrays or plain numbers. */
const ez = (v, d) => (v === undefined ? d : Array.isArray(v) ? v[0] : v)

/**
 * Cubic-bezier easing evaluation (bodymovin/CSS convention):
 * segment A→B has control points C1 = A.o, C2 = B.i in the unit square.
 * Returns y(p) for the param p whose x(p) = frac, via bisection.
 */
function easeY(ax, ay, bx, by, frac) {
  const xAt = (p) => {
    const q = 1 - p
    return 3 * q * q * p * ax + 3 * q * p * p * bx + p * p * p
  }
  let lo = 0
  let hi = 1
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (xAt(mid) < frac) lo = mid
    else hi = mid
  }
  const p = (lo + hi) / 2
  const q = 1 - p
  return 3 * q * q * p * ay + 3 * q * p * p * by + p * p * p
}

/** Bezier-accurate value of a scalar keyframe track at frame f. */
function valAt(keys, f) {
  if (f <= keys[0].t) return s0(keys[0].s)
  const last = keys[keys.length - 1]
  if (f >= last.t) return s0(last.s)
  let lo = 0
  let hi = keys.length - 1
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (keys[mid].t <= f) lo = mid
    else hi = mid
  }
  const a = keys[lo]
  const b = keys[hi]
  if (b.t === a.t || a.h === 1) return s0(a.s)
  const frac = (f - a.t) / (b.t - a.t)
  const y = easeY(
    ez(a.o?.x, 0),
    ez(a.o?.y, 0),
    ez(b.i?.x, 1),
    ez(b.i?.y, 1),
    frac,
  )
  return s0(a.s) + (s0(b.s) - s0(a.s)) * y
}

const layerOf = (path) => (path.match(/^L\[\d+\]/) ?? [null])[0]
const isPos = (path) => /\.p\.(x|y)$/.test(path)
const isRot = (path) => /\.r$/.test(path)

// ---------------------------------------------------------------- collect

const doc = JSON.parse(readFileSync(INPUT, 'utf8'))
const props = []
walk(doc.layers, 'L', (path, k) => props.push({ path, keys: k }))
walk(doc.assets, 'A', (path, k) => props.push({ path, keys: k }))

const positions = props.filter((p) => isPos(p.path))
const rotations = props.filter((p) => isRot(p.path))

console.log(`input: ${INPUT}`)
console.log(
  `loop: intro [0, ${LOOP_START}] once, loop [${LOOP_START}, ${LOOP_END}] ` +
    `(${LOOP_LEN} f = ${(LOOP_LEN / 60).toFixed(1)} s)`,
)

// ---------------------------------------------------------------- warp plan

/** Group orbit position axes per layer and pick integer cycle count m. */
const warpPlan = new Map() // layer → { P, m, span, axes: [{path, keys}] }

for (const p of positions) {
  const layer = layerOf(p.path)
  const P = PERIODS[layer]
  if (!P) continue // settled / non-orbit positions stay untouched
  if (!warpPlan.has(layer)) warpPlan.set(layer, { P, m: null, span: 0, axes: [] })
  warpPlan.get(layer).axes.push(p)
}

for (const [layer, plan] of warpPlan) {
  const { P, axes } = plan
  let best = null
  for (let m = 1; m <= 6; m++) {
    const span = m * P
    if (LOOP_START + span > SRC_END) continue // must use real source data
    const factor = span / LOOP_LEN
    if (factor < FAC_MIN || factor > FAC_MAX) continue
    let res = 0
    for (const { keys } of axes) {
      res = Math.max(
        res,
        Math.abs(valAt(keys, LOOP_START + span) - valAt(keys, LOOP_START)),
      )
    }
    const nearIdeal = Math.abs(factor - 1) // tie-break: speed closest to 1
    if (!best || res < best.res - 1e-9 || (Math.abs(res - best.res) <= 1e-9 && nearIdeal < best.nearIdeal)) {
      best = { m, span, factor, res }
    }
  }
  if (!best) throw new Error(`no valid warp cycle count for ${layer}`)
  plan.m = best.m
  plan.span = best.span
  plan.factor = best.factor
  plan.res = best.res
  console.log(
    `  warp ${layer}: P=${P} m=${best.m} span=${best.span} ` +
      `factor=${best.factor.toFixed(3)} seamΔ=${best.res.toFixed(1)}px`,
  )
}

// ---------------------------------------------------------------- patch

const generated = new Map() // path → replacement keyframe array

/**
 * Time-warp one scalar track: head keys (< LOOP_START) are kept verbatim;
 * keys inside [LOOP_START, LOOP_START + span] are retimed onto
 * [LOOP_START, LOOP_END]; keys after the window are dropped. Boundary keys
 * are inserted (bezier-accurate values) so the track is defined exactly at
 * both loop endpoints.
 */
function warpTrack(keys, span) {
  const scale = LOOP_LEN / span
  const out = []
  for (const k of keys) {
    if (k.t < LOOP_START) out.push({ ...k })
    else if (k.t <= LOOP_START + span) {
      out.push({
        ...k,
        t: Math.round((LOOP_START + (k.t - LOOP_START) * scale) * 100) / 100,
      })
    }
  }

  if (!keys.some((k) => k.t === LOOP_START)) {
    const next = keys.find((k) => k.t > LOOP_START)
    out.push({
      i: next?.i ? { ...next.i } : { ...LINEAR.i },
      o: { ...LINEAR.o },
      t: LOOP_START,
      s: [Number(valAt(keys, LOOP_START).toFixed(3))],
    })
  }
  if (!keys.some((k) => k.t === LOOP_START + span)) {
    out.push({
      i: { ...LINEAR.i },
      o: { ...LINEAR.o },
      t: LOOP_END,
      s: [Number(valAt(keys, LOOP_START + span).toFixed(3))],
    })
  }
  out.sort((a, b) => a.t - b.t)
  return out
}

for (const plan of warpPlan.values()) {
  for (const { path, keys } of plan.axes) {
    generated.set(path, warpTrack(keys, plan.span))
  }
}

for (const p of rotations) {
  const v1 = valAt(p.keys, LOOP_START)
  const delta = valAt(p.keys, LOOP_START + LOOP_LEN) - v1
  const turns = Math.round(delta / 360)
  const head = p.keys.map((k) => ({ ...k })).filter((k) => k.t < LOOP_START)
  const atStart = p.keys.find((k) => k.t === LOOP_START)
  head.push({
    i: atStart?.i ? { ...atStart.i } : { ...LINEAR.i },
    o: { ...LINEAR.o }, // constant angular velocity from the seam
    t: LOOP_START,
    s: [atStart ? s0(atStart.s) : Number(v1.toFixed(3))],
  })
  head.push({ ...LINEAR, t: LOOP_END, s: [Number((v1 + 360 * turns).toFixed(3))] })
  generated.set(p.path, head)
  console.log(
    `  rot  ${p.path}: ${delta.toFixed(1)}° → ${turns * 360}° ` +
      `(${((turns * 360) / (LOOP_LEN / 60)).toFixed(1)}°/s constant)`,
  )
}

// re-walk and replace keyframe arrays by exact path match
;(function apply() {
  const replace = (node, path) => {
    if (Array.isArray(node)) node.forEach((v, i) => replace(v, `${path}[${i}]`))
    else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === 'k' && isKf(v)) {
          const t = generated.get(path)
          if (t) node[k] = t
        } else replace(v, `${path}.${k}`)
      }
    }
  }
  replace(doc.layers, 'L')
  replace(doc.assets, 'A')
})()

// ---------------------------------------------------------------- verify

const outProps = []
walk(doc.layers, 'L', (path, keys) => outProps.push({ path, keys }))
walk(doc.assets, 'A', (path, keys) => outProps.push({ path, keys }))

let failures = 0
for (const p of outProps) {
  const a = valAt(p.keys, LOOP_START)
  const b = valAt(p.keys, LOOP_END)
  let d = Math.abs(b - a)
  if (isRot(p.path)) d = Math.min(d % 360, 360 - (d % 360))
  const tol = isRot(p.path)
    ? SEAM_TOL_ROT
    : isPos(p.path)
      ? SEAM_TOL_POS
      : SEAM_TOL_OTHER
  if (d > tol) {
    failures++
    console.error(`  SEAM FAIL ${p.path}: Δ=${d.toFixed(3)} (tol ${tol})`)
  }
}

for (const { path, keys } of outProps) {
  for (let i = 1; i < keys.length; i++) {
    if (keys[i].t < keys[i - 1].t) {
      failures++
      console.error(`  TIME ORDER FAIL ${path}: ${keys[i - 1].t} → ${keys[i].t}`)
    }
  }
}

if (failures) {
  console.error(`\n${failures} verification failures — not writing output`)
  process.exit(1)
}
console.log(`seam OK: all ${outProps.length} keyframe properties continuous at ${LOOP_START}↔${LOOP_END}`)

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, JSON.stringify(doc))
console.log(`wrote ${OUTPUT}`)
