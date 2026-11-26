// Shared helpers used by the build config, the post data file and the link-image generator.

// Fonts used when a post doesn't name one. Any font from Google Fonts can be named in a post.
export const FONTS = ["Jost", "Inter", "Hanken Grotesk", "Fraunces", "Manrope", "Figtree"];

export const slugify = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-");

// A post's address: its file name without the date, e.g. 2026-11-16-on-time.md → on-time
export const postSlug = (fileSlug) => fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");

// A steady number from the file name, so a post left blank always gets the same setting.
const seedOf = (fileSlug = "") => [...fileSlug].reduce((s, c) => s + c.charCodeAt(0), 0);

// The post's heading: its title, or "On" + its tags in the order written.
export const tagLine = (d) => d.title || "On " + [...(d.main || []), ...(d.secondary || [])].join(", ");

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
export const fontLinks = (families) => families
  .map((f) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}:wght@300;400;500&display=swap">`)
  .join("\n");
