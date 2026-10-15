#!/usr/bin/env node
// Turn "this hue means this system" into the ink variables the kit draws from.
//
//   import { rampCss, INK_VARS } from "./scripts/ink-ramp.mjs";
//   const css = rampCss([
//     ["vehicle", 40, 0.5],     // id, hue, tint strength
//     ["mount", 214, 1],
//   ], { theme: "dark", prefix: ".rq-stage", attr: "data-group" });
//
// One rule per group, redefining the twelve --anatomy-* steps inside that
// group's wrapper. Nothing is painted over: the four-tone shading, the line
// weight and the hidden-line dashes all survive, because every step keeps its
// own lightness and only takes a hue. `gain` scales the whole ramp's saturation,
// which is how the subject stays near-neutral and the ground stays concrete.
export const INK_VARS = ["shade-0", "shade-1", "shade-2", "shade-3", "top", "lit-top", "lit-shade", "hi", "mid", "lo", "faint", "lit"];

// lightness and saturation per ink step, in the order of INK_VARS
const RAMP = {
  dark: {
    l: [9, 11, 13, 15, 12, 17, 13, 82, 50, 30, 16, 93],
    s: [26, 24, 22, 20, 18, 16, 18, 16, 18, 20, 13, 22],
  },
  light: {
    l: [88, 91, 84, 94, 96, 99, 92, 30, 46, 60, 78, 14],
    s: [22, 19, 24, 14, 12, 8, 16, 38, 32, 24, 14, 40],
  },
};

/**
 * @param {[id: string, hue: number, gain?: number][]} groups
 * @param {{ theme?: "dark"|"light", prefix?: string, attr?: string, saturation?: number }} options
 * @returns {string} CSS to append to the page's own stylesheet
 */
export function rampCss(groups, { theme = "dark", prefix = "", attr = "data-group", saturation = 1 } = {}) {
  const { l, s } = RAMP[theme] ?? RAMP.dark;
  const wrap = (id) => (prefix ? `${prefix} ` : "") + `[${attr}="${id}"]`;
  return groups
    .map(([id, hue, gain = 1]) => {
      const body = INK_VARS.map(
        (name, i) => `--anatomy-${name}:hsl(${hue} ${Math.min(60, Math.round(s[i] * gain * saturation))}% ${l[i]}%)`,
      ).join(";");
      return `${wrap(id)}{${body}}`;
    })
    .join("\n");
}

/** The same colour as one flat chip, for a legend that must match the drawing. */
export function chipColor(hue, gain = 1, lightness = 54, saturation = 34) {
  return `hsl(${hue} ${Math.round(saturation * gain)}% ${lightness}%)`;
}

if (process.argv[1] && process.argv[1].endsWith("ink-ramp.mjs")) {
  const theme = process.argv.includes("--light") ? "light" : "dark";
  const groups = process.argv.slice(2).filter((a) => !a.startsWith("--")).map((a) => {
    const [id, hue, gain] = a.split(":");
    return [id, Number(hue), gain === undefined ? 1 : Number(gain)];
  });
  console.log(rampCss(groups, { theme }));
}
