# Instructions for AI assistants working on jayenn.stream

Read README.md first. It explains the folders, the post header and how publishing works. Then read `docs/design.md`: the decisions already made and why, so don't undo them.

## The site in one paragraph

A personal site of philosophical streams of thought by "Jayenn". Spacious, quiet, words first. The feed shows one post per screen, snapping as you scroll; swiping left (or tapping, or →) shows the rest of the post sideways, carrying on from the card without repeating it. A post's own address shows the same thing. Every post has its own font and colours. A bottom bar (a slim left list on desktop) reads Subjects · Posts · Here?. The tone is objective, not personal: keep the author's name out of navigation.

## Rules

1. **Most work is adding or editing files in `src/posts/`.** Don't change the frame (`src/_includes`, `src/assets`, `eleventy.config.js`, `lib/`) unless asked.
2. **Never rewrite the author's words.** Fix only obvious typos, and only when asked. Keep five-space gaps (`     `) and five dots (`.....`) exactly.
3. **Post headers follow README.md.** `date`, `main` (lowercase, singular), optional `secondary`, `title`, `font`, `colours`, `excerpt`, `draft`.
4. **Designed posts live in their own folder** (`src/posts/YYYY-MM-DD-name/`), with their CSS and JS kept there. Plain HTML, CSS and JavaScript only: no frameworks, no build steps, no video. Animate with transforms and opacity. The full text must stay readable without JavaScript, and motion must stop for `prefers-reduced-motion`.
5. **Readability is the one hard rule.** Text must meet WCAG AA contrast (4.5:1). The build warns when a palette fails; fix it rather than ignore it.
6. **Dates are secondary.** Never show dates on feed screens; inside a post the date sits at the end.
7. **Keep the frame thin and standard.** Semantic HTML, modern CSS, minimal JavaScript; the site must work with JavaScript off.
8. **Check before finishing:** run `npm run build` and make sure it completes without warnings.
