# Posting: the quick way

You write the stream of thought. The AI suggests the title and tags. You confirm. Then you make the file.

## 1. Ask the AI for a header

Open your chatbot. Paste the prompt below (use the copy button at the top right of the box), then paste your writing underneath it. Also paste the current subjects, from the Subjects tab on the site, so it reuses them.

````
You prepare the header and file name for one post on my site, jayenn.stream. Do not output my writing at all, and never change it. Output only:

1. The file name: `YYYY-MM-DD-a-few-words.md` (today's date, then two to four lowercase words from the post, joined by hyphens).
2. The header, in one code block, between two `---` lines: `title:` (see rule 4); `date: YYYY-MM-DD` (today unless I say otherwise); `main: [...]`, one to three broad subjects; `secondary: [...]`, finer threads, examples or analogies from the post, as many as help searching.
3. Tags: lowercase, singular ("habit", not "Habits"). Reuse a subject from my list when one fits; if none does, suggest a new one and say so. Never invent a near-duplicate of an existing tag.
4. The title is mine. It names what I regard as the post's ultimate points, as one title or several separated by commas. If I haven't given one, leave `title:` out and suggest two or three candidates in your reply.
5. Leave out `font`, `colours` and `excerpt` unless I ask. Add `draft: true` only if I say it isn't ready.
6. If you're unsure which subject fits, ask me one short question first.
````

## 2. Confirm or edit

Tell the AI which title you want and any tag changes. Ask for the header again if you changed a lot.

## 3. Make the file

1. In `docs/`, open `post-template.md`, copy it, and name the copy with the file name the AI gave you.
2. Replace the header with the agreed one.
3. Paste your own writing under the second `---`. Five spaces between words make a gap; five dots stay as they are.

## 4. Publish

On GitHub open `src` → `posts` → **Add file** → **Upload files** (or **Create new file** and paste), then **Commit changes**. The **Actions** tab shows a green tick in about a minute. A red cross means a mistake in the file: open the run and read the error, or send it to the chatbot. A `[jayenn]` warning about invisible characters in the log means: retype that line.

## 5. Check

Open jayenn.stream and force-refresh. The post should be first in the feed. Swipe or tap to open it: the tags and date are at the end.

## Later

- **Change a post:** open its file in `src/posts/`, click the pencil, edit, commit. Give it today's `date` to move it to the top; a typo fix can keep the old date.
- **Hide a post:** add `draft: true` under the date. Delete the line to publish.
- **Whole file from the AI instead:** after the title and tags are agreed, say: "Now output the whole file, my writing copied exactly: every run of five spaces between words, every five dots, and all my punctuation and capitalisation unchanged." Read it through afterwards; the build can't tell you if a word was changed.
- **Font, colours, excerpt:** see `docs/post-template.md`.
