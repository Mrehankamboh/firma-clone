const STAGE = 900;
const TRACK = 12034;
const scaler = document.querySelector(".scaler");
const bar = document.querySelector(".progress i");
const label = document.querySelector("#cursor-label");
const cursor = document.querySelector(".cursor");
let scale = 1;
let current = 0;
let target = 0;
let mobile = false;

function maxScroll() {
  return Math.max(0, TRACK - window.innerWidth / scale);
}

function layout() {
  mobile = window.innerWidth < 860;
  document.body.classList.toggle("is-mobile", mobile);
  scale = mobile ? 1 : window.innerHeight / STAGE;
  if (mobile) scaler.style.transform = "none";
  target = Math.min(target, maxScroll());
}

function easeIO(x) {
  const x1 = 0.4, y1 = 0, x2 = 0.2, y2 = 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const dx = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(dx) < 1e-4) break;
    t = Math.min(1, Math.max(0, t - (sx(t) - x) / dx));
  }
  return sy(t);
}

function tick() {
  if (!mobile) {
    current += (target - current) * 0.09;
    if (Math.abs(target - current) < 0.3) current = target;
    scaler.style.transform = `scale(${scale}) translate3d(${-current}px,0,0)`;
    const max = maxScroll();
    const thumb = Math.max(64, window.innerWidth * (window.innerWidth / scale / TRACK));
    const travel = window.innerWidth - thumb;
    bar.style.width = thumb + "px";
    bar.style.transform = `translateX(${max ? (current / max) * travel : 0}px)`;
    document.querySelectorAll("[data-spin]").forEach((el) => {
      const lag = Number(el.dataset.spin) || 0;
      el.style.transform = `rotate(${-0.25 * Math.max(0, current - lag)}deg)`;
    });
    const wm = document.querySelector(".idea .wm");
    if (wm) {
      const band = wm.closest(".band");
      const view = window.innerWidth / scale;
      wm.style.width = view + "px";
      wm.style.transform = `translate3d(${(current - band.offsetLeft).toFixed(2)}px,0,0)`;
    }
    document.querySelectorAll("[data-drift]").forEach((el) => {
      const band = el.closest(".band");
      const pageX = band.offsetLeft + el.offsetLeft;
      const view = window.innerWidth / scale;
      const span = view + Number(el.dataset.extra);
      const p = Math.min(1, Math.max(0, (current - (pageX - view)) / span));
      const from = Number(el.dataset.drift);
      const img = el.querySelector("img") || el;
      img.style.transform = `translate3d(${(from * (1 - p)).toFixed(2)}px,0,0)`;
    });
    document.querySelectorAll("[data-rise]").forEach((el) => {
      const pin = el.classList.contains("pin") ? el : el.closest(".pin");
      const band = el.closest(".band");
      if (!pin || !band) return;
      const pageX = band.offsetLeft + pin.offsetLeft;
      const screen = (pageX - current) * scale;
      if (screen < window.innerWidth) {
        if (performance.now() < (window.__pageIn || 0)) {
          el.style.opacity = "1";
          el.style.transform = "none";
          el.dataset.rode = "1";
          return;
        }
        if (el.dataset.rode) {
          el.style.opacity = "1";
          el.style.transform = "none";
          return;
        }
        if (!el.dataset.risen) el.dataset.risen = String(performance.now() + Number(el.dataset.rise || 0));
        const u = Math.min(1, Math.max(0, (performance.now() - Number(el.dataset.risen)) / 1100));
        const p = easeIO(u);
        el.style.opacity = p.toFixed(3);
        el.style.transform = `translate3d(0,${(60 * (1 - p)).toFixed(1)}px,0)`;
      } else {
        delete el.dataset.risen;
        delete el.dataset.rode;
        el.style.opacity = "0";
        el.style.transform = "translate3d(0,60px,0)";
      }
    });
    syncCursor();
  }
  requestAnimationFrame(tick);
}

window.addEventListener("wheel", (e) => {
  if (mobile || document.body.classList.contains("menu-open")) return;
  e.preventDefault();
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  target = Math.max(0, Math.min(maxScroll(), target + delta));
}, { passive: false });

