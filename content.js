// All site copy lives here. Organizers: edit this file only.
// null = not decided yet; the site shows "TBA" for it.

export const event = {
  name: 'HackHCC Ctrl Z',
  school: 'Houston City College',
  hours: 24,
  start: null, // ISO date-time, e.g. '2027-03-06T09:00:00-06:00'. Drives the countdown and the live schedule row.
  dateLabel: null, // e.g. 'March 6–7, 2027'
  venue: null, // e.g. 'HCC Central Campus, Houston'
  registerUrl: null, // e.g. 'https://forms.gle/...'
  contactEmail: null, // e.g. 'hello@hackhcc.org'
};

export const about = {
  hook: '24 hours to build something. Break it? Ctrl+Z.',
  body: [
    'HackHCC Ctrl Z is a 24-hour hackathon at Houston City College. Students from any school team up, build a project from nothing, and present it when the clock runs out.',
    'The theme is undo: rewind an old idea, fix a broken one, or build the thing you wish had existed in 1995.',
  ],
};

// SAMPLE for the mockup, not decided: hour offsets from event.start. Replace when the real schedule is set.
export const schedule = [
  { hour: 0, title: 'Check-in', detail: '' },
  { hour: 1, title: 'Opening ceremony', detail: '' },
  { hour: 2, title: 'Hacking starts', detail: 'The 24-hour clock begins' },
  { hour: 6, title: 'Workshop block', detail: 'Topics TBA' },
  { hour: 8, title: 'Meal break', detail: 'Food details TBA' },
  { hour: 14, title: 'Late-night break', detail: 'Activity TBA' },
  { hour: 20, title: 'Meal break', detail: 'Food details TBA' },
  { hour: 22, title: 'Submissions due', detail: 'Ctrl+S, not Ctrl+Z' },
  { hour: 23, title: 'Demos and judging', detail: '' },
  { hour: 24, title: 'Awards and closing', detail: '' },
];

export const faq = [
  { q: 'What is a hackathon?', a: 'An event where you team up and build a project in a fixed time. Here that is 24 hours. You leave with something you made and people you met.' },
  { q: 'Who can join?', a: 'Students from any school, not only HCC. Exact eligibility rules will be posted when registration opens.' },
  { q: 'Do I need to know how to code?', a: 'No. Teams need designers, writers and people who ask good questions as much as programmers.' },
  { q: 'Does it cost anything?', a: 'TBA. Details come with registration.' },
  { q: 'Can I come without a team?', a: 'Yes. How team forming works will be announced (TBA).' },
  { q: 'What should I bring?', a: 'A laptop, a charger, and anything you need to be comfortable for 24 hours. A full list comes before the event.' },
];

export const rules = [
  'Build your project during the event. Planning and ideas beforehand are fine.',
  'Team size: TBA.',
  'Be kind. Harassment of any kind gets you removed.',
  'Full code of conduct will be published before registration opens.',
];

export const sponsors = []; // { name, url, logo } — logo path under /public
export const team = []; // { name, role }

// Desktop extras
export const watermark = { title: 'Activate Ctrl Z OS', line: 'Go to Register to activate Ctrl Z OS.' };

export const stickyNote = ['Register for HackHCC', 'Find a team (or don’t)', 'Close a window, press Ctrl+Z', 'Beat the high score in Bug Hunt'];

// Tray balloons, shown one at a time.
export const tips = [
  'Closed a window by mistake? Ctrl+Z brings it back.',
  'Right-click the desktop for more options.',
  'Type "help" in the Terminal to see every command.',
  'HackHCC Ctrl Z runs for 24 hours. Date and venue: TBA.',
  'Stay still for 45 seconds and see what happens.',
  'Students from any school can join.',
];
