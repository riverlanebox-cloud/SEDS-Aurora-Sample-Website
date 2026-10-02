/** Mission log timeline + dossier modal + upcoming card. */
import { missions, upcoming } from '../data/events.js';
import { site } from '../data/site.js';
import { escapeHTML as e, tilt, initReveals } from './ui.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parse = (iso) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d }; };
const pretty = (iso) => { const { y, m, d } = parse(iso); return `${d} ${MONTHS[m - 1]} ${y}`; };

export const sortedMissions = () => [...missions].sort((a, b) => b.date.localeCompare(a.date));
export const photosOf = (m) => Array.from({ length: m.photos || 0 }, (_, i) => `/images/events/${m.id}/${i + 1}.webp`);

export function initMissions() {
  renderUpcoming();
  renderTimeline();
  initDossier();
}

function renderUpcoming() {
  const el = document.getElementById('upcoming');
  if (!el) return;
  const today = new Date().toISOString().slice(0, 10);
  const next = upcoming.filter((u) => u.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (next.length) {
    el.innerHTML = next.map((u) => `
      <div class="upcoming__card">
        <span class="blink" aria-hidden="true"></span>
        <div>
          <p class="eyebrow" style="margin:0">Next launch · ${e(u.type || 'Event')}</p>
          <h3>${e(u.title)}</h3>
          <p>${pretty(u.date)}${u.time ? ' · ' + e(u.time) : ''}${u.venue ? ' · ' + e(u.venue) : ''}</p>
        </div>
        ${u.link ? `<a class="btn btn--primary" href="${e(u.link)}" target="_blank" rel="noopener">Register →</a>` : ''}
      </div>`).join('');
  } else {
    el.innerHTML = `
      <div class="upcoming__card">
        <span class="blink" aria-hidden="true"></span>
        <div>
          <p class="eyebrow" style="margin:0">Next launch</p>
          <h3>Transmission incoming…</h3>
          <p>Our next mission is being prepared. Follow us so you don't miss the countdown.</p>
        </div>
        <a class="btn btn--ghost" href="${e(site.socials.instagram)}" target="_blank" rel="noopener">@seds_vitap →</a>
      </div>`;
  }
}

function renderTimeline() {
  const list = document.getElementById('timeline');
  if (!list) return;
  const items = sortedMissions();
  list.innerHTML = items.map((m) => {
    const { y, m: mo, d } = parse(m.date);
    return `
    <li class="mission-item reveal">
      <span class="mission-item__node" aria-hidden="true"></span>
      <div class="mission-item__date">
        <span>${e(m.code)} · ${MONTHS[mo - 1]} ${y}</span>
        <strong>${String(d).padStart(2, '0')}.${String(mo).padStart(2, '0')}</strong>
      </div>
      <div>
        <button class="mission-card" data-id="${e(m.id)}" aria-haspopup="dialog">
          <div class="mission-card__img">
            <div class="mission-card__patch"><span class="tag tag--accent">${e(m.type)}</span><span class="tag">${e(m.code)}</span></div>
            <img src="${e(m.cover)}" alt="" loading="lazy" decoding="async" />
          </div>
          <div class="mission-card__body">
            <h3>${e(m.title)}</h3>
            <p>${e(m.summary)}</p>
            <span class="mission-card__more">Open dossier</span>
          </div>
        </button>
      </div>
    </li>`;
  }).join('');

  list.querySelectorAll('.mission-card').forEach((c) => tilt(c, 5));
  initReveals(list);

  // light up nodes + grow the beam as you scroll
  const nodesIO = new IntersectionObserver((entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add('is-in')), { rootMargin: '0px 0px -45% 0px' });
  list.querySelectorAll('.mission-item').forEach((li) => nodesIO.observe(li));
  const beam = document.getElementById('beam');
  const onScroll = () => {
    const r = list.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.55 - r.top) / r.height, 0), 1);
    beam.style.height = `${p * 100}%`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initDossier() {
  const dlg = document.getElementById('dossier');
  const body = document.getElementById('dossierBody');
  const car = document.getElementById('carousel');
  const count = document.getElementById('carCount');
  if (!dlg) return;
  let total = 0;

  const current = () => (car.clientWidth ? Math.round(car.scrollLeft / car.clientWidth) : 0);
  const updateCount = () => { count.textContent = `${String(current() + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`; };
  const go = (dir) => car.scrollTo({ left: (current() + dir + total) % total * car.clientWidth, behavior: 'smooth' });

  document.getElementById('carPrev').addEventListener('click', () => go(-1));
  document.getElementById('carNext').addEventListener('click', () => go(1));
  car.addEventListener('scroll', () => requestAnimationFrame(updateCount), { passive: true });
  document.getElementById('dossierClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') go(1);
    if (ev.key === 'ArrowLeft') go(-1);
  });
  dlg.addEventListener('close', () => document.body.style.removeProperty('overflow'));

  document.getElementById('timeline').addEventListener('click', (ev) => {
    const card = ev.target.closest('.mission-card');
    if (!card) return;
    const m = missions.find((x) => x.id === card.dataset.id);
    if (!m) return;
    const photos = [m.cover, ...photosOf(m)];
    total = photos.length;
    car.innerHTML = photos.map((src, i) => `<img src="${e(src)}" alt="${e(m.title)} — photo ${i + 1}" loading="${i < 2 ? 'eager' : 'lazy'}" />`).join('');
    car.scrollLeft = 0;
    body.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag tag--accent">${e(m.type)}</span><span class="tag">${e(m.code)}</span><span class="tag">${pretty(m.date)}</span></div>
      <h2 id="dossierTitle">${e(m.title)}</h2>
      <p class="tagline">${e(m.tagline)}</p>
      ${m.body.map((p) => `<p>${e(p)}</p>`).join('')}
      <dl class="dossier__meta">
        <div><dt>Speaker(s)</dt><dd>${e(m.speakers)}</dd></div>
        <div><dt>Organised by</dt><dd>${e(m.organizers)}</dd></div>
      </dl>`;
    document.body.style.overflow = 'hidden';
    dlg.showModal();
    updateCount();
    body.scrollTop = 0;
  });
}
