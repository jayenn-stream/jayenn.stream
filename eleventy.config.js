// Jayenn site build. Kept thin on purpose: collect posts, make subject pages, a few filters.
// The site's look lives in src/assets; posts live in src/posts. See README.md.
import { readFile } from "node:fs/promises";
import { makeOgImages } from "./lib/og.js";
import { writeFonts } from "./lib/fonts.js";
import { slugify, postSlug, tagLine, settingFor, fontFamilies, fontLinks } from "./lib/jayenn.js";

const PREVIEW = process.env.PREVIEW === "1"; // private preview links need relative URLs
const POSTS = ["src/posts/*.md", "src/posts/*/index.md"];
const byDateDesc = (a, b) => b.date - a.date;
let builtPosts = [];

export default function (eleventyConfig) {
  // Files copied as they are.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/icons/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy("src/CNAME"); // tells GitHub Pages the domain
  eleventyConfig.addPassthroughCopy("src/posts/*/**/*.{css,js,png,jpg,webp,svg,woff2}"); // designed posts' own files

  // Five spaces (or more) between words = an undecided gap between thoughts.
  eleventyConfig.addPreprocessor("gaps", "md", (data, content) =>
    content.replace(/(?<=\S) {5,}(?=\S)/g, '<span class="gap"> </span>'));

  // All published posts, newest first. "draft: true" keeps a post out.
  eleventyConfig.addCollection("posts", (api) =>
    (builtPosts = api.getFilteredByGlob(POSTS).filter((p) => !p.data.draft).sort(byDateDesc)));

  // Main tags become subjects, each with its posts newest first.
  eleventyConfig.addCollection("subjects", (api) => {
    const map = new Map();
    for (const p of api.getFilteredByGlob(POSTS).filter((p) => !p.data.draft))
      for (const t of p.data.main || []) map.set(t, [...(map.get(t) || []), p]);
    const names = [...map.keys()].sort();
    for (const a of names) for (const b of names)
      if (a < b && b.startsWith(a) && b.length - a.length <= 3)
        console.warn(`[jayenn] near-duplicate subjects: "${a}" / "${b}"`);
    return names.map((name) => ({ name, slug: slugify(name), posts: map.get(name).sort(byDateDesc) }));
  });

  // Filters used in templates.
  eleventyConfig.addFilter("slug", slugify);
  eleventyConfig.addFilter("tagLine", tagLine);
  eleventyConfig.addFilter("setting", settingFor);
  eleventyConfig.addFilter("fontLinks", (posts) => fontLinks(fontFamilies(posts.map((p) => p.data))));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("shortDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
  // Words a date can be searched by: "16 nov 2026", "november 2026", "2026"…
  eleventyConfig.addFilter("dateWords", (d) => {
    const f = (o) => new Date(d).toLocaleDateString("en-GB", { timeZone: "UTC", ...o }).toLowerCase();
    const [day, mon, month, yr] = [f({ day: "numeric" }), f({ month: "short" }), f({ month: "long" }), f({ year: "numeric" })];
    return `${day} ${mon} ${yr} ${day} ${month} ${yr} ${mon} ${month} ${yr}`;
  });
  // Feed excerpt: the post's own "excerpt", or its first ~200 characters (gaps kept).
  eleventyConfig.addFilter("excerpt", (html, own) => {
    if (own) return own;
    const gap = '<span class="gap"> </span>', mark = "⁣";
    const text = String(html).replaceAll(gap, mark).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const cut = text.length > 200 ? text.slice(0, 200).replace(/\s\S*$/, "") + "…" : text;
    return cut.replaceAll(mark, gap);
  });

  // Before each build: every palette's text must be readable (WCAG AA contrast, 4.5:1).
  eleventyConfig.on("eleventy.before", async () => {
    const pals = JSON.parse(await readFile("src/_data/palettes.json", "utf8"));
    const lum = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    for (const [name, p] of Object.entries(pals)) for (const k of ["fg", "muted", "accent"])
      if (ratio(p[k], p.bg) < 4.5) console.warn(`[jayenn] palette "${name}": ${k} is too faint (${ratio(p[k], p.bg).toFixed(2)}:1, needs 4.5)`);
  });

  // After each build: a link preview image for every post, plus one for the site.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const have = await writeFonts(dir.output); // self-hosted fonts → assets/fonts + fonts.css
    for (const p of builtPosts) {
      const f = settingFor(p.data, p.data.palettes).font;
      if (!have.includes(f)) console.warn(`[jayenn] ${p.page.fileSlug}: font "${f}" isn't installed, so it falls back to the frame font.`);
    }
    const items = builtPosts.map((p) => {
      const s = settingFor(p.data, p.data.palettes);
      const text = p.data.cardQuote ? p.data.cardQuote.replace(/<br\s*\/?>/g, "\n") : tagLine(p.data);
      return { slug: postSlug(p.page.fileSlug), text, font: p.data.cardQuote ? "Jost" : s.font, bg: s.bg, fg: s.fg };
    });
    items.push({ slug: "site", text: "Streams of thought\nFor a belief I ought.", font: "Jost", bg: "#1b1d1f", fg: "#eae8e3" });
    await makeOgImages(items, `${dir.output}/og`);
  });

  // Preview builds only: relative links, so the site works inside a private preview link.
  if (PREVIEW) eleventyConfig.addTransform("relative", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const up = "../".repeat(this.page.url.split("/").filter(Boolean).length - (this.page.url.endsWith("/") ? 0 : 1));
    return content.replace(/(href|src)="\/(?!\/)([^"#]*)(#[^"]*)?"/g, (m, attr, path, hash = "") =>
      `${attr}="${up}${path === "" || path.endsWith("/") ? path + "index.html" : path}${hash}"`);
  });

  return { dir: { input: "src", output: "_site" }, markdownTemplateEngine: "njk", htmlTemplateEngine: "njk" };
}
