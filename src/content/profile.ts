// Source of truth for every fact here: cv-master.md. Change the CV first, then this.

export interface Fact {
  value: string;
  label: string;
}

export interface Role {
  title: string;
  company: string;
  place?: string;
  start: string;
  end: string;
  // Short display code for the git-log styling; purely decorative.
  ref: string;
  summary: string;
  highlights?: string[];
  stack?: string;
}

export interface SkillGroup {
  key: string;
  label: string;
  items: string;
}

export interface Link {
  label: string;
  href: string;
  display: string;
}

export const profile = {
  name: 'Logan Alleyne',
  role: 'Full-stack software engineer',
  stack: 'PHP / Laravel · Python · Vue / TypeScript',
  summary:
    'Six years in software and a computer science degree focused on digital media. Most recently, one of two engineers who designed and built a suite of more than twenty Laravel applications that runs an engineering business end to end. Looking for roles in London or remote.',
  approach:
    'My background is front-end and UX, and it still shapes how I work: I care about interfaces that are clear and accessible, and about code the next developer can pick up without a guided tour. I write tests first, hold architectural boundaries with automated checks, and document decisions so a small team can move quickly without breaking things.',
  cv: '/logan-alleyne-cv.pdf',
};

export const facts: Fact[] = [
  { value: '20+', label: 'applications and services' },
  { value: '~40', label: 'users' },
  { value: '~£50m', label: 'business a year' },
  { value: '2', label: 'engineers' },
  { value: '93%', label: 'average test coverage' },
];

export const experience: Role[] = [
  {
    title: 'Software Engineer',
    company: 'Aspen Pumps',
    start: 'Jun 2025',
    end: 'now',
    ref: 'a3f9c21',
    summary:
      'Co-developer, in a team of two, of the FrameTech suite: web applications for CRM, enquiries, projects, engineering solution generators, sales and quoting, parts, finance, reporting, tasks, file storage and a helpdesk. Each runs on its own subdomain with its own deploy and its own database, built from the ground up for around 40 users and roughly £50m of business a year.',
    highlights: [
      'Co-designed the suite architecture: bounded applications with strict data ownership and versioned REST APIs across 20+ repositories.',
      'Built single sign-on across every subdomain, with passkeys (WebAuthn) as the primary sign-in and deny-by-default, role-based permissions.',
      'Designed service-to-service trust: HMAC-SHA256 request signing, replay protection and centrally managed permissions.',
      'Built for failure: idempotent writes, retries with backoff and dead-lettering, and imports that recover after a crash.',
      'Reworked the business’s 3D configurator in Vue 3, TypeScript, Three.js and Konva, with structural checks on a new calculation engine and DXF CAD output.',
      'Use Python in engineering pipelines: server-side drawing renders, CAD conversion, and reference implementations that validate the calculation engine in CI.',
      'Test-driven development with Pest and PHPStan level 7, CI with an 85% coverage floor, and a 70+ page engineering playbook.',
    ],
    stack: 'PHP 8.5, Laravel 13, Livewire, Vue 3, TypeScript, Three.js, Python, Tailwind CSS, MariaDB, Redis, Meilisearch, GitHub Actions',
  },
  {
    title: 'Software Engineer – Technical Production Manager',
    company: 'BrandStencil',
    place: 'Hove',
    start: 'Feb 2021',
    end: 'Jun 2025',
    ref: '7be04d8',
    summary:
      'Charity-focused templating and brand-management SaaS, in a small team. Led front-end development and design in Vue, Blade, SCSS and Tailwind CSS, with major improvements to UX and accessibility, and contributed to the Laravel, Node.js and MySQL back end. Led template development and ran template production: scheduling, estimating, hiring temporary team members and working directly with clients.',
    stack: 'Vue, Vuex, JavaScript, Node.js, Tailwind CSS, Laravel, PHP, Docker, AWS S3, MySQL',
  },
  {
    title: 'Junior Product Developer',
    company: 'ReedPop',
    place: 'Brighton',
    start: 'Jul 2020',
    end: 'Dec 2020',
    ref: '19d6e3a',
    summary:
      'Front-end developer across some of the largest video-game journalism sites in the world, including Eurogamer.net, RockPaperShotgun.com and VG247.com. Built features with Django templates, views and models, and worked on the online-only event PAX x EGX.',
    stack: 'Django, Python, WordPress, PHP, Docker',
  },
  {
    title: 'Technical Operator',
    company: 'The Edit_',
    place: 'Brighton',
    start: 'Sep 2019',
    end: 'Jul 2020',
    ref: '0c41b7e',
    summary: 'Assistant editing and technical support in television post-production, in a high-pressure, highly collaborative small team.',
  },
];

export const skills: SkillGroup[] = [
  { key: 'back_end', label: 'Back end', items: 'PHP 8.x, Laravel, Livewire, REST API design, Python, Node.js, MariaDB / MySQL, Redis, queues and scheduling, Meilisearch, websockets' },
  { key: 'front_end', label: 'Front end', items: 'TypeScript, JavaScript, Vue 3, Pinia, Nuxt, Alpine.js, Tailwind CSS, SCSS, Three.js, Konva, Vite, UI and UX, accessibility, responsive and multilingual interfaces' },
  { key: 'architecture', label: 'Architecture and security', items: 'Service-oriented design, SOLID, domain-driven boundaries, event logs and projections, SSO, passkeys (WebAuthn), HMAC request signing, RBAC, anti-corruption layers' },
  { key: 'delivery', label: 'Quality and delivery', items: 'AI-assisted development (Claude Code), spec-first workflow, TDD, Pest, Vitest, PHPStan, architecture tests, GitHub Actions, CI/CD, atomic deploys, ADRs, technical writing' },
  { key: 'tools', label: 'Tools', items: 'Git, GitHub, Docker, Postman, Adobe Creative Cloud' },
];

export const education = [
  { title: 'BSc (Hons) Computing for Digital Media', place: 'University of Sussex' },
  { title: 'BTEC Level 3 Extended Diploma in IT', place: '' },
];

export const contact: Link[] = [
  { label: 'email', href: 'mailto:hello@loganalleyne.com', display: 'hello@loganalleyne.com' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/logan-alleyne-827797139/', display: 'in/logan-alleyne-827797139' },
  { label: 'github', href: 'https://github.com/LoganAlleyne', display: 'LoganAlleyne' },
];

export const suiteContext =
  'Part of the FrameTech suite: the web applications I co-developed at Aspen Pumps in a team of two.';
