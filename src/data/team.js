/**
 * CREW MANIFEST
 * ─────────────
 * `currentCrew` → the active team. Fill this in every academic year.
 *   When it's empty, the site shows a friendly "manifest updating" note
 *   and opens the Legacy tab by default.
 *
 * Each member:
 *   name      – full name
 *   role      – e.g. 'President', 'Software Lead'
 *   division  – 'Core' | 'Projects' | 'Outreach'
 *   photo     – path inside /public (e.g. '/images/team/jane.webp') or null for an initials avatar
 *   links     – any of: linkedin, github, instagram, twitter, facebook, website
 *
 * Tip: square-ish portraits (~480×560) in .webp keep the site fast.
 */

export const facultyCoordinator = {
  name: 'Dr. Sudhagar J',
  role: 'Faculty Coordinator',
  school: 'SSL',
  cabin: 'Cabin 153, Faculty Area-4, AB-1',
  photo: '/images/team/sudhagar.webp',
};

export const currentTenure = '2026–27';

export const currentCrew = [
  // { name: 'Your Name', role: 'President', division: 'Core', photo: '/images/team/your-name.webp', links: { linkedin: 'https://…' } },
];

export const legacyTenure = '2020–21';

export const legacyCrew = [
  { name: 'Dheeraj Reddy', role: 'President', division: 'Core', photo: '/images/team/dheeraj.webp', links: { facebook: 'https://www.facebook.com/dheeraj.revoori', twitter: 'https://twitter.com/dheerajrevoori', linkedin: 'https://www.linkedin.com/in/dheeraj-reddy-3480a01a6/', instagram: 'https://www.instagram.com/dheeraj_reddy26/' } },
  { name: 'Taha Junaid', role: 'Vice President', division: 'Core', photo: '/images/team/taha.webp', links: { linkedin: 'https://www.linkedin.com/in/taha-junaid-97b009181/', instagram: 'https://www.instagram.com/tjeology/' } },
  { name: 'Avhijit Nair', role: 'Treasurer', division: 'Core', photo: '/images/team/avhijith.webp', links: { twitter: 'https://twitter.com/AvhijitNair', linkedin: 'https://www.linkedin.com/in/avhijit007/', instagram: 'https://www.instagram.com/avhijit007/', github: 'https://github.com/Avhijit-codeboy' } },
  { name: 'Neeraj Guntuku', role: 'Event Manager', division: 'Core', photo: '/images/team/neeraj.webp', links: { facebook: 'https://www.facebook.com/natty77nicky/', linkedin: 'https://www.linkedin.com/in/neeraj-guntuku', instagram: 'https://www.instagram.com/nicky_.1677/', github: 'https://github.com/nicky1677web' } },
  { name: 'Abhigyan Nayak', role: 'Design Team', division: 'Core', photo: '/images/team/abhigyan.webp', links: { linkedin: 'https://www.linkedin.com/in/abhigyan-nayak-6b27231b8/' } },
  { name: 'Ramya Sri Devi', role: 'Design Team', division: 'Core', photo: null, links: {  } },
  { name: 'Sowmya Eemani', role: 'Documentation Lead', division: 'Core', photo: '/images/team/eemani.webp', links: {  } },
  { name: 'Salma', role: 'Content Writer', division: 'Core', photo: '/images/team/salma.webp', links: { linkedin: 'https://www.linkedin.com/in/salma7', github: 'https://github.com/IdealisticINTJ' } },
  { name: 'P. Bhanoday Reddy', role: 'Content Writer', division: 'Core', photo: '/images/team/bhanoday.webp', links: { facebook: 'https://www.facebook.com/bhanodayreddy.panyala/', linkedin: 'https://www.linkedin.com/in/bhanoday-reddy-panyala-395b361b7/', instagram: 'https://www.instagram.com/bhanoday_reddy/', github: 'https://github.com/BhanodayReddy' } },
  { name: 'P V Tharun', role: 'Captain', division: 'Projects', photo: '/images/team/tharun.webp', links: { facebook: 'https://www.facebook.com/tharun.pv.1', linkedin: 'https://www.linkedin.com/in/p-v-tharun-b3630719b', instagram: 'https://instagram.com/b.o.r.n_to_impress?igshid=nncrxrcr2jo4', github: 'https://github.com/PVTHARUN' } },
  { name: 'G Suprajith', role: 'Vice Captain', division: 'Projects', photo: '/images/team/suprajith.webp', links: { linkedin: 'https://www.linkedin.com/in/suprajith-g', instagram: 'https://instagram.com/suprajith_g?igshid=9qwfzhvcx3y2' } },
  { name: 'Shaik Sameeruddin', role: 'Software Lead', division: 'Projects', photo: '/images/team/sameer.webp', links: { twitter: 'https://twitter.com/SHAIKSAMEER2407', linkedin: 'https://linkedin.com/in/shaik-sameeruddin-baa421171//', github: 'https://github.com/sonusameer' } },
  { name: 'Madhava Varma', role: 'Software Team', division: 'Projects', photo: '/images/team/me2.webp', links: { facebook: 'https://www.facebook.com/bindumadhava.varma/', twitter: 'https://twitter.com/CBindhuMadhava2', linkedin: 'https://www.linkedin.com/in/bindhu-madhav-varma-c-58140b1aa/', github: 'https://github.com/BINDHUMADHAVAVARMA' } },
  { name: 'Aayush Anand', role: 'Software Team', division: 'Projects', photo: '/images/team/anand.webp', links: { twitter: 'https://twitter.com/AayushA50950180?s=08', linkedin: 'https://www.linkedin.com/in/aayush-anand-9397981b1', instagram: 'https://www.instagram.com/aayush.s.2014/', github: 'https://github.com/AayushAnand07' } },
  { name: 'M Sri Sesha Sai Manoj', role: 'Electrical Lead', division: 'Projects', photo: '/images/team/manoj.webp', links: { facebook: 'https://www.facebook.com/sai.manoj.9440', twitter: 'https://twitter.com/Manoj53333462', linkedin: 'https://www.linkedin.com/in/manoj-mathukumalli-sri-sesha-sai-31a20016a/', github: 'https://github.com/msssmanoj9' } },
  { name: 'Prudhvi Charan', role: 'Electrical Team', division: 'Projects', photo: null, links: {  } },
  { name: 'Mohammed Hisham Ullah Khan', role: 'Electrical Team', division: 'Projects', photo: '/images/team/hisham.webp', links: {  } },
  { name: 'M B Sri Harsha', role: 'Mechanical Lead', division: 'Projects', photo: '/images/team/harsha.webp', links: { facebook: 'https://www.facebook.com/sriharsha.mitthipati', linkedin: 'https://www.linkedin.com/in/sri-harsha-mitthipati-9210861a8', instagram: 'https://instagram.com/sri_harsha_mitthipati?igshid=c27fmxk3mhp8' } },
  { name: 'Hitesh Kodavatikanti', role: 'Mechanical Team', division: 'Projects', photo: '/images/team/hithesh.webp', links: { linkedin: 'https://www.linkedin.com/in/hitesh-k-738b351b1/', instagram: 'https://www.instagram.com/h.kodavatikanti/' } },
  { name: 'Ajay Rohit', role: 'Mechanical Team', division: 'Projects', photo: '/images/team/rohith.webp', links: { linkedin: 'https://www.linkedin.com/in/ajayrohit/', instagram: 'https://www.instagram.com/ajayrohitk/' } },
  { name: 'Sai Abhishek', role: 'Outreach Manager', division: 'Outreach', photo: '/images/team/abhishek.webp', links: { linkedin: 'https://www.linkedin.com/in/sai-abhishek-itta-47982547/', instagram: 'https://www.instagram.com/i_sai_abhishek/' } },
  { name: 'A. Teja Srinivas', role: 'Social Media Manager', division: 'Outreach', photo: '/images/team/teja.webp', links: { facebook: 'https://www.facebook.com/profile.php?id=100035094375225', twitter: 'https://twitter.com/AnemTeja?s=09', linkedin: 'https://www.linkedin.com/in/teja-srinivas-anem-0118a8199', instagram: 'https://www.instagram.com/_tejamarvels01_/' } },
  { name: 'Rithvik Kaza', role: 'Outreach Internal Lead', division: 'Outreach', photo: '/images/team/rithvik.webp', links: { facebook: 'https://www.facebook.com/rithvik.kaza', instagram: 'https://instagram.com/_im__rithvik?igshid=h7fjtoghn1f0' } },
  { name: 'Mahika Reddy', role: 'Outreach Internal Team', division: 'Outreach', photo: '/images/team/mahika.webp', links: { facebook: 'https://www.facebook.com/dodda.mahika.3', linkedin: 'https://www.linkedin.com/in/mahika-dodda-984503180', instagram: 'https://www.instagram.com/mahika_0709/' } },
  { name: 'Shubham Mallya', role: 'Outreach Internal Team', division: 'Outreach', photo: '/images/team/shubham.webp', links: { linkedin: 'https://www.linkedin.com/in/shubhammallya/?trk=public_profile-settings_edit-profile-content&originalSubdomain=in', github: 'https://github.com/shubham19bce7278' } },
  { name: 'Kantamneni Krishna Lohith', role: 'Outreach External Lead', division: 'Outreach', photo: '/images/team/lohith.webp', links: { instagram: 'https://www.instagram.com/namenot_identified/' } },
  { name: 'Nrupen Chakravarthi', role: 'Outreach External', division: 'Outreach', photo: '/images/team/nrupen.webp', links: { facebook: 'https://m.facebook.com/nrupen.chakravarthi.9', linkedin: 'https://www.linkedin.com/in/nrupen-madala-ba7540149', instagram: 'https://www.instagram.com/nrupen___madala/' } },
  { name: 'Yogendra V.V.N.S.P.', role: 'Outreach External', division: 'Outreach', photo: '/images/team/yogendra.webp', links: { facebook: 'https://www.facebook.com/vvnspyogendra/', linkedin: 'https://www.linkedin.com/in/vvnsp-yogendra-469083174', instagram: 'https://instagram.com/yogendra_vutukuri?igshid=1dkxehq4i4gfd' } },
];
