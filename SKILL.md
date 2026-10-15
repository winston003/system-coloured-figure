---
name: system-coloured-figure
description: Make a technical isometric figure readable by someone who is not an engineer. Use when a diagram has to explain a system to a general audience, a student or a child, or when the user says 给小孩看 / 让普通人看懂 / 用大白话讲 / 每个部件上不同颜色 / 加上分阶段解说. Covers colour-coding parts by the system they belong to without breaking the four-tone shading, a beat-by-beat narration layer with a progress rail, and the translation of engineering jargon into plain words with numbers you can picture. Pairs with the anatomy skill, which draws and audits the figure itself.
license: MIT
compatibility: Node.js 20.10+. Produces plain CSS and text; no framework.
metadata:
  opencode/slash: "true"
---

# System-coloured figure

An engineering drawing answers "what is this made of". A figure for a non-expert has to answer three more questions: **which parts belong together, what is happening right now, and why is it like this.** Those are three separate moves. The drawing stays monochrome-expert; only these three layers are new.

Use it after the figure itself is drawn and `node build.mjs --audit` passes. It never touches geometry — colour and copy only, so it cannot break the audit.

## 1. Colour by system, not by part

Pick the systems a viewer could name out loud — the vehicle, the structure that holds it, the arm that disconnects, the water, the tank, the operator's console, the safety masts, the ground. One hue each. Then map name → system at build time and emit one attribute per item:

```js
const GROUPS = [
  [/^vehicle\./, "vehicle", "火箭"],
  [/^(umb\.|stand\.(armboss|terminalarm|mastdeck|mastfoot))/, "umb", "脐带臂"],
  [/^stand\.(deluge|ringboss|nozzle|stanchion)/, "water", "消火水"],
];
const groupOf = (name) => (GROUPS.find(([re]) => re.test(name)) ?? [null, "pad"])[1];
// <g class="it" data-group="${groupOf(item.name)}"> … </g>
```

Key on the *name prefix*, not the piece: one tower and one arm are the same system and must share a hue.

Then generate the ramp instead of painting anything (`scripts/ink-ramp.mjs`):

```js
const css = rampCss([
  ["vehicle", 40, 0.5],   // hue, tint strength
  ["mount", 214, 1],
  ["umb", 152, 1],
  ["water", 186, 1.05],
  ["pad", 220, 0.2],
], { theme: THEME, prefix: ".rq-stage" });
```

This emits one rule per system redefining the twelve `--anatomy-*` ink steps. The four-tone shading and the line weight survive because every step keeps its lightness and only takes a hue — **painting fills per part would destroy both.**

Rules that make the palette read:

- **The subject stays near-neutral and brightest** (`gain` ≈ 0.5). It is the thing being explained; colour would compete with it.
- **The ground stays grey** (`gain` ≈ 0.2). A coloured floor makes everything on it look like a system.
- **Spread hues by 40° or more.** Two systems at 186° and 208° are one system as far as a reader is concerned. Tank 250, console 8, lightning 300 works; two blues do not.
- **The legend chip is the same hue at the same strength** (`chipColor(hue, gain)`), so the legend cannot drift from the drawing.

## 2. Narrate in beats

A readout line is data ("T+0.5 · 111 kN free, 4.9 kN off the clamps"). Data is not an explanation. Put one beat under the figure, and change it when the phase changes:

```js
export const PHASES = [
  { at: -Infinity, short: "倒计时", what: "…what is moving now…", why: "…why it is that way…" },
  { at: PAD.delugeAt, short: "注水", what: "…", why: "…" },
];
export function phaseAt(t) { let i = 0; for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k].at) i = k; return i; }
```

The layer itself is three elements and one attribute, and no per-frame work:

```html
<div class="rq-notes" data-now="3">
  <div class="rq-steps" aria-hidden="true"><i></i>×6</div>
  <p class="rq-step"><span data-step>3 / 6 · 注水</span></p>
  <p class="rq-what" data-what aria-live="polite">…</p>
  <p class="rq-why" data-why>…</p>
</div>
```

```css
.rq-notes[data-now="3"] .rq-steps i:nth-child(-n + 3) { background: var(--anatomy-lit); }
```

```js
function announce(t) {
  const i = phaseAt(t);
  if (i === announced) return;                 // write once per beat, not per frame
  const beat = PHASES[i];
  what.textContent = beat.what;
  why.textContent = beat.why;
  step.textContent = `${i + 1} / ${PHASES.length} · ${beat.short}`;
  notes.setAttribute("data-now", String(i + 1));
}
```

Keep `what` under about ten words and `why` under about thirty. Give the `why` line a `min-height` of two lines so the layer does not jump as the text changes. `aria-live="polite"` on the `what` line means a screen reader follows the story too — there is no separate live region to maintain.

## 3. Translate the jargon, keep the numbers

The payload of a technical figure is its numbers. Strip the terms, keep every number, and attach each one to something a reader can picture.

| Instead of | Write |
|---|---|
| thrust-to-weight of 9.4 | 推力是它自身重量的 9.4 倍 |
| hold-down clamps | 抱箍（只压住它自己的重量） |
| umbilical disconnect | 最后一件挂在火箭上的东西，只沿一条直线退出 |
| structural load path into the legs | 111 kN 全部压进四条支腿 |
| ignition transient, 90 ms rise | 点火器点着，约 90 毫秒推力就满 |
| deluge system | 先把沟槽和槽壁浇透，火焰到的时候没有干的地方可烧 |
| 1,197 kg at ignition | 1,197 公斤，差不多一辆小车 |
| 83 m/s² | 三分之一秒就过 100 km/h |

The test: **could a twelve-year-old read the line and picture it?** If a number has nothing to picture, give it one or cut it. If a sentence has no number, ask what it is for.

## What this skill does not do

- It does not make the drawing prettier. `anatomy` owns that, and its audit owns correctness.
- It does not colour the ground or the subject.
- It does not add a second caption. The static caption below the figure is rewritten in plain words instead; the beats are for what is *changing*, the caption is for the whole object.

## Files

- `scripts/ink-ramp.mjs` — hue → the kit's twelve ink variables. Run it directly to print CSS: `node scripts/ink-ramp.mjs vehicle:40:0.5 mount:214:1 --light`.
- `references/narration.md` — a worked beat table, the copy rules in full, and the accessibility notes.
