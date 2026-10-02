/**
 * MISSION LOG
 * ───────────
 * Add new events to the TOP of `missions` (newest first is not required —
 * the site sorts by date automatically).
 *
 *   id        – url-safe slug, also the folder name in /public/images/events/<id>/
 *   code      – short mission code shown on the patch (e.g. 'AUR-06')
 *   date      – 'YYYY-MM-DD'
 *   type      – 'Milestone' | 'Talk' | 'Guest Lecture' | 'Workshop' | 'Crew' | 'Discussion' | anything
 *   title, tagline, summary (card), body (dossier, array of paragraphs)
 *   speakers, organizers – strings
 *   cover     – card image
 *   photos    – number of photos in the folder, named 1.webp … N.webp
 *
 * `upcoming` is for announced events. Leave empty and the site shows a
 * "transmission incoming" card pointing to Instagram.
 */

export const upcoming = [
  // { title: 'Stargazing Night', date: '2026-11-14', time: '19:30', venue: 'AB-1 Rooftop', type: 'Observation', link: 'https://forms.gle/…' },
];

export const missions = [
  {
    id: 'inauguration',
    code: 'AUR-01',
    date: '2019-12-07',
    type: 'Milestone',
    title: 'Inauguration of the SEDS VIT-AP Chapter',
    tagline: "Here's to new beginnings.",
    summary:
      'The day it all started — SEDS VIT-AP was officially launched as a chapter of SEDS India.',
    body: [
      'Everything has a beginning, and ours was on the 7th of December 2019, when we established ourselves as the SEDS chapter at VIT-AP. SEDS VIT-AP is affiliated with SEDS India, headquartered at VIT Vellore.',
      "The Faculty Coordinator, President, Vice-President and Projects Head of SEDS India served as Chief Guests and, along with our dignitaries, inaugurated the club. Together with our faculty coordinator Dr. Sudhagar Jothi, they explained the club's vision, the roles of the Core, Project and Outreach teams, and encouraged everyone to join this massive expedition.",
    ],
    speakers: 'Chief Guests from SEDS India & our Faculty Coordinator',
    organizers: 'SEDS VIT-AP',
    cover: '/images/events/inauguration/cover.webp',
    photos: 7,
  },
  {
    id: 'black-holes',
    code: 'AUR-02',
    date: '2020-01-25',
    type: 'Talk',
    title: 'Black Holes',
    tagline: 'They ain’t as black as they are painted.',
    summary:
      'The origin, types and strange physics of black holes — from event horizons to singularities.',
    body: [
      '“Black holes ain’t as black as they are painted. They are not the eternal prisons they were once thought… things can get out of a black hole both on the outside and possibly to another universe. So if you feel you are in a black hole, don’t give up — there’s a way out.” — Stephen Hawking',
      'What happens when you fall into a black hole? Is it possible to pull something out of one? These and many more questions were answered at this on-campus event. The crux of the session was the reality of black holes: their formation, the event horizon, the singularity, and the different types of black holes.',
    ],
    speakers: 'Dheeraj Reddy & Avhijit Nair',
    organizers: 'SEDS VIT-AP',
    cover: '/images/events/black-holes/cover.webp',
    photos: 6,
  },
  {
    id: 'solar-physics',
    code: 'AUR-03',
    date: '2020-11-21',
    type: 'Guest Lecture',
    title: 'Computational Solar Physics',
    tagline: 'We have a universe within ourselves that mimics the universe outside.',
    summary:
      'A guest lecture by Dr. Piyali Chatterjee (IIA) on solar eruptive events, coronal holes and flares.',
    body: [
      '“Everyone is part of a connected cosmic system. Part earth and sea, wind and fire, with some salt and dust swimming in them. We have a universe within ourselves that mimics the universe outside.”',
      'The lecture by Dr. Piyali Chatterjee provided new insights into our evolving understanding of solar eruptive events. Aurora graphs, the solar base, research work at the Indian Institute of Astrophysics, ongoing and future Indian missions, coronal holes, solar flares and other solar phenomena were discussed.',
      'The event was conducted in collaboration with the Open Source Community (OSC) VIT-AP.',
    ],
    speakers: 'Dr. Piyali Chatterjee, Research Scientist, IIA',
    organizers: 'SEDS VIT-AP × Open Source Community',
    cover: '/images/events/solar-physics/cover.webp',
    photos: 7,
  },
  {
    id: 'orientation',
    code: 'AUR-04',
    date: '2020-11-28',
    type: 'Crew',
    title: 'Core Team Orientation',
    tagline: '3. 2. 1. Ignition. Lift off!',
    summary:
      'Welcoming the newly recruited core team — vision, roles, and a lot of ice-breakers.',
    body: [
      'The orientation programme for the newly recruited core team began with a brief inaugural ceremony in which the executive team reiterated the club’s vision and mission.',
      'Members introduced themselves, followed by an interactive ice-breaker session full of games. The Vice President then addressed the team about their respective roles and responsibilities.',
    ],
    speakers: 'SEDS Executive Team',
    organizers: 'SEDS VIT-AP',
    cover: '/images/events/orientation/cover.webp',
    photos: 7,
  },
  {
    id: 'yugen',
    code: 'AUR-05',
    date: '2021-02-15',
    type: 'Discussion',
    title: 'YUGEN',
    tagline:
      'From earthbound mortals to extragalactic wayfarers of the star-spangled cosmos.',
    summary:
      'How likely are we to settle on the Moon and Mars? Plus a deep-dive into the Monolith Mystery.',
    body: [
      'How likely are we to settle on Mars and the Moon in the near future? The factors that currently favour human settlement on both worlds were discussed, and the topic was dissected to arrive at a reasonable conclusion about the future of human space colonisation.',
      'A few interesting facts were also presented, along with an analysis of the then-recent “Monolith Mystery”.',
    ],
    speakers: 'Avhijit Nair & Taha Junaid',
    organizers: 'SEDS VIT-AP',
    cover: '/images/events/yugen/cover.webp',
    photos: 6,
  },
];
