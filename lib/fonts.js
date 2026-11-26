// Self-hosted fonts: no request ever goes to Google. Every @fontsource package installed in
// node_modules becomes part of the site (Latin letters, weights 300/400/500).
import { readdir, mkdir, copyFile, writeFile, readFile } from "node:fs/promises";

export const pkgOf = (family) => family.toLowerCase().replace(/ /g, "-");
const WEIGHTS = [300, 400, 500];
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

// Each installed package and the family name its own CSS declares (e.g. "Hanken Grotesk").
export async function installedFonts() {
  const dirs = await readdir("node_modules/@fontsource").catch(() => []);
  return Promise.all(dirs.map(async (dir) => {
    const css = await readFile(`node_modules/@fontsource/${dir}/index.css`, "utf8");
    return { dir, family: css.match(/font-family:\s*['"]?([^;'"]+)/)?.[1].trim() ?? dir };
  }));
}

// Copy the font files into the site and write assets/fonts.css.
export async function writeFonts(outDir) {
  const fonts = await installedFonts();
  await mkdir(`${outDir}/assets/fonts`, { recursive: true });
  let css = "/* Generated at build time. */\n";
  for (const { dir, family } of fonts) for (const w of WEIGHTS) {
    const file = `${dir}-latin-${w}-normal.woff2`;
    await copyFile(`node_modules/@fontsource/${dir}/files/${file}`, `${outDir}/assets/fonts/${file}`);
    css += `@font-face{font-family:"${family}";font-style:normal;font-weight:${w};font-display:swap;src:url(fonts/${file}) format("woff2");unicode-range:${LATIN}}\n`;
  }
  await writeFile(`${outDir}/assets/fonts.css`, css);
  return fonts.map((f) => f.family);
}
