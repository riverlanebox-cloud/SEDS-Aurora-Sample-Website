/** Sky Live: ISS tracker on a dot-matrix globe, Moon phase, rotating space facts. */
import { site } from '../data/site.js';
import { facts } from '../data/facts.js';

const DEG = Math.PI / 180;
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
// Natural Earth land outlines (public domain) via the world-atlas package on jsDelivr.
const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

export function initSky() {
  initMoon();
  initFacts();
  initISS();
}

/* ======================================================================
   MOON PHASE — computed locally from the mean synodic month.
   ====================================================================== */
const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // 6 Jan 2000 18:14 UTC

export function moonPhase(date = new Date()) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const f = age / SYNODIC;
  const illum = (1 - Math.cos(2 * Math.PI * f)) / 2;
  // Principal phases get a ±1 day window; everything else is crescent/gibbous.
  const near = (target) => Math.abs(age - target) < 1 || Math.abs(age - target - SYNODIC) < 1;
  let name;
  if (near(0)) name = 'New Moon';
  else if (near(SYNODIC / 4)) name = 'First Quarter';
  else if (near(SYNODIC / 2)) name = 'Full Moon';
  else if (near((3 * SYNODIC) / 4)) name = 'Last Quarter';
  else if (f < 0.25) name = 'Waxing Crescent';
  else if (f < 0.5) name = 'Waxing Gibbous';
  else if (f < 0.75) name = 'Waning Gibbous';
  else name = 'Waning Crescent';
  return { age, f, illum, name };
}

function moonPath(f, R = 80, cx = 100, cy = 100) {
  const k = Math.cos(2 * Math.PI * f);
  const rx = Math.abs(k) * R;
  const waxing = f < 0.5;
  const outerSweep = waxing ? 1 : 0;
  const crescent = k > 0;
  const innerSweep = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
  return `M ${cx} ${cy - R} A ${R} ${R} 0 0 ${outerSweep} ${cx} ${cy + R} A ${rx} ${R} 0 0 ${innerSweep} ${cx} ${cy - R} Z`;
}

function initMoon() {
  const svg = document.getElementById('moonSvg');
  if (!svg) return;
  const { age, f, illum, name } = moonPhase();
  const craters = [[78, 70, 12], [120, 88, 9], [96, 128, 14], [132, 130, 7], [70, 112, 6], [112, 60, 5]];
  svg.innerHTML = `
    <defs>
      <radialGradient id="moonLit" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#dfe3f5"/><stop offset="1" stop-color="#aab0cc"/></radialGradient>
      <clipPath id="moonClip"><path d="${moonPath(f)}"/></clipPath>
    </defs>
    <circle cx="100" cy="100" r="80" fill="#14172f" stroke="rgba(150,160,255,.25)"/>
    <g clip-path="url(#moonClip)">
      <circle cx="100" cy="100" r="80" fill="url(#moonLit)"/>
      ${craters.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(120,128,165,.28)"/>`).join('')}
    </g>`;
  document.getElementById('moonName').textContent = name;
  document.getElementById('moonIllum').textContent = `${Math.round(illum * 100)}%`;
  document.getElementById('moonAge').textContent = age.toFixed(1);

  // next full / new moon
  const toFull = ((0.5 - f + 1) % 1) * SYNODIC;
  const toNew = ((1 - f) % 1) * SYNODIC;
  const nextIsFull = toFull < toNew;
  const days = nextIsFull ? toFull : toNew;
  const when = new Date(Date.now() + days * 86400000);
  const label = when.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  document.getElementById('moonNext').textContent = `${nextIsFull ? 'Full' : 'New'} Moon in ${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'} · around ${label}${nextIsFull ? '' : ' — great for stargazing'}`;
}

/* ======================================================================
   FACTS
   ====================================================================== */
function initFacts() {
  const el = document.getElementById('factText');
  const hud = document.getElementById('heroFact');
  const btn = document.getElementById('nextFact');
  if (!el) return;
  let i = Math.floor(Math.random() * facts.length);
  const show = () => {
    el.classList.add('is-out');
    setTimeout(() => { el.textContent = facts[i % facts.length]; el.classList.remove('is-out'); }, 300);
  };
  el.textContent = facts[i % facts.length];
  if (hud) hud.textContent = `▸ ${facts[(i + 3) % facts.length]}`;
  btn?.addEventListener('click', () => { i++; show(); });
  setInterval(() => { if (!document.hidden) { i++; show(); } }, 12000);
}

