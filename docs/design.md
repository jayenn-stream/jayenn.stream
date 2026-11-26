# jayenn.stream: design decisions

The reasons behind the site. Read this before changing how anything looks or behaves, so decided things aren't undone. Last updated 2026-11-26.

## What it is

A personal, single-author site of philosophical "streams of thought", published at jayenn.stream. Quiet, spacious, words first. Visitors read; they don't post, comment, or sign in (an email signup for new posts is planned). The site is fully static: Markdown posts built by Eleventy, hosted on GitHub Pages, with the domain and email forwarding on Cloudflare.

The tone is objective, not "my opinions": the author's name stays out of the navigation.

## The feed (the centre of the site)

- Homepage. Newest post first. One post per screen; scrolling snaps to the next.
- Text is always centred on the screen. Each post has its own font and palette (from `src/_data/palettes.json` and the font list in `lib/jayenn.js`), and every palette must pass WCAG AA contrast.
- No dates and no tags on feed screens. A small → shows that the post can be opened.
- From a feed screen, swiping left (or tapping, or the → key) opens the full post sideways, in the same setting. Scrolling inside a post never moves on to the next post: go back out to the feed first.
- Back out with a swipe right, Escape, the ← key, or the ← at the very end of the post (centred, after the tags and date). It was tried fixed at the top and rejected as too present.

## Navigation

- Phone and tablet: a bottom bar of words only: Subjects · Posts · Here? No icons. It slides away when scrolling down and returns on scroll up, tap, or pause. Desktop (900px and wider): the same three words as a slim list on the left.
- Posts is home. Tapping it returns you to the post you were on; tapping again goes to the newest.
- Here? jumps to the Here? post (`/#here`), the orienting post with the motto "Streams of thought / For a belief I ought.". On that post the Here? tab is lit and Posts goes quiet.
- No separate About page: everything comes through the feed.

## Subjects page

- Inter, ivory by day, dark slate in dark mode, no dividing lines.
- A search box at the top matches titles first, then dates, then tags.
- Two tabs: Subjects (alphabetical, with counts) and Titles (every post, newest first). A subject opens to its titles, then the post, opened within that subject's feed.
- Dates are secondary and hidden by default; a faint "dates" control shows them, with newest/oldest first beside it.

## Tags

- `main` tags are the subjects: each becomes a subject stream. A post can have several. Lowercase, singular.
- `secondary` tags are finer threads and search terms, not subjects.
- Tapping a main tag opens Subjects at that subject; tapping a secondary tag searches for it.
- The build warns about near-duplicate subjects.

## A post

- Heading: the `title`, which the author writes to name what they regard as the post's ultimate points (one, or several separated by semicolons, shown as centre dots, so commas stay free to use; free text, left-aligned, wrapping onto more lines if long). Without a `title`, the heading falls back to "On " plus its tags. Titles are not animated or scrolled: a drifting line was considered and rejected as irritating. A list form (`title: [a, b, c]`, with the post listed under each title in the Titles tab) is possible later if wanted.
- Tags are separate from the heading: keep `main` to one to three subjects (they are navigation) and be liberal with `secondary` (search).
- The end of every post: one line of tags (main in the accent colour, secondary fainter), then the date with a share icon (share sheet, or copy the link).
- Dates are secondary. If an old post is substantially edited, it gets a new date; old posts aren't casually edited.
- Five spaces between words become an undecided gap (`.gap`). Five dots are left as they are. These are the author's conventions: never "fix" them.

## Look and feel rules

- Calm: no flashing, no heavy motion. Respect `prefers-reduced-motion`. No blue tap flash; adjacent tappable boxes must not distort.
- The site works without JavaScript; JavaScript only adds the bar behaviour, swipe/keys, search and sharing.
- Fonts are self-hosted (no requests to Google). Plain HTML, CSS and a little JavaScript; no frameworks.
- Icon: "j.s" in Inter semibold, light on dark slate. Link-preview images are generated per post at build: title left-aligned in the post's own font and colours, small "j.s" bottom-left. Not-found page: "No words here." with "← Posts".

## Planned, not built

- Email signup for new posts through a newsletter service reading the RSS feed.
- A scrollytelling template and a first scrollytelling post.
- A larger pool of fonts and palettes.
