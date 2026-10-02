/** Crew manifest: tenure tabs + division filters + holo badges. */
import { currentCrew, legacyCrew, currentTenure, legacyTenure } from '../data/team.js';
import { icons } from './icons.js';
import { escapeHTML as e, tilt } from './ui.js';

const ORDER = ['Core', 'Projects', 'Outreach'];
const initials = (n) => n.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, '').split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export function initCrew() {
  const grid = document.getElementById('crewGrid');
  const note = document.getElementById('crewNote');
  const tabs = document.querySelectorAll('.tab');
  const chips = document.querySelectorAll('#crewFilters .chip');
  if (!grid) return;

  let tenure = currentCrew.length ? 'current' : 'legacy';
  let filter = 'all';

  const badge = (m, i) => {
    const links = Object.entries(m.links || {})
      .filter(([k]) => icons[k])
      .map(([k, url]) => `<a href="${e(url)}" target="_blank" rel="noopener" aria-label="${e(m.name)} on ${k}">${icons[k]}</a>`)
      .join('');
    return `
      <li class="badge" style="animation-delay:${Math.min(i, 12) * 45}ms">
        <div class="badge__photo">
          ${m.photo ? `<img src="${e(m.photo)}" alt="${e(m.name)}" loading="lazy" decoding="async" />` : `<div class="badge__initials" aria-hidden="true">${initials(m.name)}</div>`}
          <span class="tag badge__div">${e(m.division)}</span>
        </div>
        <div class="badge__body">
          <h3>${e(m.name)}</h3>
          <p>${e(m.role)}</p>
          ${links ? `<div class="badge__links">${links}</div>` : ''}
        </div>
      </li>`;
  };

  const render = () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tenure === tenure)));
    chips.forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter));
    const list = (tenure === 'current' ? currentCrew : legacyCrew)
      .filter((m) => filter === 'all' || m.division === filter)
      .sort((a, b) => ORDER.indexOf(a.division) - ORDER.indexOf(b.division));

    if (tenure === 'current' && !currentCrew.length) {
      note.innerHTML = '';
      grid.innerHTML = `
        <li class="crew__empty">
          <h3>Crew manifest ${e(currentTenure)} — updating</h3>
          <p>The current crew is being added. Meanwhile, meet the founding crew who started it all.</p>
          <button class="btn btn--ghost" data-goto="legacy" style="margin-top:12px">View legacy crew →</button>
        </li>`;
      grid.querySelector('[data-goto]').addEventListener('click', () => { tenure = 'legacy'; render(); });
      return;
    }
    note.innerHTML = tenure === 'legacy'
      ? `The <strong>${e(legacyTenure)}</strong> founding crew — the people who launched SEDS VIT-AP.`
      : `The <strong>${e(currentTenure)}</strong> crew.`;
    grid.innerHTML = list.map(badge).join('');
    grid.querySelectorAll('.badge').forEach((b) => tilt(b, 8));
  };

  tabs.forEach((t) => t.addEventListener('click', () => { tenure = t.dataset.tenure; render(); }));
  chips.forEach((c) => c.addEventListener('click', () => { filter = c.dataset.filter; render(); }));
  render();
}