/* ======================================================================
   ISS TRACKER
   ====================================================================== */
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * DEG;
  const dLon = (b.lon - a.lon) * DEG;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Decode a TopoJSON object into an array of rings ([[lon, lat], …]). */
function topoRings(topo, objectName) {
  const { scale, translate } = topo.transform || { scale: [1, 1], translate: [0, 0] };
  const arcs = topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      if (topo.transform) { x += dx; y += dy; } else { x = dx; y = dy; }
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
  const ring = (idx) => {
    const pts = [];
    idx.forEach((i, n) => {
      const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
      pts.push(...(n ? a.slice(1) : a));
    });
    return pts;
  };
  const out = [];
  const walk = (g) => {
    if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
    else if (g.type === 'Polygon') g.arcs.forEach((r) => out.push(ring(r)));
    else if (g.type === 'MultiPolygon') g.arcs.forEach((p) => p.forEach((r) => out.push(ring(r))));
  };
  walk(topo.objects[objectName]);
  return out;
}

/** Rasterise land rings to an equirectangular canvas and sample a dot grid. */
function landDots(rings, step = 2.2) {
  const W = 720, H = 360;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.beginPath();
  rings.forEach((r) => {
    r.forEach(([lon, lat], i) => {
      const x = ((lon + 180) / 360) * W;
      const y = ((90 - lat) / 180) * H;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    });
    g.closePath();
  });
  g.fill('evenodd');
  const data = g.getImageData(0, 0, W, H).data;
  const dots = [];
  for (let lat = -84; lat <= 84; lat += step) {
    const lonStep = step / Math.max(Math.cos(lat * DEG), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      const x = Math.floor(((lon + 180) / 360) * W);
      const y = Math.floor(((90 - lat) / 180) * H);
      const land = data[(y * W + x) * 4] > 127 || lat < -72;
      if (land) dots.push([lat, lon]);
    }
  }
  // sanity check: Earth is ~29% land. If the fill went wrong, fall back to wireframe.
  const total = (168 / step) * (360 / step) * 0.64;
  return dots.length > total * 0.6 ? [] : dots;
}

