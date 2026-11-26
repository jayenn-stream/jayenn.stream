# jayenn.stream

Streams of thought, published as a quiet, one-post-per-screen site. Plain Markdown in, plain HTML out, built with [Eleventy](https://www.11ty.dev/).

## The short version

**To publish a post:** follow `POSTING.md`. In short: add a Markdown file to `src/posts/`, save it to GitHub, done. The site rebuilds itself and the post appears at the top of the feed, in Subjects, in search, in the RSS feed, with its own link-preview image.

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
| `main` | Broad subjects, one to three. Each one gets a place in Subjects. | Yes (at least one) |
| `secondary` | Finer threads, as many as help searching. Shown faintly at the end of the post; searchable. | Optional |
| `title` | The heading: what you regard as the post's ultimate points. Write one, or several separated by commas. Without one, the heading falls back to the tag line ("On time, attention, running…"). | Recommended |
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

## Formatting inside a post

Plain Markdown works: `*italic*`, `**bold**`, `[link text](https://address)`, a blank line for a new paragraph, `> ` at the start of a line for a quotation, `- ` for a list, `## ` for a heading. To break a line inside a paragraph, end the line with two spaces or a backslash. Most posts need none of it. Italics are a slanted version of the post's own font, not a true italic face.

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

## Posting with an AI

See **POSTING.md** for the whole day-to-day workflow (prompt, file, publish, check, edit). The AI writes only the header; you paste your own words under it, so nothing of the AI's goes into your text.

**Invisible characters.** The build checks every post for zero-width marks, no-break spaces and similar. If it finds any, the build log shows a line starting `[jayenn] src/posts/…` with the file, the line number and the character codes. (On GitHub: **Actions** tab → the latest run → **build** → the **Run npm run build** step.) It only warns; it never edits your words. To fix a flagged line, retype it, or paste it as plain text.

## Working with an AI chatbot

Give the chatbot this briefing, then the few files the job touches (see below). Always ask for complete replacement files and only the ones that change.

> You're helping me edit my personal static website, jayenn.stream, built with Eleventy and hosted on GitHub Pages. Read `AGENTS.md`, `README.md` and `docs/design.md` first (pasted below, or at github.com/jayenn-stream/jayenn.stream). They explain the rules and the decisions already made; don't undo them. Describe the change and ask before building anything large. Then give me complete replacement files, only the ones that change, with paths. Don't add dependencies or change the build. Keep text contrast at WCAG AA and keep the site working without JavaScript. I'll upload the files on GitHub and check the build.

Which files to give it:

| Change | Files |
|---|---|
| Looks (colours, spacing, type) | `src/assets/site.css` |
| Behaviour (swipe, bar, search) | `src/assets/site.js`, `src/assets/site.css` |
| Layout of a page | `src/_includes/*.njk`, the page's `src/*.njk`, `src/assets/site.css` |
| A post | the post's `.md` file |

After uploading, check the Actions tab for a green tick, then force-refresh your phone: browsers cache CSS for a few minutes. To undo a change, open the commit in the repo's History and revert it.

## Publishing

Saving to the `main` branch on GitHub triggers a build and publishes to jayenn.stream (GitHub Pages). Nothing else to do.
