// Settings shared by every post in this folder.
import { postSlug, tagLine, fontFamilies, fontLinks } from "../../lib/jayenn.js";

export default {
  layout: "post.njk",
  permalink: (d) => `/posts/${postSlug(d.page.fileSlug)}/`,
  eleventyComputed: {
    heading: (d) => tagLine(d),
    fonts: (d) => fontLinks(fontFamilies([d])),
    jsonld: (d) => JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: tagLine(d), datePublished: d.page.date, author: { "@type": "Person", name: "Jayenn" }, url: "https://jayenn.stream" + d.page.url }),
  },
};
