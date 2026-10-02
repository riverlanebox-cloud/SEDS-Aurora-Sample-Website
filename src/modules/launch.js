/** Hold-to-launch button + Konami-code easter egg. */
import { site } from '../data/site.js';
import { toast } from './ui.js';

const HOLD_MS = 1400;
const CIRC = 2 * Math.PI * 54;

export function launchRocket(onDone) {
  const rocket = document.getElementById('rocket');
  if (!rocket) return onDone?.();
  rocket.classList.remove('is-flying');
  void rocket.offsetWidth;
  rocket.classList.add('is-flying');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('div');
      s.className = 'smoke';
      s.style.left = `calc(50% - 20px + ${(Math.random() - 0.5) * 60}px)`;
      s.style.bottom = '0px';
      s.style.setProperty('--dx', `${(Math.random() - 0.5) * 260}px`);
      s.style.setProperty('--dy', `${-Math.random() * 80}px`);
      s.style.animationDelay = `${i * 40}ms`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 2400);
    }
  }
  setTimeout(() => { rocket.classList.remove('is-flying'); onDone?.(); }, 2300);
}

export function initLaunch() {
  const btn = document.getElementById('launchBtn');
  const prog = document.getElementById('launchProgress');
  const label = document.getElementById('launchLabel');
  if (!btn) return;
  prog.style.strokeDasharray = CIRC;
  prog.style.strokeDashoffset = CIRC;

  let start = 0, raf = 0, launched = false;
  const reset = () => {
    cancelAnimationFrame(raf);
    btn.classList.remove('is-holding', 'is-shaking');
    if (!launched) { prog.style.strokeDashoffset = CIRC; label.innerHTML = 'Hold to<br>launch'; }
  };
  const step = (now) => {
    const k = Math.min((now - start) / HOLD_MS, 1);
    prog.style.strokeDashoffset = CIRC * (1 - k);
    label.innerHTML = k < 1 ? `T-${Math.ceil((1 - k) * 3)}` : 'Lift-off!';
    if (k > 0.6) btn.classList.add('is-shaking');
    if (k < 1) raf = requestAnimationFrame(step);
    else fire();
  };
  const begin = (ev) => {
    if (launched) return;
    ev?.preventDefault?.();
    start = performance.now();
    btn.classList.add('is-holding');
    raf = requestAnimationFrame(step);
  };
  const fire = () => {
    launched = true;
    btn.classList.remove('is-shaking', 'is-holding');
    toast('🚀 Lift-off! Opening a channel to mission control…');
    launchRocket(() => {
      location.href = `mailto:${site.email}?subject=${encodeURIComponent('I want to join SEDS Aurora')}&body=${encodeURIComponent('Hi SEDS Aurora team,\n\nName:\nYear & branch:\nDivision I\'m interested in (Core / Projects / Outreach):\nWhy space excites me:\n')}`;
      setTimeout(() => { launched = false; reset(); }, 800);
    });
  };

  btn.addEventListener('pointerdown', begin);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => btn.addEventListener(t, reset));
  btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) begin(e); });
  btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') reset(); });
  btn.addEventListener('contextmenu', (e) => e.preventDefault());

  // Konami code
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : k === code[0] ? 1 : 0;
    if (pos === code.length) {
      pos = 0;
      document.documentElement.style.setProperty('filter', 'hue-rotate(140deg)');
      launchRocket(() => document.documentElement.style.removeProperty('filter'));
      toast('Achievement unlocked: Hyperspace jump 🌌', 4000);
    }
  });
}