function initISS() {
  const canvas = document.getElementById('issGlobe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('issStatus');
  const out = {
    lat: document.getElementById('issLat'),
    lon: document.getElementById('issLon'),
    alt: document.getElementById('issAlt'),
    vel: document.getElementById('issVel'),
    dist: document.getElementById('issDist'),
  };
  const home = site.coords;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dpr = Math.min(devicePixelRatio || 1, 2);
  let size = 0;
  const resize = () => {
    size = canvas.clientWidth || 440;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  let land = [];
  fetch(LAND_URL)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((topo) => { land = landDots(topoRings(topo, 'land')); })
    .catch(() => {});

  const state = { iss: null, trail: [], lon0: home.lon, lat0: 12, live: false };

  const project = (lat, lon, R, cx, cy) => {
    const φ = lat * DEG, λ = lon * DEG, φ0 = state.lat0 * DEG, λ0 = state.lon0 * DEG;
    const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ - λ0);
    const x = R * Math.cos(φ) * Math.sin(λ - λ0);
    const y = R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ - λ0));
    return { x: cx + x, y: cy - y, visible: cosc > 0, depth: cosc };
  };

  const draw = (t) => {
    const W = size, cx = W / 2, cy = W / 2, R = W * 0.4;
    ctx.clearRect(0, 0, W, W);

    // atmosphere glow
    const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    glow.addColorStop(0, 'rgba(95,184,255,.25)');
    glow.addColorStop(1, 'rgba(95,184,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();

    // sphere
    const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, '#1a2050');
    body.addColorStop(1, '#070918');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(150,160,255,.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // graticule
    ctx.strokeStyle = 'rgba(150,160,255,.10)';
    ctx.lineWidth = 0.8;
    const line = (pts) => {
      ctx.beginPath();
      let pen = false;
      pts.forEach(([la, lo]) => {
        const p = project(la, lo, R, cx, cy);
        if (!p.visible) { pen = false; return; }
        pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        pen = true;
      });
      ctx.stroke();
    };
    for (let lo = -180; lo < 180; lo += 20) line(Array.from({ length: 61 }, (_, i) => [-90 + i * 3, lo]));
    for (let la = -60; la <= 60; la += 20) line(Array.from({ length: 121 }, (_, i) => [la, -180 + i * 3]));

    // land dots
    if (land.length) {
      for (const [la, lo] of land) {
        const p = project(la, lo, R, cx, cy);
        if (!p.visible) continue;
        ctx.fillStyle = `rgba(56,249,193,${0.15 + p.depth * 0.55})`;
        ctx.fillRect(p.x - 0.9, p.y - 0.9, 1.8, 1.8);
      }
    }

    // home: VIT-AP
    const h = project(home.lat, home.lon, R, cx, cy);
    if (h.visible) {
      const pulse = reduced ? 0 : (t / 1000) % 1.6 / 1.6;
      ctx.strokeStyle = `rgba(255,95,210,${1 - pulse})`;
      ctx.beginPath(); ctx.arc(h.x, h.y, 4 + pulse * 14, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ff5fd2';
      ctx.beginPath(); ctx.arc(h.x, h.y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(238,241,255,.85)';
      ctx.fillText('VIT-AP', h.x + 8, h.y + 3);
    }

    // ISS trail + marker
    if (state.iss) {
      ctx.lineWidth = 1.5;
      for (let i = 1; i < state.trail.length; i++) {
        const a = project(state.trail[i - 1].lat, state.trail[i - 1].lon, R * 1.06, cx, cy);
        const b = project(state.trail[i].lat, state.trail[i].lon, R * 1.06, cx, cy);
        if (!a.visible || !b.visible || Math.abs(state.trail[i].lon - state.trail[i - 1].lon) > 180) continue;
        ctx.strokeStyle = `rgba(56,249,193,${(i / state.trail.length) * 0.9})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const s = project(state.iss.lat, state.iss.lon, R * 1.06, cx, cy);
      if (s.visible) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 18);
        g.addColorStop(0, 'rgba(255,255,255,.9)');
        g.addColorStop(1, 'rgba(56,249,193,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(s.x - 7, s.y - 1, 14, 2); // solar panels
        ctx.fillRect(s.x - 1.5, s.y - 3, 3, 6);
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('ISS', s.x + 10, s.y - 8);
      }
    }
  };

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  const loop = (t) => {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    // ease the globe to keep the ISS centred; idle-spin when offline
    const target = state.iss ? state.iss.lon : state.lon0 + (reduced ? 0 : 0.08);
    let d = target - state.lon0;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    state.lon0 += state.iss ? d * 0.04 : d;
    const targetLat = state.iss ? Math.max(Math.min(state.iss.lat, 35), -35) : 12;
    state.lat0 += (targetLat - state.lat0) * 0.03;
    draw(t);
  };
  requestAnimationFrame(loop);

  const setStatus = (cls, txt) => {
    status.className = `status ${cls}`;
    status.innerHTML = `<i></i>${txt}`;
  };

  let fails = 0;
  let timer;
  const poll = async () => {
    clearTimeout(timer);
    if (!visible || document.hidden) { timer = setTimeout(poll, 2000); return; }
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 6000);
      const r = await fetch(ISS_API, { signal: ctrl.signal, cache: 'no-store' });
      clearTimeout(to);
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      fails = 0;
      state.iss = { lat: d.latitude, lon: d.longitude };
      state.trail.push(state.iss);
      if (state.trail.length > 90) state.trail.shift();
      const km = haversine(home, state.iss);
      out.lat.textContent = `${Math.abs(d.latitude).toFixed(2)}° ${d.latitude >= 0 ? 'N' : 'S'}`;
      out.lon.textContent = `${Math.abs(d.longitude).toFixed(2)}° ${d.longitude >= 0 ? 'E' : 'W'}`;
      out.alt.textContent = `${d.altitude.toFixed(0)} km`;
      out.vel.textContent = `${Math.round(d.velocity).toLocaleString('en-IN')} km/h`;
      out.dist.textContent = km < 2200 ? `${Math.round(km).toLocaleString('en-IN')} km — look up!` : `${Math.round(km).toLocaleString('en-IN')} km`;
      setStatus('is-live', d.visibility === 'daylight' ? 'Live · in sunlight' : 'Live · in Earth’s shadow');
      timer = setTimeout(poll, 5000);
    } catch {
      fails++;
      setStatus('is-off', fails > 2 ? 'Telemetry offline' : 'Reconnecting');
      timer = setTimeout(poll, Math.min(5000 * 2 ** fails, 60000));
    }
  };
  poll();
}
