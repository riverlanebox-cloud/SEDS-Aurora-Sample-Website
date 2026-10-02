/** Divisions orbit — click a planet to swap the panel. */
const DIVISIONS = {
  core: {
    n: '01',
    title: 'Core',
    accent: 'linear-gradient(120deg, #5fb8ff, #7c5cff)',
    text: "Our Core team lives by one mantra: learning. They run the club's engine — guest lectures, talks, workshops, stargazing sessions and the events that bring space science to everyone on campus.",
    chips: ['Events', 'Guest lectures', 'Design', 'Documentation', 'Content'],
  },
  projects: {
    n: '02',
    title: 'Projects',
    accent: 'linear-gradient(120deg, #38f9c1, #5fb8ff)',
    text: 'The builders. The Projects team designs and builds hardware — starting with a state-of-the-art rover — across software, electrical and mechanical sub-teams. If you like turning CAD into something that drives, this is your orbit.',
    chips: ['Rover', 'Software', 'Electrical', 'Mechanical', 'Competitions'],
  },
  outreach: {
    n: '03',
    title: 'Outreach',
    accent: 'linear-gradient(120deg, #ff5fd2, #7c5cff)',
    text: 'Our voice beyond campus. Outreach brings in sponsorships for projects, runs our social channels, and collaborates with SEDS chapters and space clubs across the country.',
    chips: ['Sponsorships', 'Social media', 'Collaborations', 'SEDS India network'],
  },
};

export function initOrbit() {
  const sys = document.getElementById('orbitSystem');
  const panel = document.getElementById('orbitPanel');
  if (!sys || !panel) return;
  const eyebrow = document.getElementById('divEyebrow');
  const title = document.getElementById('divTitle');
  const text = document.getElementById('divText');
  const chips = document.getElementById('divChips');
  const planets = sys.querySelectorAll('.planet');

  const show = (key) => {
    const d = DIVISIONS[key];
    planets.forEach((p) => {
      const on = p.dataset.division === key;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-pressed', String(on));
    });
    panel.style.setProperty('--panel-accent', d.accent);
    eyebrow.textContent = `Division ${d.n} · ${d.title}`;
    title.textContent = d.title;
    text.textContent = d.text;
    chips.innerHTML = d.chips.map((c) => `<li>${c}</li>`).join('');
    panel.classList.remove('is-swapping');
    void panel.offsetWidth;
    panel.classList.add('is-swapping');
  };

  planets.forEach((p) => p.addEventListener('click', () => { show(p.dataset.division); sys.classList.add('is-paused'); }));
  sys.addEventListener('pointerleave', () => sys.classList.remove('is-paused'));
  show('core');
}
