/** Flight recorder: filterable masonry gallery + keyboard lightbox. */
import { sortedMissions, photosOf } from './missions.js';
import { escapeHTML as e } from './ui.js';

export function initGallery() {
  const wrap = document.getElementById('masonry');
  const filters = document.getElementById('galleryFilters');
  if (!wrap) return;
  const missions = sortedMissions().slice().reverse();
  const all = missions.flatMap((m) => photosOf(m).map((src) => ({ src, id: m.id, title: m.title })));
  let current = 'all';
  let shown = [];

  filters.innerHTML = [`<button class="chip is-active" data-f="all">All missions</button>`]
    .concat(missions.map((m) => `<button class="chip" data-f="${e(m.id)}">${e(m.title.replace(/ of the SEDS VIT-AP Chapter/, ''))}</button>`))
    .join('');

  const render = () => {
    shown = current === 'all' ? all : all.filter((p) => p.id === current);
    filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c.dataset.f === current));
    wrap.innerHTML = shown.map((p, i) => `
      <button class="masonry__item" data-i="${i}" style="animation-delay:${Math.min(i, 15) * 35}ms" aria-label="Open photo: ${e(p.title)}">
        <img src="${e(p.src)}" alt="${e(p.title)}" loading="lazy" decoding="async" />
        <span class="tag">${e(p.title)}</span>
      </button>`).join('');
  };
  filters.addEventListener('click', (ev) => {
    const c = ev.target.closest('.chip');
    if (!c) return;
    current = c.dataset.f;
    render();
  });
  render();

  // lightbox
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  let idx = 0;
  const show = (i) => {
    idx = (i + shown.length) % shown.length;
    img.src = shown[idx].src;
    img.alt = shown[idx].title;
    cap.textContent = `${shown[idx].title} · ${idx + 1} / ${shown.length}`;
  };
  wrap.addEventListener('click', (ev) => {
    const it = ev.target.closest('.masonry__item');
    if (!it) return;
    show(Number(it.dataset.i));
    document.body.style.overflow = 'hidden';
    lb.showModal();
  });
  document.getElementById('lbPrev').addEventListener('click', () => show(idx - 1));
  document.getElementById('lbNext').addEventListener('click', () => show(idx + 1));
  document.getElementById('lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => document.body.style.removeProperty('overflow'));
  lb.addEventListener('click', (ev) => { if (ev.target === lb) lb.close(); });
  lb.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') show(idx + 1);
    if (ev.key === 'ArrowLeft') show(idx - 1);
  });
  // swipe
  let sx = null;
  lb.addEventListener('touchstart', (ev) => (sx = ev.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (ev) => {
    if (sx === null) return;
    const dx = ev.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
}
