/** Small static bits rendered from data: coordinator, newsletters, footer. */
import { site } from '../data/site.js';
import { facultyCoordinator as fc } from '../data/team.js';
import { newsletters } from '../data/newsletters.js';
import { icons } from './icons.js';
import { escapeHTML as e } from './ui.js';

export function initContent() {
  const co = document.getElementById('coordinator');
  if (co && fc) {
    co.innerHTML = `
      ${fc.photo ? `<img src="${e(fc.photo)}" alt="${e(fc.name)}" loading="lazy" width="84" height="84" />` : ''}
      <div>
        <p class="eyebrow" style="margin-bottom:6px">${e(fc.role)}</p>
        <h3>${e(fc.name)}</h3>
        <p>${[fc.school && `School: ${fc.school}`, fc.cabin].filter(Boolean).map(e).join(' · ')}</p>
      </div>`;
  }

  const tx = document.getElementById('txList');
  if (tx) {
    tx.innerHTML = newsletters.map((n) => {
      const inner = `
        ${n.cover ? `<img class="tx__cover" src="${e(n.cover)}" alt="" loading="lazy" />` : ''}
        <span class="eyebrow" style="margin:0">Transmission</span>
        <span class="tx__month">${e(n.month)}</span>
        <span class="tx__title">${e(n.title)}</span>
        <span class="tx__cta ${n.link ? '' : 'tx__cta--soon'}">${n.link ? 'Read edition →' : 'Uploading soon'}</span>`;
      return n.link
        ? `<li><a class="tx" href="${e(n.link)}" target="_blank" rel="noopener">${inner}</a></li>`
        : `<li><div class="tx">${inner}</div></li>`;
    }).join('') + `
      <li><a class="tx" href="${e(site.socials.instagram)}" target="_blank" rel="noopener">
        <span class="eyebrow" style="margin:0">Subscribe</span>
        <span class="tx__month">Never miss one</span>
        <span class="tx__title">New editions drop on our Instagram every month.</span>
        <span class="tx__cta">Follow @seds_vitap →</span>
      </a></li>`;
  }

  document.getElementById('footerAddress').textContent = site.address;
  const mail = document.getElementById('footerEmail');
  mail.href = `mailto:${site.email}`;
  mail.textContent = site.email;
  document.getElementById('footerSocials').innerHTML = Object.entries(site.socials)
    .map(([k, url]) => `<a href="${e(url)}" target="_blank" rel="noopener" aria-label="SEDS VIT-AP on ${k}">${icons[k] || ''}</a>`)
    .join('') + `<a href="mailto:${e(site.email)}" aria-label="Email us">${icons.mail}</a>`;
  document.getElementById('year').textContent = new Date().getFullYear();
}
