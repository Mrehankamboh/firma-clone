(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.__pageIn = performance.now() + 760;
  window.addEventListener("pagereveal", function (e) {
    document.documentElement.classList.add(e.viewTransition ? "vt" : "boot");
  });
  if (!("onpagereveal" in window)) document.documentElement.classList.add("boot");
})();
