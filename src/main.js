import { initAurora } from './modules/aurora.js';
import {
  runPreloader, splitHeroTitle, initNav, initClocks, initAltimeter,
  initReveals, initCursor, initShootingStars,
} from './modules/ui.js';
import { initOrbit } from './modules/orbit.js';
import { initMissions } from './modules/missions.js';
import { initSky } from './modules/sky.js';
import { initCrew } from './modules/crew.js';
import { initGallery } from './modules/gallery.js';
import { initLaunch } from './modules/launch.js';
import { initContent } from './modules/content.js';

initAurora(document.getElementById('aurora'));
initNav();
initClocks();
initContent();
initOrbit();
initMissions();
initSky();
initCrew();
initGallery();
initLaunch();
initAltimeter();
initCursor();

runPreloader().then(() => {
  splitHeroTitle();
  initReveals();
  initShootingStars();
});

console.log(
  '%c SEDS Aurora %c Want to help build this site? Join the web team → space.club@vitap.ac.in',
  'background:linear-gradient(90deg,#38f9c1,#7c5cff);color:#04050d;font-weight:700;padding:4px 8px;border-radius:4px',
  'color:#8a90b6'
);
