/** Shared UI: preloader, nav, clocks, altimeter, reveals, counters, cursor glow, toast. */
import { site } from '../data/site.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n, l = 2) => String(n).padStart(l, '0');

/* ---------- preloader countdown ---------- */
export function runPreloader() {
  const el = document.getElementById('preloader');
  const count = document.getElementById('preloaderCount');
  if (!el) return Promise.resolve();
  document.body.classList.add('is-loading');
  const seen = (() => { try { return sessionStorage.getItem('aurora-launched'); } catch { return null; } })();
  const finish = () => {
    el.classList.add('is-done');
    document.body.classList.remove('is-loading');
    try { sessionStorage.setItem('aurora-launched', '1'); } catch {}
  };
  if (reduced() || seen) { finish(); return Promise.resolve(); }
  return new Promise((resolve) => {
    const seq = ['3', '2', '1', 'GO'];
    let i = 0;
    const tick = () => {
      count.textContent = seq[i++];
      if (i < seq.length) setTimeout(tick, 380);
      else setTimeout(() => { finish(); resolve(); }, 300);
    };
    tick();
  });
}

/* ---------- hero title split ---------- */
export function splitHeroTitle() {
  const t = document.querySelector('.hero__aurora');
  if (!t) return;
  const text = t.textContent;
  t.innerHTML = [...text].map((c, i) => `<span class="char" style="transition-delay:${150 + i * 70}ms">${c}</span>`).join('');
  requestAnimationFrame(() => document.querySelector('.hero__title').classList.add('is-in'));
}

/* ---------- navigation ---------- */
export function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  let lastY = scrollY;

  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const menuOpen = links.classList.contains('is-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > innerHeight * 0.8);
    lastY = y;
  }, { passive: true });

  const close = () => { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  addEventListener('keydown', (e) => e.key === 'Escape' && close());

  // active section highlight
  const map = new Map([...links.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      map.forEach((a) => a.classList.remove('is-active'));
      map.get(e.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- clocks: IST + mission elapsed time ---------- */
export function initClocks() {
  const ist = document.getElementById('istClock');
  const met = document.getElementById('met');
  const founded = new Date(site.founded).getTime();
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => {
    const now = Date.now();
    if (ist) ist.textContent = fmt.format(now);
    if (met) {
      let s = Math.floor((now - founded) / 1000);
      const d = Math.floor(s / 86400); s %= 86400;
      met.textContent = `T+ ${pad(d, 4)}d ${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- altimeter: scroll = altitude (0 → 420 km) ---------- */
export function initAltimeter() {
  const wrap = document.querySelector('.altimeter');
  const fill = document.getElementById('altFill');
  const ship = document.getElementById('altShip');
  const km = document.getElementById('altKm');
  const marks = [...document.querySelectorAll('.altimeter__mark')];
  if (!wrap) return;
  const MAX = 420;
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(scrollY / max, 1) : 0;
    fill.style.height = `${p * 100}%`;
    ship.style.bottom = `${p * 100}%`;
    km.textContent = Math.round(p * MAX).toString();
    wrap.classList.toggle('is-visible', scrollY > innerHeight * 0.5);
    marks.forEach((m) => m.classList.toggle('is-passed', p * 100 >= parseFloat(m.style.getPropertyValue('--at'))));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- reveal on scroll + number counters ---------- */
export function initReveals(root = document) {
  const els = root.querySelectorAll('.reveal:not(.is-in)');
  if (reduced()) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      e.target.querySelectorAll?.('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((e) => io.observe(e));
}

function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const from = target > 1000 ? target - 60 : 0;
  const dur = 1600;
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(from + (target - from) * e) + (k === 1 ? suffix : '');
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- cursor glow (fine pointers only) ---------- */
export function initCursor() {
  const c = document.getElementById('cursor');
  if (!c || !matchMedia('(pointer: fine)').matches || reduced()) return;
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; c.classList.add('is-on'); });
  document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  const loop = () => {
    cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
    c.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- occasional shooting stars ---------- */
export function initShootingStars() {
  if (reduced()) return;
  const spawn = () => {
    if (!document.hidden && scrollY < innerHeight * 0.9) {
      const s = document.createElement('div');
      s.className = 'shooting-star';
      const a = 20 + Math.random() * 25;
      s.style.left = `${Math.random() * 70}vw`;
      s.style.top = `${Math.random() * 35}vh`;
      s.style.setProperty('--a', `${a}deg`);
      s.style.setProperty('--tx', `${Math.cos((a * Math.PI) / 180) * 400}px`);
      s.style.setProperty('--ty', `${Math.sin((a * Math.PI) / 180) * 400}px`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }
    setTimeout(spawn, 3500 + Math.random() * 5000);
  };
  setTimeout(spawn, 2500);
}

/* ---------- toast ---------- */
let toastTimer;
export function toast(msg, ms = 3200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), ms);
}

/* ---------- 3D tilt helper ---------- */
export function tilt(el, max = 6) {
  if (!matchMedia('(pointer: fine)').matches || reduced()) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max}deg) rotateX(${(0.5 - py) * max}deg) translateY(-4px)`;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

export const escapeHTML = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
