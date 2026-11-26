// Shared helpers used by the build config, the post data file and the link-image generator.

// Fonts used when a post doesn't name one. A post can name any installed font (see README: Adding a font).
export const FONTS = ["Jost", "Inter", "Hanken Grotesk", "Fraunces", "Manrope", "Figtree"];

export const slugify = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-");

// A post's address: its file name without the date, e.g. 2026-11-16-on-time.md → on-time
export const postSlug = (fileSlug) => fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");

// A steady number from the file name, so a post left blank always gets the same setting.
const seedOf = (fileSlug = "") => [...fileSlug].reduce((s, c) => s + c.charCodeAt(0), 0);

// The post's heading: its title, or "On" + its tags in the order written.
const dotted = (t) => String(t).split(";").map((x) => x.trim()).filter(Boolean).join(" · ");
export const tagLine = (d) => (d.title ? dotted(d.title) : "On " + [...(d.main || []), ...(d.secondary || [])].join(", "));

// The post's setting: colours (a named palette or explicit values) and font. Blank = picked for you.
export function settingFor(d, palettes) {
  const seed = seedOf(d.page?.fileSlug);
  const names = Object.keys(palettes);
  const colours = typeof d.colours === "object" ? d.colours : palettes[d.colours] || palettes[names[seed % names.length]];
  return { ...colours, font: d.font || FONTS[seed % FONTS.length] };
}

// The fonts a page needs: the frame font, each post's font, and Jost for the motto.
export function fontFamilies(datas) {
  const fams = new Set(["Inter"]);
  for (const d of datas) {
    fams.add(d.font || FONTS[seedOf(d.page?.fileSlug) % FONTS.length]);
    if (d.cardQuote) fams.add("Jost");
  }
  return [...fams];
}
// Preload the first couple of fonts a page uses so text appears in the right face straight away.
export const fontLinks = (families) => families.slice(0, 2)
  .map((f) => `<link rel="preload" href="/assets/fonts/${f.toLowerCase().replace(/ /g, "-")}-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>`)
  .join("\n");

// Feed card + continuation: split a post's HTML at the end of a sentence near ~240 characters, so the card shows
// the opening and the swiped-to screen carries on from there, repeating nothing. Returns { lede, rest }, or null
// when the post should open whole as before (own excerpt, or anything beyond plain paragraphs and inline marks).
const SOFT = 240, HARD = 380, OK_TAGS = new Set(["p", "em", "strong", "i", "b", "a", "span", "br"]);
export function splitPost(html, own) {
  if (own) return null;
  html = String(html).trim();
  const toks = html.split(/(<[^>]+>)/).filter((t) => t !== "");
  for (const t of toks) {
    const m = t.match(/^<\/?([a-z0-9]+)/i);
    if (m && !OK_TAGS.has(m[1].toLowerCase())) return null;
    if (m && m[1].toLowerCase() === "span" && !/^<\/span>$/.test(t) && !/class="gap"/.test(t)) return null;
  }
  const cands = [];
  let idx = 0, v = 0, inGap = false;
  toks.forEach((t, i) => {
    if (t[0] === "<") {
      if (/^<span class="gap">$/.test(t)) { inGap = true; v += 1; }
      else if (t === "</span>") inGap = false;
      else if (t === "</p>") cands.push({ pos: idx, v });
    } else if (!inGap) {
      const re = /[.?!]+["'”’)\]]*/g;
      let m;
      while ((m = re.exec(t))) {
        const end = m.index + m[0].length, after = t.slice(end), next = toks[i + 1] || "";
        if (after === "" ? (next === "</p>" || /^<span class="gap">$/.test(next)) : /^\s/.test(after))
          cands.push({ pos: idx + end, v: v + end });
      }
      v += t.length;
    }
    idx += t.length;
  });
  // The tokens were filtered of empties, so recompute positions against the original string to be safe.
  if (toks.join("") !== html) return null;
  const pick = [...cands].reverse().find((c) => c.v <= SOFT) || cands.find((c) => c.v <= HARD);
  if (!pick) return null;
  const head = html.slice(0, pick.pos), stack = [];
  for (const t of head.split(/(<[^>]+>)/)) {
    const o = t.match(/^<([a-z0-9]+)(\s[^>]*)?>$/i), c = t.match(/^<\/([a-z0-9]+)>$/i);
    if (o && o[1].toLowerCase() !== "br") stack.push({ name: o[1].toLowerCase(), tag: t });
    else if (c) stack.pop();
  }
  const lede = head + stack.map((s) => `</${s.name}>`).reverse().join("");
  let rest = stack.map((s) => s.tag).join("") + html.slice(pick.pos);
  const lead = /^((?:<(?!\/)[^>]*>)*)(?:\s+|<span class="gap">[^<]*<\/span>)+/;
  for (let n = 0; n < 3; n++) rest = rest.replace(lead, "$1").replace(/^(?:<p[^>]*>\s*<\/p>\s*)+/, "");
  return { lede, rest: rest.trim() };
}
