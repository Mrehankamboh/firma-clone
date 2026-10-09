const STAGE = 900;
const TRACK = 33569;
const scaler = document.querySelector(".scaler");
const bar = document.querySelector(".progress i");
const label = document.querySelector("#cursor-label");
const cursor = document.querySelector(".cursor");
let scale = 1;
let current = 0;
let target = 0;
let mobile = false;

const jumps = {
  work: 2200,
  about: 8000,
  principles: 11789,
  numbers: 14000,
  services: 16114,
  pricing: 19721,
  journal: 22087,
  contact: 31200,
};

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
    const view = window.innerWidth / scale;
    document.querySelectorAll("[data-ticker]").forEach((el) => {
      const band = el.closest(".band");
      const pageX = band.offsetLeft + el.offsetLeft;
      const travel = view + el.offsetWidth;
      const ty = Math.min(STAGE, Math.max(0, current - (pageX - view)) * (STAGE / travel));
      el.style.transform = `translate3d(0,${ty}px,0)`;
    });
    document.querySelectorAll("[data-spin]").forEach((el) => {
      const lag = Number(el.dataset.spin) || 0;
      el.style.transform = `rotate(${-0.25 * Math.max(0, current - lag)}deg)`;
    });
    document.querySelectorAll(".rise").forEach((el) => {
      const band = el.closest(".band");
      const pageX = band.offsetLeft + el.offsetLeft;
      const screen = (pageX - current) * scale;
      const p = Math.min(1, Math.max(0, (window.innerWidth - screen) / 640));
      el.style.opacity = String(p);
      el.style.filter = `blur(${((1 - p) * 8).toFixed(2)}px)`;
      el.style.transform = `translateY(${((1 - p) * 36).toFixed(1)}px)`;
    });
    const seen = current + view * 0.45;
    syncCursor();
    document.querySelectorAll("[data-shift]").forEach((el) => {
      const band = el.closest(".band");
      const pageX = band.offsetLeft + el.offsetLeft;
      const view = window.innerWidth / scale;
      const travel = view + Number(el.dataset.extra);
      const p = Math.min(1, Math.max(0, (current - (pageX - view)) / travel));
      el.style.transform = `translate3d(${(Number(el.dataset.shift) * p).toFixed(2)}px,0,0)`;
    });
    document.querySelectorAll("[data-drift]").forEach((el) => {
      const band = el.closest(".band");
      const pageX = band.offsetLeft + el.offsetLeft;
      const view = window.innerWidth / scale;
      const travel = view + Number(el.dataset.extra);
      const p = Math.min(1, Math.max(0, (current - (pageX - view)) / travel));
      const from = Number(el.dataset.drift);
      const target = el.querySelector("img") || el;
      target.style.transform = `translate3d(${(from * (1 - p)).toFixed(2)}px,0,0)`;
    });
    document.querySelectorAll(".p-word").forEach((el) => {
      const head = el.closest(".p-line");
      const band = el.closest(".band");
      const pageX = band.offsetLeft + head.offsetLeft;
      const view = window.innerWidth / scale;
      const enter = current - (pageX - view);
      const t = Math.min(1, Math.max(0, (enter - Number(el.dataset.delay)) / 80));
      const p = 1 - Math.pow(1 - t, 3);
      el.style.opacity = p.toFixed(3);
      el.style.filter = `blur(${(10 * (1 - p)).toFixed(2)}px)`;
      el.style.transform = `translate3d(0,${(10 * (1 - p)).toFixed(1)}px,0)`;
    });
    document.querySelectorAll("[data-rise]").forEach((el) => {
      const pin = el.classList.contains("pin") ? el : el.closest(".pin");
      const band = el.closest(".band");
      const pageX = band.offsetLeft + pin.offsetLeft;
      const screen = (pageX - current) * scale;
      if (screen < window.innerWidth) {
        if (!el.dataset.risen) el.dataset.risen = String(performance.now() + Number(el.dataset.rise || 0));
        const u = Math.min(1, Math.max(0, (performance.now() - Number(el.dataset.risen)) / 1100));
        const p = easeIO(u);
        el.style.opacity = p.toFixed(3);
        el.style.transform = `translate3d(0,${(60 * (1 - p)).toFixed(1)}px,0)`;
      } else {
        delete el.dataset.risen;
        el.style.opacity = "0";
        el.style.transform = "translate3d(0,60px,0)";
      }
    });
    document.querySelectorAll("[data-appear]").forEach((el) => {
      const pin = el.classList.contains("pin") ? el : el.closest(".pin");
      const band = el.closest(".band");
      const pageX = band.offsetLeft + pin.offsetLeft;
      const view = window.innerWidth / scale;
      const enter = current - (pageX - view);
      const t = Math.min(1, Math.max(0, (enter - Number(el.dataset.appear)) / 180));
      const p = 1 - Math.pow(1 - t, 3);
      el.style.opacity = p.toFixed(3);
      el.style.transform = `translate3d(0,${(60 * (1 - p)).toFixed(1)}px,0)`;
    });
    document.querySelectorAll(".proj .dotlink").forEach((el) => {
      const screen = el.getBoundingClientRect().left;
      const p = Math.min(1, Math.max(0, (window.innerWidth + 80 - screen) / 160));
      el.style.setProperty("--line", p.toFixed(3));
    });
    document.querySelectorAll("[data-team]").forEach((el) => {
      const view = window.innerWidth / scale;
      const start = Number(el.dataset.team) - view;
      const travel = view + Number(el.dataset.extra);
      const p = Math.min(1, Math.max(0, (current - start) / travel));
      el.style.transform = `translate3d(${(Number(el.dataset.range) * p).toFixed(2)}px,0,0)`;
    });
    document.querySelectorAll(".shot, .news-photo").forEach((frame) => {
      const img = frame.querySelector("img");
      const band = frame.closest(".band");
      const pageX = band.offsetLeft + frame.offsetLeft;
      const view = window.innerWidth / scale;
      const extra = img.offsetWidth - frame.offsetWidth;
      const travel = view + frame.offsetWidth;
      const p = Math.min(1, Math.max(0, (current - (pageX - view)) / travel));
      img.style.transform = `translate3d(${(-extra * (1 - p)).toFixed(2)}px,0,0)`;
    });
    document.querySelectorAll("[data-key]").forEach((el) => {
      const along = current - 24400;
      const span = { F: [-50, 50], A: [-50, 50], I: [-100, 100], M: [-100, 100] };
      const base = { F: -28.114, A: 26.178, I: 41.71, M: -31.388, R: 0 };
      const speed = { F: -0.02938, A: 0.02982, I: 0.05737, M: -0.05666, R: 0 };
      const id = el.dataset.key;
      let x = base[id] + speed[id] * along;
      const cap = span[id];
      if (cap) x = Math.min(cap[1], Math.max(cap[0], x));
      el.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(2)}px)`;
    });
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      const band = el.closest(".band");
      if (seen > band.offsetLeft + 200) {
        el.dataset.done = "1";
        const end = Number(el.dataset.count);
        const t0 = performance.now();
        const run = (now) => {
          const p = Math.min(1, (now - t0) / 900);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }
    });
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
  if (mobile || e.target.closest("a, button, input")) return;
  drag = { x: e.clientX, start: target };
});
window.addEventListener("pointermove", (e) => {
  if (!drag || mobile) return;
  target = Math.max(0, Math.min(maxScroll(), drag.start + (drag.x - e.clientX) / scale));
});
window.addEventListener("pointerup", () => { drag = null; });

window.addEventListener("keydown", (e) => {
  if (mobile) return;
  if (e.key === "ArrowRight") target = Math.min(maxScroll(), target + 180);
  if (e.key === "ArrowLeft") target = Math.max(0, target - 180);
});

document.querySelectorAll("[data-jump]").forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.dataset.jump;
    if (mobile) return;
    if (id === "home") {
      e.preventDefault();
      target = 0;
      document.querySelector(".menu").classList.remove("open");
      document.body.classList.remove("menu-open");
      return;
    }
    if (!jumps[id]) return;
    e.preventDefault();
    target = Math.min(maxScroll(), jumps[id]);
    document.querySelector(".menu").classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

const menu = document.querySelector(".menu");
document.querySelector(".burger").addEventListener("click", () => {
  menu.classList.add("open");
  document.body.classList.add("menu-open");
});
document.querySelector(".menu .x").addEventListener("click", () => {
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
});

const words = [...document.querySelectorAll(".word")];
let wi = 0;
setInterval(() => {
  words[wi].classList.remove("on");
  wi = (wi + 1) % words.length;
  words[wi].classList.add("on");
}, 1600);

document.querySelectorAll(".faq-item button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const open = item.classList.toggle("open");
    item.querySelector("p").hidden = !open;
  });
});

document.querySelector("#copy-mail").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText("hello@firma.com"); } catch (err) {}
  const tip = document.querySelector("#copied");
  tip.hidden = false;
  setTimeout(() => { tip.hidden = true; }, 1400);
});

document.querySelector("#subscribe").addEventListener("click", (e) => {
  e.preventDefault();
  const form = e.target.closest("form");
  form.innerHTML = "<p class='serif' style='font-size:32px'>You’re on the list.</p>";
});

const reel = document.querySelector(".reel");
document.querySelector(".mark").addEventListener("click", () => {
  reel.classList.add("open");
  const v = reel.querySelector("video");
  v.currentTime = 0;
  v.play();
});
reel.querySelector("button").addEventListener("click", () => {
  reel.classList.remove("open");
  reel.querySelector("video").pause();
});

let pointerX = 0;
let pointerY = 0;
let cursorX = 0;
let cursorY = 0;
let pointerOn = false;

function syncCursor() {
  if (!pointerOn || mobile) return;
  cursorX += (pointerX - cursorX) * 0.15;
  cursorY += (pointerY - cursorY) * 0.15;
  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";
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
window.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
});
window.addEventListener("mouseenter", () => {
  cursor.style.opacity = "1";
});

document.fonts.ready.then(() => {
  const word = document.querySelector(".mark b");
  const media = document.querySelector(".mark-media");
  if (!word || !media) return;
  const w = Math.ceil(word.offsetWidth);
  const h = Math.ceil(word.offsetHeight);
  const canvas = document.createElement("canvas");
  const dpr = 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#fff";
  ctx.font = "900 540px Geist, sans-serif";
  ctx.letterSpacing = "-27px";
  ctx.textBaseline = "top";
  ctx.fillText("FIRMA", 0, 0);
  const url = canvas.toDataURL();
  media.style.webkitMaskImage = "url(\"" + url + "\")";
  media.style.maskImage = "url(\"" + url + "\")";
  media.style.webkitMaskRepeat = "no-repeat";
  media.style.maskRepeat = "no-repeat";
  media.style.webkitMaskSize = "100% 100%";
  media.style.maskSize = "100% 100%";
  word.style.color = "transparent";
});

window.addEventListener("resize", layout);
layout();
try {
  const saved = Number(sessionStorage.getItem("firma-x"));
  if (saved > 0) {
    target = Math.min(maxScroll(), saved);
    current = target;
    if (!mobile) scaler.style.transform = `scale(${scale}) translate3d(${-current}px,0,0)`;
  }
} catch (err) {}
window.addEventListener("pagehide", () => {
  try { sessionStorage.setItem("firma-x", String(Math.round(target))); } catch (err) {}
});
requestAnimationFrame(tick);
window.__scrollTo = (x) => {
  target = Math.max(0, Math.min(maxScroll(), x));
  current = target;
};
