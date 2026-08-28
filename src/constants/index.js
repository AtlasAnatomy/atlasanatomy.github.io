import {
  agenas,
  formalba,
  oneskill,
  puntoeduca,
  torvergata,
  mobile,
  backend,
  creator,
  web,
  adobe,
  C,
  chatgpt,
  cplex,
  java,
  moodle,
  mysql,
  office,
  python,
  wordpress,
  css,
  html,
  romatre,
  cfl,
  ministero,
  trenitalia,
  tu,
  ewg,
  its,
  profile,
  paper1,
  paper2,
  paper3,
  paper4,
  paper5,
  paper6,
  paper7,
  paper8,
} from '../assets';

export const navLinks = [
  { id: 'about', title: 'About' },
  { id: 'work', title: 'Work' },
  { id: 'research', title: 'Research' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Contact' },
];

// Le quattro cose che faccio davvero, non quattro etichette generiche.
const services = [
  { title: 'Optimization & OR', icon: backend },
  { title: 'Algorithm Development', icon: web },
  { title: 'Machine Learning', icon: mobile },
  { title: 'Applied AI & Automation', icon: creator },
];

const technologies = [
  { name: 'Python', icon: python },
  { name: 'Java', icon: java },
  { name: 'C', icon: C },
  { name: 'CPLEX', icon: cplex },
  { name: 'MySQL', icon: mysql },
  { name: 'HTML 5', icon: html },
  { name: 'CSS 3', icon: css },
  { name: 'Moodle', icon: moodle },
  { name: 'WordPress', icon: wordpress },
  { name: 'Adobe Suite', icon: adobe },
  { name: 'Office 365', icon: office },
  { name: 'LLM tooling', icon: chatgpt },
];

// Competenze senza logo: elencate come testo invece di inventare un'icona.
const skillGroups = [
  {
    label: 'Optimization & modelling',
    items: ['Integer programming', 'Metaheuristics', 'Event-based simulation', 'CPLEX', 'Fuzzy logic'],
  },
  {
    label: 'Data & ML',
    items: ['scikit-learn', 'LightGBM', 'LSTM & attention models', 'Transfer learning', 'SQL / NoSQL'],
  },
  {
    label: 'LLM & automation',
    items: ['Prompt engineering', 'RAG on private servers', 'Llama', 'n8n', 'Claude Code'],
  },
  {
    label: 'Platforms & systems',
    items: ['Moodle', 'WordPress', 'Cloudflare', 'NFC / smart-card readers', 'Blockchain'],
  },
];

const experiences = [
  {
    title: 'Project Manager — Technical Consultant',
    company_name: 'Agenas — Italian National Agency for Regional Health Services',
    icon: agenas,
    iconFit: 'cover',
    date: 'Sep 2025 — Present',
    points: [
      'Running technical projects for the national agency that supports Italy\'s regional health services.',
      'Bridging the gap between the technical teams building the systems and the public bodies that have to operate them.',
    ],
  },
  {
    title: 'Co-founder',
    company_name: 'Oneskill S.r.l.',
    icon: oneskill,
    iconFit: 'cover',
    date: 'Aug 2025 — Present',
    link: 'https://oneskill4education.com/',
    points: [
      'Co-founded a company building e-learning platforms, websites and web applications for training providers.',
      'Design and maintain the MySQL schemas and the automation layer that keeps course, provider and enrolment data in sync.',
      'Ship the algorithmic and data-driven parts: matching, scheduling and the reporting that sits on top of them.',
    ],
  },
  {
    title: 'Project Manager',
    company_name: 'PuntoEduca',
    icon: puntoeduca,
    iconFit: 'cover',
    date: 'Sep 2025 — Present',
    link: 'https://www.puntoeduca.news/',
    points: [
      'Technical product owner for an editorial product with a registered newsroom.',
      'Built the AI integration around an editorial-trust workflow: drafts are assisted, but attribution and review stay with the desk.',
    ],
  },
  {
    title: 'IT Specialist',
    company_name: 'Formalba S.r.l.',
    icon: formalba,
    iconFit: 'cover',
    date: 'Oct 2024 — Present',
    link: 'https://www.formalbaorienta.eu/',
    points: [
      'Design and build e-learning platforms, web applications and websites for vocational training.',
      'Lead teaching, staff training and career-orientation activities.',
    ],
  },
  {
    title: 'Innovation Manager',
    company_name: 'RDC — Research & Development Consulting S.r.l.',
    icon: ministero,
    iconBg: '#0066cc',
    date: 'Oct 2023 — Present',
    points: [
      'Map client processes end to end, then cut the steps that exist only because nobody re-examined them.',
      'Lead digitalisation projects from the process analysis through to the software that replaces the manual work.',
    ],
  },
  {
    title: 'Scientific & Educational Coordinator',
    company_name: 'ITS Academy ECO-STEM Generation',
    icon: its,
    iconBg: '#0f766e',
    date: 'Nov 2023 — Present',
    link: 'https://linktr.ee/itsecostemgeneration',
    points: [
      'Own the teaching programme: course design, quality of delivery, and the assessment that follows.',
      'Negotiate the company partnerships that turn into student traineeships.',
      'Teach the Computer Science and Mathematics modules, and built the Moodle platform the courses run on.',
    ],
  },
  {
    title: 'Teaching Tutor & Guest Lecturer',
    company_name: 'Roma Tre University',
    icon: romatre,
    iconBg: '#E6DEDD',
    date: 'Sep 2022 — Present',
    points: [
      'Won the competitive call for supplementary teaching and tutoring.',
      'Guest lecturer on Public Transport Optimization for the Management and Automation Engineering degree.',
      'Run lectures, exercise sessions and seminars, and sit on midterm and final exam boards.',
    ],
  },
  {
    title: 'Member — EWG on Sustainable Supply Chains, AIROYoung',
    company_name: 'EURO & AIRO',
    icon: ewg,
    iconBg: '#E6DEDD',
    date: 'Aug 2020 — Present',
    points: [
      'Speaker and lecturer at EURO and AIRO conferences.',
      'Co-organised the 6th AIROYoung Workshop at the Roma Tre Department of Engineering.',
    ],
  },
  {
    title: 'Visiting Researcher',
    company_name: 'University of Luxembourg · TU Delft · La Sapienza · Beijing Jiaotong',
    icon: tu,
    iconBg: '#15A3D2',
    date: '2021 — 2023',
    points: [
      'Research visits built around the electric-bus scheduling and rail rescheduling work.',
      'Produced the metaheuristics for mixed-fleet multi-terminal electric bus scheduling, later published in Computers & Industrial Engineering.',
      'Standing co-author relationships with the Beijing Jiaotong and Southwest Jiaotong groups on metro and freight optimisation.',
    ],
  },
  {
    title: 'Researcher',
    company_name: 'CFL Multimodal & University of Luxembourg',
    icon: cfl,
    iconBg: '#E6DEDD',
    date: 'Sep 2021 — Jan 2022',
    points: [
      'Optimisation algorithms for shunting operations at the Bettembourg multimodal terminal.',
      'Worked on the ANTOINE project (University of Luxembourg — CFL — Luxembourg National Research Fund).',
      'Built the event-based simulator used to test shunt-in / shunt-out policies against real terminal data.',
    ],
  },
  {
    title: 'Researcher',
    company_name: 'Trenitalia & La Sapienza',
    icon: trenitalia,
    iconBg: '#E6DEDD',
    date: 'Sep 2019 — Apr 2020',
    points: [
      'Turned train calendar bitmaps into readable descriptions — the text passengers actually see when they check which days a train runs.',
      'Implemented the heuristics in C and CPLEX; the divide-and-conquer approach holds its runtime as the calendar grows.',
    ],
  },
];

const educations = [
  {
    title: 'European Ph.D. in Computer Science and Automation',
    company_name: 'Roma Tre University — Department of Engineering',
    icon: romatre,
    iconBg: '#E6DEDD',
    date: 'Oct 2020 — Apr 2024',
    points: [
      'Elected representative of the doctoral students until October 2023.',
      'Joint work with the University of Luxembourg, TU Delft, La Sapienza and Beijing Jiaotong University.',
      'Industry collaborations with Trenitalia and CFL Multimodal.',
      'Defended with the highest distinction.',
    ],
  },
  {
    title: "Master's Degree in Management and Automation Engineering",
    company_name: 'Roma Tre University — Department of Engineering',
    icon: romatre,
    iconBg: '#E6DEDD',
    date: 'Sep 2017 — Jul 2020',
    points: [
      'Final grade: 108/110.',
      'Thesis: A Fast and Effective Greedy Heuristic for On-line Train Calendars Generation.',
    ],
  },
  {
    title: "Bachelor's Degree in Management Engineering",
    company_name: "University of Rome 'Tor Vergata'",
    icon: torvergata,
    iconFit: 'cover',
    date: '2011 — 2017',
    points: [],
  },
];

// Le 13 pubblicazioni per intero. Le prime otto hanno un'anteprima e compaiono
// in evidenza; le altre restano nell'elenco, che è il modo in cui questa lista
// viene davvero consultata.
const publications = [
  {
    title: 'Data-driven optimization of energy-efficient metro timetables accounting for operational deviations',
    authors: "Y. Luo, Y. Tang, L. Liu, A. D'Ariano, T. Bosi, S. Zhang, F. Xue",
    venue: 'Transportation Research Part C',
    detail: 'Vol. 185, 105551',
    year: '2025',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0968090X26000392',
  },
  {
    title: 'A continuum approximation approach for designing corridor-based heterogeneous transit service using modular autonomous vehicles',
    authors: "X. Luo, W. Fan, Y. Zhang, A. D'Ariano, T. Bosi, Y. Liu, W. Wu, X. Li",
    venue: 'Transportation Research Part E',
    detail: 'Vol. 205, 104512',
    year: '2026',
    link: 'https://www.sciencedirect.com/science/article/pii/S136655452500540X',
  },
  {
    title: 'Structure-optimized deep forest model for railway port container reloading time prediction',
    authors: "J. Guo, Y. Wang, X. Guo, J. Guo, A. D'Ariano, T. Bosi, Y. Zhang",
    venue: 'Advanced Engineering Informatics',
    detail: 'Vol. 71, 104309',
    year: '2026',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S1474034626000017',
  },
  {
    title: 'Joint optimization of multi-trip vehicle scheduling, passenger assignment, and timetable for on-demand customized bus services',
    authors: "P. Wu, Q. Wang, T. Bosi, A. D'Ariano",
    venue: 'Transportation Research Part C',
    detail: 'Vol. 180, 105346',
    year: '2025',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0968090X2500350X',
  },
  {
    title: 'Dynamic adjustment strategy of electric bus operations: a spatial branch-and-bound method with acceleration techniques',
    authors: "Y. Yuan, S. Li, A. D'Ariano, T. Bosi, L. Yang",
    venue: 'Transportation Research Part C',
    detail: 'Vol. 171, 105003',
    year: '2025',
    link: 'https://www.sciencedirect.com/science/article/abs/pii/S0968090X25000075',
  },
];

const featuredPapers = [
  {
    name: 'Shunting Yard Policies',
    description:
      'Freight terminals decide which wagons to pull and in what order. We modelled shunt-in / shunt-out policies against real Bettembourg data and measured what the wagon selection criterion actually costs in emissions, delay and fleet size.',
    tags: [
      { name: 'OR', color: 'blue-text-gradient' },
      { name: 'Python', color: 'green-text-gradient' },
      { name: 'CAIE 2024', color: 'pink-text-gradient' },
    ],
    image: paper1,
    source_code_link: 'https://doi.org/10.1016/j.cie.2023.109865',
  },
  {
    name: 'Wagon Maintenance Simulation',
    description:
      'Mileage-based maintenance is usually left out of shunting models. Putting it in raised shunting operations by 11% and showed that a no-maintenance baseline underestimates both fleet size and total mileage.',
    tags: [
      { name: 'Simulation', color: 'blue-text-gradient' },
      { name: 'Python', color: 'green-text-gradient' },
      { name: 'JRTPM 2023', color: 'pink-text-gradient' },
    ],
    image: paper2,
    source_code_link: 'https://doi.org/10.1016/j.jrtpm.2023.100430',
  },
  {
    name: 'Freight Delay Prediction',
    description:
      'Short-term arrival delay prediction for freight rail. LightGBM came out ahead; departure delay, trip distance and train composition carried most of the signal — all three are known before the train leaves.',
    tags: [
      { name: 'ML', color: 'blue-text-gradient' },
      { name: 'LightGBM', color: 'green-text-gradient' },
      { name: 'IEEE Access', color: 'pink-text-gradient' },
    ],
    image: paper3,
    source_code_link: 'https://doi.org/10.1109/ACCESS.2023.3275022',
  },
  {
    name: 'Station Yard Scheduling',
    description:
      'Train platforming usually stops at the platform. We extended it to route and schedule the locomotives too, solved with 0-1 integer programming plus Lagrangian relaxation and ADMM, and tested it on Guangzhou station.',
    tags: [
      { name: 'OR', color: 'blue-text-gradient' },
      { name: 'MATLAB', color: 'green-text-gradient' },
      { name: 'TR-C 2023', color: 'pink-text-gradient' },
    ],
    image: paper4,
    source_code_link: 'https://doi.org/10.1016/j.trc.2023.104160',
  },
  {
    name: 'Electric Bus Scheduling',
    description:
      'Mixed fleets of electric and hybrid buses, at full city scale. A Repeated Local Search handles the full-size instances that exact methods cannot, with Simulated Annealing and a Genetic Algorithm built on top. Second place at TRA VISIONS 2024.',
    tags: [
      { name: 'Metaheuristics', color: 'blue-text-gradient' },
      { name: 'Python', color: 'green-text-gradient' },
      { name: 'CAIE 2025', color: 'pink-text-gradient' },
    ],
    image: paper5,
    source_code_link: 'https://doi.org/10.1016/j.cie.2025.111782',
  },
  {
    name: 'China-Europe Travel Time',
    description:
      'A two-stage transfer learning model for travel times on the China-Europe Railway Express, where the target route has too little history to train on directly. Attention over LSTM, validated on a real CRE corridor.',
    tags: [
      { name: 'Transfer learning', color: 'blue-text-gradient' },
      { name: 'Python', color: 'green-text-gradient' },
      { name: 'ESWA 2024', color: 'pink-text-gradient' },
    ],
    image: paper6,
    source_code_link: 'https://doi.org/10.1016/j.eswa.2024.123989',
  },
  {
    name: 'Train-to-Train Rescue',
    description:
      'When a metro train fails, another one has to push it clear. We rescheduled the timetable and the rolling stock together, including the rescue move itself, and validated it on the Beijing Yizhuang line.',
    tags: [
      { name: 'OR', color: 'blue-text-gradient' },
      { name: 'CPLEX', color: 'green-text-gradient' },
      { name: 'IEEE T-ITS', color: 'pink-text-gradient' },
    ],
    image: paper7,
    source_code_link: 'https://doi.org/10.1109/TITS.2024.3394535',
  },
  {
    name: 'Train Calendar Generation',
    description:
      'The sentence that tells you which days a train runs is generated from a bitmap. A divide-and-conquer heuristic keeps the runtime flat as the calendar gets more irregular — this was my Master\'s thesis, and it went into production reasoning.',
    tags: [
      { name: 'OR & NLG', color: 'blue-text-gradient' },
      { name: 'C', color: 'green-text-gradient' },
      { name: 'JAT 2021', color: 'pink-text-gradient' },
    ],
    image: paper8,
    source_code_link: 'https://doi.org/10.1155/2021/4664010',
  },
];

// Software che gira, distinto dai paper.
const projects = [
  {
    name: 'Aspasia',
    role: 'Product & platform — Oneskill',
    year: '2025',
    description:
      'A shared course catalogue for accredited training providers. A company describes what it needs to teach and gets back matching courses from across the network, filtered by area, provider, duration and cost — instead of contacting each provider one at a time.',
    highlights: [
      'Shared catalogue across accredited providers',
      'Intake form that matches company needs to providers',
      'Instructor recruitment pipeline',
    ],
    tags: ['Marketplace', 'MySQL', 'Web platform'],
    links: [{ label: 'aspasia.app', href: 'https://aspasia.app/' }],
  },
  {
    name: 'SlingTab',
    role: 'Personal project',
    year: '2025',
    description:
      "A Chrome extension that turns following a link into opening a portal. Circle a link with the mouse, the trackpad, or a hand gesture read from the webcam, and a ring tears open showing the destination behind it before the navigation happens. The webcam frames are processed on-device and never leave the machine.",
    highlights: [
      'WebGL2 gravitational-lens passes with a Canvas2D fallback',
      'MediaPipe hand tracking, bundled locally and running offline',
      '12,000 instanced particles on parabolic paths',
      '221 unit tests over the pure logic',
    ],
    tags: ['TypeScript', 'WebGL2', 'MediaPipe', 'Manifest V3'],
    links: [
      {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/fmpchiehglmodnbjjddeheboaphhgcfp',
      },
      { label: 'GitHub', href: 'https://github.com/AtlasAnatomy/SlingTab' },
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "The research showcases the candidate's exceptional scholarly depth and collaborative prowess, warranting endorsement for the Ph.D. title and future research endeavors.",
    name: 'Francesco Viti',
    designation: 'Associate Professor',
    company: 'University of Luxembourg',
    image: profile,
  },
  {
    testimonial:
      'Tommaso has showcased outstanding abilities in independent and collaborative research, demonstrating curiosity, efficiency, innovative problem-solving skills, and rigorous presentation.',
    name: "Andrea D'Ariano",
    designation: 'Full Professor',
    company: 'Roma Tre University',
    image: profile,
  },
  {
    testimonial:
      'Every research component in the thesis demonstrates originality, enhances disciplinary knowledge, and adheres to rigorous methodology, strongly meeting international dissertation standards.',
    name: 'Taku Fujiyama',
    designation: 'Full Professor',
    company: 'University College London',
    image: profile,
  },
];

const awards = [
  {
    title: 'Second place — Sustainable Mobility of People and Goods, Road',
    issuer: 'TRA VISIONS 2024, Young Researcher Competition · Royal Dublin Society',
    year: '2024',
    link: 'https://www.travisions.eu/TRAVisions/young_researcher_competition/',
  },
  {
    title: 'Top 5 projects — Sustainability, Rail',
    issuer: 'TRA VISIONS 2022, Young Researcher Competition · Lisbon',
    year: '2022',
  },
  {
    title: 'EURO & NATCOR bursary — Italian representative',
    issuer: "NATCOR 'Multi Criteria Decision Making', University of Portsmouth",
    year: '2022',
  },
  {
    title: 'EU4EU — European Universities for the EU',
    issuer: 'Erasmus+ KA1 traineeship mobility, 15 grants awarded',
    year: '2019',
  },
];

const certifications = [
  { title: 'Manager della Transizione Ecologica', issuer: 'EIIS — European Institute of Innovation for Sustainability', year: '2022' },
  { title: 'UNI EN ISO 9001:2015 Lead Auditor', issuer: 'CSQA Centro Formazione', year: '2022' },
  { title: 'PCEP — Certified Entry-Level Python Programmer', issuer: 'Python Institute' },
];

const socials = [
  { name: 'Email', href: 'mailto:bositommaso13@gmail.com', label: 'bositommaso13@gmail.com' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/tommaso-bosi-323073155/', label: 'tommaso-bosi' },
  { name: 'GitHub', href: 'https://github.com/AtlasAnatomy', label: 'AtlasAnatomy' },
  { name: 'Linktree', href: 'https://linktr.ee/bositommaso', label: 'bositommaso' },
];

export {
  services,
  technologies,
  skillGroups,
  experiences,
  educations,
  publications,
  featuredPapers,
  projects,
  testimonials,
  awards,
  certifications,
  socials,
};
