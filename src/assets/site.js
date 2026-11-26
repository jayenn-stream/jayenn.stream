// Jayenn — small enhancements. The site works without this file.
(() => {
  const feed = document.getElementById("feed");
  const bar = document.getElementById("bar");
  const store = { get(k){try{return sessionStorage.getItem(k)}catch{return null}}, set(k,v){try{sessionStorage.setItem(k,v)}catch{}} };

  // Bar: hide on scroll down, show on scroll up, tap, or pause.
  let last = 0, idle;
  const showBar = () => bar.classList.remove("hidden");
  const onScroll = (y) => {
    bar.classList.toggle("hidden", y > last + 4);
    if (y < last - 4) showBar();
    last = y;
    clearTimeout(idle); idle = setTimeout(showBar, 1800);
  };

  if (feed) {
    const rows = [...feed.querySelectorAll(".row")];
    feed.addEventListener("scroll", () => onScroll(feed.scrollTop), { passive: true });

    // Swipe into a post: lock the feed so scrolling stays inside the post.
    for (const row of rows) {
      row.addEventListener("scroll", () => {
        const open = row.scrollLeft > row.clientWidth / 2;
        feed.classList.toggle("locked", open);
        if (open) showBar();
      }, { passive: true });
      const card = row.querySelector(".card");
      if (card) {
        const open = () => row.scrollTo({ left: row.clientWidth, behavior: "smooth" });
        card.addEventListener("click", open);
        card.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
      }
    }

    // Back out of a post: the arrow button, or Escape.
    const closeRow = (row) => { row.scrollTo({ left: 0, behavior: "smooth" }); feed.classList.remove("locked"); row.querySelector(".card")?.focus({ preventScroll: true }); };
    for (const row of rows) row.querySelector(".back")?.addEventListener("click", () => closeRow(row));
    // The arrow fades while you read down a post and comes back as soon as you scroll up.
    for (const post of document.querySelectorAll(".post")) {
      const back = post.querySelector(".back"); let prev = 0;
      post.addEventListener("scroll", () => {
        const y = post.scrollTop; back.classList.toggle("away", y > prev + 4 && y > 120); if (y < prev - 4 || y < 120) back.classList.remove("away"); prev = y;
      }, { passive: true });
    }
    addEventListener("keydown", (e) => { if (e.key !== "Escape") return; const open = rows.find((r) => r.scrollLeft > r.clientWidth / 2); if (open) closeRow(open); });

    // First visit only: nudge the first post sideways once, to show it can be swiped.
    let seen = false; try { seen = localStorage.getItem("jayenn:hinted") === "1"; localStorage.setItem("jayenn:hinted", "1"); } catch {}
    const first = rows.find((r) => r.querySelector(".card"));
    if (!seen && first && !matchMedia("(prefers-reduced-motion: reduce)").matches && !location.hash) {
      setTimeout(() => { first.scrollTo({ left: 70, behavior: "smooth" }); setTimeout(() => first.scrollTo({ left: 0, behavior: "smooth" }), 650); }, 900);
    }

    // Remember which post you're on (for the Posts tab), and colour the desktop rail to match it.
    let current = rows[0], settledCount = 0;
    const railFrom = (el) => { const cs = getComputedStyle(el); bar.style.setProperty("--rail-fg", cs.getPropertyValue("--fg")); bar.style.setProperty("--rail-muted", cs.getPropertyValue("--muted")); };
    if (current) railFrom(current);
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting && e.intersectionRatio > .6) {
        current = e.target; store.set("jayenn:at", current.id); railFrom(current);
        rows.forEach((r) => r.classList.toggle("settled", r === current));
        if (++settledCount > 5) feed.classList.add("hinted");
      }
    }, { root: feed, threshold: .6 });

    // Keys: up/down between posts, right to open, left to go back.
    addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = rows.indexOf(current), open = current && current.scrollLeft > current.clientWidth / 2;
      if (e.key === "ArrowDown" && !open && rows[i + 1]) { e.preventDefault(); rows[i + 1].scrollIntoView({ behavior: "smooth" }); }
      else if (e.key === "ArrowUp" && !open && rows[i - 1]) { e.preventDefault(); rows[i - 1].scrollIntoView({ behavior: "smooth" }); }
      else if (e.key === "ArrowRight" && !open && current.querySelector(".post")) { e.preventDefault(); current.scrollTo({ left: current.clientWidth, behavior: "smooth" }); }
      else if (e.key === "ArrowLeft" && open) { e.preventDefault(); closeRow(current); }
    });
    rows.forEach((r) => io.observe(r));

    // Jump to #here, #motto or any post id; close any open post first.
    const jump = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id && document.getElementById(id);
      if (!el || !el.classList.contains("row")) return;
      rows.forEach((r) => r.scrollTo({ left: 0 }));
      feed.classList.remove("locked");
      el.scrollIntoView({ block: "start" });
    };
    addEventListener("hashchange", jump);
    jump();

    // Posts tab on the feed: go to the newest post.
    const postsTab = bar.querySelector("[data-posts]");
    if (postsTab && postsTab.hasAttribute("aria-current")) postsTab.addEventListener("click", (e) => {
      e.preventDefault();
      rows.forEach((r) => r.scrollTo({ left: 0 }));
      feed.classList.remove("locked");
      feed.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    addEventListener("scroll", () => onScroll(scrollY), { passive: true });
    const meta = document.querySelector(".single .meta"); let prev = 0; // "← Posts" fades like the arrow
    if (meta) addEventListener("scroll", () => {
      const y = scrollY; meta.classList.toggle("away", y > prev + 4 && y > 120); if (y < prev - 4 || y < 120) meta.classList.remove("away"); prev = y;
    }, { passive: true });
    const page = document.querySelector(".single");
    if (page) { const cs = getComputedStyle(page); bar.style.setProperty("--rail-fg", cs.getPropertyValue("--fg")); bar.style.setProperty("--rail-muted", cs.getPropertyValue("--muted")); }
    // Posts tab elsewhere: return to the post you were on.
    const postsTab = bar.querySelector("[data-posts]");
    const at = store.get("jayenn:at");
    if (postsTab && at) postsTab.href = postsTab.getAttribute("href").replace(/(#.*)?$/, "#" + at);
  }
  document.addEventListener("click", (e) => { if (!e.target.closest(".bar")) showBar(); });

  // Email: assembled here so simple bots don't find it in the page code.
  for (const a of document.querySelectorAll("a.mail")) {
    const addr = a.dataset.u + "@" + a.dataset.d;
    a.href = "mailto:" + addr; a.textContent = addr;
  }

  // Share a post: the phone's share sheet where available, else copy the link.
  for (const b of document.querySelectorAll(".share")) b.addEventListener("click", async () => {
    const url = b.dataset.url, icon = b.innerHTML;
    try {
      if (navigator.share) { await navigator.share({ title: b.dataset.title, url }); return; }
      await navigator.clipboard.writeText(url); b.textContent = "✓ copied";
    } catch (e) {
      if (e && e.name === "AbortError") return;
      b.textContent = url;
    }
    b.classList.add("done");
    setTimeout(() => { b.innerHTML = icon; b.classList.remove("done"); }, 2500);
  });

  // Subjects page: tabs, subjects that open, titles with optional dates, and search.
  const find = document.querySelector(".find");
  if (find) {
    const tabs = [...find.querySelectorAll('[role="tab"]')];
    const show = (tab) => { for (const t of tabs) { const on = t === tab; t.setAttribute("aria-selected", on); document.getElementById(t.getAttribute("aria-controls")).hidden = !on; } };
    tabs.forEach((t) => t.addEventListener("click", () => show(t)));

    // One subject open at a time (also native in newer browsers via details[name]).
    const subjectsEls = [...find.querySelectorAll("details[name=subject]")];
    for (const d of subjectsEls) d.addEventListener("toggle", () => { if (d.open) for (const o of subjectsEls) if (o !== d) o.open = false; });

    const byTitle = document.getElementById("by-title"), list = document.getElementById("title-list");
    const datesBtn = document.getElementById("dates"), order = document.getElementById("order");
    datesBtn.addEventListener("click", () => {
      const on = !byTitle.classList.contains("dated");
      byTitle.classList.toggle("dated", on); datesBtn.setAttribute("aria-pressed", on);
      datesBtn.textContent = on ? "hide dates" : "dates"; order.hidden = !on;
    });
    for (const b of order.querySelectorAll("button")) b.addEventListener("click", () => {
      for (const x of order.querySelectorAll("button")) x.setAttribute("aria-pressed", x === b);
      const items = [...list.children].sort((x, y) => (x.dataset.t < y.dataset.t ? 1 : -1) * (b.dataset.order === "old" ? -1 : 1));
      list.append(...items);
    });

    // #time opens that subject; #find-word searches for it.
    const q = document.getElementById("q");
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (h.startsWith("find-")) { q.value = h.slice(5).replace(/-/g, " "); q.dispatchEvent(new Event("input")); return; }
      const d = h && document.getElementById(h);
      if (d && d.tagName === "DETAILS") { show(tabs[0]); d.open = true; d.scrollIntoView({ block: "start" }); }
    };

    const home = (bar.querySelector("[data-posts]")?.getAttribute("href") || "/").replace(/#.*$/, "");
    const index = JSON.parse(document.getElementById("index").textContent).map((p) => ({ ...p, u: home + "#" + p.i }));
    const results = document.getElementById("results");
    const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
    const hi = (t, v) => { const i = t.toLowerCase().indexOf(v); return i < 0 ? esc(t) : esc(t.slice(0, i)) + "<mark>" + esc(t.slice(i, i + v.length)) + "</mark>" + esc(t.slice(i + v.length)); };
    q.addEventListener("input", () => {
      const v = q.value.trim().toLowerCase();
      results.hidden = !v; document.getElementById("tabs").hidden = !!v;
      for (const t of tabs) document.getElementById(t.getAttribute("aria-controls")).hidden = v ? true : t.getAttribute("aria-selected") !== "true";
      if (!v) return;
      const seen = new Set(), groups = { title: [], date: [], tag: [] };
      for (const p of index) if (p.t.toLowerCase().includes(v)) { groups.title.push(p); seen.add(p.u); }
      for (const p of index) if (!seen.has(p.u) && p.d.includes(v)) { groups.date.push(p); seen.add(p.u); }
      for (const p of index) if (!seen.has(p.u) && p.g.includes(v)) { groups.tag.push(p); seen.add(p.u); }
      let any = false;
      for (const [k, ps] of Object.entries(groups)) {
        const box = results.querySelector(`[data-group="${k}"]`);
        box.hidden = !ps.length; any ||= !!ps.length;
        box.querySelector("ul").innerHTML = ps.map((p) => `<li><a href="${p.u}"><span>${k === "title" ? hi(p.t, v) : esc(p.t)}</span>${k === "date" ? `<span class="d" style="display:inline">${esc(p.s)}</span>` : ""}</a></li>`).join("");
      }
      results.querySelector(".none").hidden = any;
    });
    addEventListener("hashchange", fromHash);
    fromHash();
  }
})();
