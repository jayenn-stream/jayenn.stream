# Posting: the quick way

You write the stream of thought. The AI suggests the title and tags. You confirm. Then you make the file.

## 1. Ask the AI for a header

Open **jayenn.stream/post-prompt/** (bookmark it on your phone and Mac) and tap **Copy prompt**. Paste it into your chatbot, then paste your writing underneath. Also paste the current subjects, from the Subjects tab, so it reuses them.

The prompt's text lives in `src/post-prompt.njk`, if you ever want to change it.

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