let drag = null;
window.addEventListener("pointerdown", (e) => {
  if (mobile || e.target.closest("a, button, input, textarea")) return;
  drag = { x: e.clientX, start: target };
});
window.addEventListener("pointermove", (e) => {
  if (!drag || mobile) return;
  target = Math.max(0, Math.min(maxScroll(), drag.start + (drag.x - e.clientX) / scale));
});
window.addEventListener("pointerup", () => { drag = null; });

const menu = document.querySelector(".menu");
document.querySelector(".burger").addEventListener("click", () => {
  menu.classList.add("open");
  document.body.classList.add("menu-open");
});
document.querySelector(".menu .x").addEventListener("click", () => {
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
});

document.querySelectorAll(".faq-item button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const open = item.classList.toggle("open");
    item.querySelector("p").hidden = !open;
  });
});

document.querySelectorAll(".info-copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("hello@firma.com"); } catch (err) {}
    const prev = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(() => { btn.textContent = prev; }, 1400);
  });
});

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    target = Math.max(0, Math.min(maxScroll(), Number(el.dataset.goto)));
  });
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const idea = form.classList.contains("idea-form");
    form.innerHTML = idea
      ? "<p class='serif' style='color:#fff;font-size:32px;margin:0'>Message received.</p>"
      : "<p class='serif' style='font-size:32px;margin:0'>You’re on the list.</p>";
  });
});

let pointerX = 0;
let pointerY = 0;
let cursorX = 0;
let cursorY = 0;
let pointerOn = false;

function syncCursor() {
  if (!pointerOn || mobile || !cursor) return;
  cursorX += (pointerX - cursorX) * 0.15;
  cursorY += (pointerY - cursorY) * 0.15;
  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";
  cursor.style.opacity = "1";
  const top = document.elementsFromPoint(pointerX, pointerY).find((node) => node !== cursor && !cursor.contains(node));
  const hit = top && top.closest("[data-cursor]");
  const name = hit ? hit.dataset.cursor : "";
  cursor.classList.toggle("is-hot", Boolean(name) && name !== "PLUS");
  cursor.classList.toggle("is-plus", name === "PLUS");
  cursor.classList.toggle("is-light", Boolean(top && top.closest("[data-ink='light']") && !name));
  label.textContent = name === "PLUS" ? "" : name;
}

window.addEventListener("mousemove", (e) => {
  pointerX = e.clientX;
  pointerY = e.clientY;
  if (!pointerOn) {
    cursorX = pointerX;
    cursorY = pointerY;
  }
  pointerOn = true;
});

const wmRoot = document.querySelector(".idea .wm");
if (wmRoot) {
  const rot = document.createElement("div");
  rot.className = "wm-rot";
  const line = "<span>FIRMA</span>".repeat(8);
  for (let i = 0; i < 8; i++) {
    const row = document.createElement("div");
    row.className = "wm-row" + (i % 2 ? " rev" : "");
    row.innerHTML = line + line;
    rot.appendChild(row);
  }
  wmRoot.appendChild(rot);
  const sizeRows = () => {
    rot.querySelectorAll(".wm-row").forEach((row) => {
      const half = row.scrollWidth / 2;
      if (half > 0) row.style.animationDuration = (half / 45).toFixed(2) + "s";
    });
  };
  sizeRows();
  document.fonts.ready.then(sizeRows);
}

window.addEventListener("resize", layout);
layout();
try {
  const saved = Number(sessionStorage.getItem("journal-x"));
  if (saved > 0) {
    target = Math.min(maxScroll(), saved);
    current = target;
    if (!mobile) scaler.style.transform = `scale(${scale}) translate3d(${-current}px,0,0)`;
  }
} catch (err) {}
window.addEventListener("pagehide", () => {
  try { sessionStorage.setItem("journal-x", String(Math.round(target))); } catch (err) {}
});
requestAnimationFrame(tick);
window.__scrollTo = (x) => {
  target = Math.max(0, Math.min(maxScroll(), x));
  current = target;
};
