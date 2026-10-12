(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.scrollingElement || document.documentElement;
  let current = root.scrollTop;
  let target = current;
  let running = false;

  function stacked() {
    return document.body.classList.contains("page") || document.body.classList.contains("is-mobile");
  }

  function limit() {
    return Math.max(0, root.scrollHeight - window.innerHeight);
  }

  function frame() {
    current += (target - current) * 0.09;
    if (Math.abs(target - current) < 0.4) current = target;
    root.scrollTop = current;
    if (current !== target) requestAnimationFrame(frame);
    else running = false;
  }

  function kick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function inField(target) {
    return target instanceof Element && !!target.closest("input, textarea");
  }

  window.addEventListener("wheel", (e) => {
    if (!stacked() || document.body.classList.contains("menu-open")) return;
    if (inField(e.target)) return;
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (!delta || limit() <= 0) return;
    e.preventDefault();
    target = Math.max(0, Math.min(limit(), target + delta));
    kick();
  }, { passive: false });

  window.addEventListener("keydown", (e) => {
    if (!stacked() || document.body.classList.contains("menu-open")) return;
    if (inField(e.target)) return;
    const step = e.key === "PageDown" || e.key === " " ? window.innerHeight * 0.85
      : e.key === "PageUp" ? -window.innerHeight * 0.85
      : e.key === "ArrowDown" ? 80
      : e.key === "ArrowUp" ? -80
      : e.key === "Home" ? -target
      : e.key === "End" ? limit() - target
      : 0;
    if (!step) return;
    e.preventDefault();
    target = Math.max(0, Math.min(limit(), target + step));
    kick();
  });

  window.addEventListener("scroll", () => {
    if (running || !stacked()) return;
    current = root.scrollTop;
    target = current;
  }, { passive: true });
})();
