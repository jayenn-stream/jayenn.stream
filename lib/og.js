// Link preview images: one 1200×630 PNG per post, in the post's own font and colours.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const pkg = (family) => family.toLowerCase().replace(/ /g, "-");
async function fontData(family, weight) {
  const f = `node_modules/@fontsource/${pkg(family)}/files/${pkg(family)}-latin-${weight}-normal.woff`;
  return existsSync(f) ? readFile(f) : null; // fonts not installed fall back to Inter
}

export async function makeOgImages(items, outDir) {
  await mkdir(outDir, { recursive: true });
  const inter = await fontData("Inter", 600);
  for (const { slug, text, font, bg, fg } of items) {
    const data = (await fontData(font, 400)) || (await fontData("Inter", 400));
    const family = (await fontData(font, 400)) ? font : "Inter";
    const lines = text.split("\n");
    const size = text.length > 70 ? 54 : 66;
    const svg = await satori(
      { type: "div", props: { style: { width: 1200, height: 630, display: "flex", alignItems: "center", justifyContent: "flex-start", background: bg, color: fg, position: "relative", padding: "0 160px 0 64px" },
        children: [
          { type: "div", props: { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", fontFamily: family, fontSize: size, lineHeight: 1.18 }, children: lines.map((l) => ({ type: "div", props: { children: l } })) } },
          { type: "div", props: { style: { position: "absolute", left: 64, bottom: 52, fontFamily: "Inter", fontWeight: 600, fontSize: 26, letterSpacing: "-0.03em", opacity: 0.7 }, children: "j.s" } },
        ] } },
      { width: 1200, height: 630, fonts: [{ name: family, data, weight: 400, style: "normal" }, { name: "Inter", data: inter, weight: 600, style: "normal" }] }
    );
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
    await writeFile(`${outDir}/${slug}.png`, png);
  }
}
