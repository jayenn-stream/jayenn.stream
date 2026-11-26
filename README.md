# jayenn.stream

Streams of thought, published as a quiet, one-post-per-screen site. Plain Markdown in, plain HTML out, built with [Eleventy](https://www.11ty.dev/).

## The short version

**To publish a post:** add a Markdown file to `src/posts/`, save it to GitHub, done. The site rebuilds itself and the post appears at the top of the feed, in Subjects, in search, in the RSS feed, with its own link-preview image.

**To edit a post:** change the file and give it today's `date`. It moves back to the top.

**To remove a post:** delete the file, or add `draft: true` to keep it but hide it.

## The folders

```
jayenn-site/
├── src/                     ← everything the site is made from
│   ├── posts/               ← YOUR WRITING. One file per post (or one folder for a designed post)
│   │   ├── 2026-11-16-here.md          the Here? post (motto + what the site is)
│   │   ├── 2026-12-01-on-time.md       a plain post
│   │   ├── 2026-12-09-tide-pool/       a designed post: its own folder
│   │   │   ├── index.md                    the writing and header
│   │   │   ├── style.css                   its own look
│   │   │   └── scene.js                    its own effects
│   │   └── posts.11tydata.js           settings shared by all posts (leave alone)
│   ├── _data/
│   │   ├── palettes.json    ← named colour sets posts can use (add your own here)
│   │   └── site.json        ← site name, address, description
│   ├── _includes/           ← page templates (the frame)
│   │   ├── base.njk             every page: head, SEO, fonts, bottom bar
│   │   ├── row.njk              one screen in the feed + the swiped-in post
│   │   ├── post.njk             a post's own page
│   │   └── footer.njk           the end of a post: tags, date, share
│   ├── assets/
│   │   ├── site.css         ← the whole look of the frame
│   │   ├── site.js          ← small extras: swipe lock, hiding bar, keys, search
│   │   └── icons/           ← j.s icons
│   ├── index.njk            the feed (home)
│   ├── subjects.njk         the Subjects page: search, Subjects / Titles
│   ├── subject.njk          one feed per subject
│   ├── 404.njk              "No words here."
│   └── feed.njk, sitemap.njk, robots.njk, webmanifest.njk   made automatically
├── lib/
│   ├── jayenn.js            shared rules: settings, headings, fonts
│   ├── fonts.js             self-hosted fonts: copies files, writes assets/fonts.css
│   └── og.js                makes the link-preview images
├── eleventy.config.js       the build: collects posts, makes subjects, checks contrast
├── AGENTS.md                instructions for any AI working on the site
└── _site/                   the finished website (made by the build; never edit)
```

You'll mostly only ever touch **`src/posts/`**, and occasionally **`src/_data/palettes.json`**.

## Writing a post

Name the file `YYYY-MM-DD-a-few-words.md`. The words after the date become its address: `jayenn.stream/posts/a-few-words/`.

```markdown
---
date: 2026-12-01
main: [time]
secondary: [attention, running, an island analogy]
font: Jost
colours: slate
---
The writing starts here.     A five-space gap before an undecided next thought.
```

| Field | What it does | Needed? |
|---|---|---|
| `date` | When the thought took this form. Decides its place in the feed (newest first). | Yes |
| `main` | Broad subjects. Each one gets a place in Subjects. | Yes (at least one) |
| `secondary` | Finer threads. Shown faintly at the end of the post; searchable. | Optional |
| `title` | A heading. Without one, the heading is the tag line: "On time, attention, running…" | Optional |
| `font` | Any installed font (see "A font" below). Blank = picked for you. | Optional |
| `colours` | A palette name from `palettes.json`, or your own (see below). Blank = picked for you. | Optional |
| `excerpt` | The words shown on the feed screen. Blank = the post's first lines. | Optional |
| `draft: true` | Keeps the post off the site. | Optional |

**Your own colours** instead of a palette name:

```yaml
colours: { bg: "#20252b", fg: "#f2efe8", muted: "#a8b0b8", accent: "#d9b77e" }
```

The build warns you if any text would be too faint to read.

**The two conventions** are handled for you: five spaces between words become a visible gap, and five dots (`.....`) are left exactly as written.

**Tags:** keep them lowercase and singular ("habit", not "Habits"). The build warns about near-duplicates like "run" / "running".

## A designed post (scrollytelling or custom)

Make a folder instead of a file: `src/posts/2026-12-09-tide-pool/` with an `index.md` (same header as above) plus any `style.css`, `scene.js`, images. The frame (bar, swipe, footer) wraps it automatically, and its files only load on that post. Ask an AI to design it inside that folder; it should read `AGENTS.md` first.

## Adding to the pool

- **A palette:** add an entry to `src/_data/palettes.json` with `bg`, `fg`, `muted`, `accent`. Use it in any post with `colours: yourname`.
- **A font:** fonts are served from the site itself (nothing is fetched from Google). To add one, install it once with `npm i @fontsource/font-name` (e.g. `@fontsource/lora`), commit the updated `package.json` and `package-lock.json`, then name it in a post. The build warns if a post names a font that isn't installed.

## Running it on your own computer (optional)

```bash
npm install        # once
npm run serve      # live preview at http://localhost:8080
npm run build      # makes the finished site in _site/
```

## Publishing

Saving to the `main` branch on GitHub triggers a build and publishes to jayenn.stream (GitHub Pages). Nothing else to do.
