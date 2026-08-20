/**
 * Project content for the /work terminal and the project pages.
 *
 * Every field here was read from the project's own repo on disk — README,
 * package.json / pubspec.yaml / Package.swift, and the source imports.
 * Nothing is guessed. When a project changes, update it here.
 *
 * `shots` stays empty until real screenshots are captured.
 */

export type Status = 'shipped' | 'source-only' | 'prototype';

export interface Project {
  /** terminal command name — must stay unique */
  slug: string;
  name: string;
  /** one sentence, shown under the title */
  tagline: string;
  /** what it actually does, 2-3 sentences */
  summary: string;
  /** concrete things built — keep these truthful and specific */
  built: string[];
  /** exact stack, read from the dependency manifest */
  stack: string[];
  status: Status;
  year: string;
  repo: string;
  /** app icon lifted from the project's own repo — absent when the project
   *  has none of its own (a library, a scaffold, or a default framework icon) */
  logo?: string;
  /** projects that own a real product site */
  site?: string;
  download?: string;
  /** screenshot paths under /public/shots/<slug>/ */
  shots: string[];
}

const GH = 'https://github.com/23aneessss';

export const PROJECTS: Project[] = [
  {
    slug: 'orbit-desktop',
    logo: '/logos/orbit-desktop.png',
    name: 'Orbit',
    tagline: 'Six tools that usually need six apps, in one Mac window.',
    summary:
      'Orbit replaces the pile of apps most people keep open — notes, tasks, habits, a whiteboard — with a single native workspace. Nothing leaves the machine: no account, no server, no telemetry, and a workspace can be sealed behind Touch ID.',
    built: [
      'A workspace system where each space carries its own pages, tags and canvas, reorderable by drag',
      'A block editor with markdown shortcuts, slash commands and nested sub-pages',
      'An infinite idea canvas with Bézier links between cards, and merge-on-overlap — written in SwiftUI rather than embedding a web view',
      'Per-habit 52-week heatmaps and a task board that sorts itself into Overdue, Today and Upcoming',
      'Touch ID workspace locking that re-arms on every launch, plus JSON import/export',
    ],
    stack: ['Swift', 'SwiftUI', 'SwiftData', 'LocalAuthentication', 'macOS 14+'],
    status: 'shipped',
    year: '2025',
    repo: `${GH}/orbit-desktop`,
    site: 'https://orbit-macos.vercel.app/',
    download: `${GH}/orbit-desktop/releases/latest`,
    shots: [],
  },
  {
    slug: 'doctorcom',
    name: 'doctor.com',
    tagline: 'A medical practice workspace — web console and doctor’s phone app.',
    summary:
      'Two clients over one API: a desktop console where a practice runs its day, and a mobile app for the doctor between rooms. It carries its own drug reference — indications, precautions and interactions — and an assistant that reads a patient file rather than answering in the abstract.',
    built: [
      'Seventeen API modules covering patients, consultations, prescriptions, vaccinations, treatments, medical history, documents, travel medicine and agenda',
      'A drug database of its own, modelling indications, precautions, presentations and drug–drug interactions',
      'Clinical AI endpoints: diagnostic hypotheses, prescription and document recommendations, anomaly flagging on records, and a medication assistant',
      'A companion Expo app with Today, agenda, medications, notes and a tagged memory space, plus eleven settings screens',
      'Three roles — doctor, secretary, admin — over a typed tRPC layer shared by both clients',
    ],
    stack: ['Bun', 'Turborepo', 'tRPC', 'Drizzle', 'PostgreSQL', 'Better-Auth', 'TanStack Router', 'Expo', 'Zod'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/doctorcom`,
    shots: [],
  },
  {
    slug: 'jo3t',
    logo: '/logos/jo3t.png',
    name: 'JO3T',
    tagline: 'Where to eat in Algeria, ranked by people who actually ate there.',
    summary:
      'Restaurant discovery built for the 48 wilayas rather than adapted from somewhere else. Reviews come with photos, places can be added by anyone, and a leaderboard keeps the people who contribute visible.',
    built: [
      'Fourteen feature modules, among them discovery, map, venue pages, reviews, saved places, events and notifications',
      'Wilaya-first browsing: shortcuts for all 48 provinces alongside a For You feed and a daily featured pick',
      'Community submission flow so a missing place can be added from the app, and a contributor leaderboard',
      'A Following tab surfacing what people you follow have reviewed',
      'Ships with in-memory sample data, so every screen is reachable without a backend or an API key',
    ],
    stack: ['Flutter 3.41', 'Dart', 'Riverpod', 'go_router', 'Hive', 'Firebase', 'Google Maps'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/jo3t-app`,
    shots: [],
  },
  {
    slug: 'port-flow',
    logo: '/logos/port-flow.png',
    name: 'Port Flow',
    tagline: 'Slot booking for port terminals, with agents doing the scheduling legwork.',
    summary:
      'Four parties share one port terminal and none of them use the same screen. Carriers request slots, operators approve them, admins run the terminals, and drivers arrive with a QR code — while a set of AI agents works out which slots to offer in the first place.',
    built: [
      'Three AI agents behind the booking flow: an orchestrator, a booking agent, and one that reasons about slot availability',
      'Three separate Next.js consoles — admin, operator, transporter — plus an Expo app for drivers with QR codes and push notifications',
      'Carrier onboarding gated on a business document verified and stored in S3',
      'An in-app chat between parties, with anomaly detection and an audit log over every action',
      'Express and Prisma behind nginx, the whole stack reproducible through Docker Compose',
    ],
    stack: ['Express', 'Prisma', 'PostgreSQL', 'Next.js', 'React', 'Expo', 'AI agents', 'Docker'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Port-Flow`,
    shots: [],
  },
  {
    slug: 'ba33',
    logo: '/logos/ba33.png',
    name: 'BA33',
    tagline: 'Every kilogram of Algerian wool, traced from shepherd to certified product.',
    summary:
      'Built at a hackathon and sized like it was not: one backend serving 137 endpoints and six client applications, following wool through collection, washing and transformation. Field workers use it offline, in places where signal is optional.',
    built: [
      'Six clients from one codebase: shepherd and collector phone apps, plus operations, buyer and institutional web portals',
      'An event-log data model that keeps each batch traceable across every hand it passes through',
      'An offline sync package for the field apps, since collection points rarely have coverage',
      'Background job processing through BullMQ and Redis for the heavier pipeline steps',
      '137 documented endpoints and a 55-step end-to-end pipeline test that runs green',
    ],
    stack: ['NestJS', 'PostgreSQL', 'Redis', 'BullMQ', 'Flutter', 'Riverpod', 'Melos'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/ba33-aup4`,
    shots: [],
  },
  {
    slug: 'appxray',
    logo: '/logos/appxray.png',
    name: 'App X-Ray',
    tagline: 'What a Mac app can really do — read from the binary, not the marketing.',
    summary:
      'App Store privacy labels are written by the developer, and most Mac apps ship outside the store with no label at all. App X-Ray opens the bundle and its code signature and reports the capabilities it finds there. Entirely offline; nothing is ever uploaded.',
    built: [
      'Inspectors that read sandbox status, entitlements, notarization and hardened runtime straight from the bundle',
      'Detection of private framework linkage and background helpers an app installs behind you',
      'Severity-ranked warnings written in plain language — disabled library validation, for instance, explained rather than named',
      'Shipped twice over: a SwiftUI app and AppXrayKit, the same engine as a reusable library',
      'Export paths for the report, DocC documentation, and no third-party dependencies at all',
    ],
    stack: ['Swift 6.0', 'SwiftUI', 'SwiftPM', 'Security framework', 'macOS 13+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/AppXray`,
    shots: [],
  },
  {
    slug: 'macagentkit',
    name: 'MacAgentKit',
    tagline: 'The macOS plumbing every automation tool rewrites badly.',
    summary:
      'Menu-bar utilities, automation tools and desktop AI agents all re-implement the same fragile groundwork: the permission maze, the C Accessibility API, the toggles Apple barely exposes. This is that groundwork, solved once, as a dependency-free Swift package. Infrastructure, not an app.',
    built: [
      'Six modules — permissions, accessibility, app control, input synthesis, Shortcuts and system controls',
      'An AXElement wrapper with manual tree traversal, avoiding the two AX shortcuts that silently break on modern macOS',
      'The four permissions that matter — Accessibility, Automation, Screen Recording, Input Monitoring — detected, requested and deep-linked, with an optional SwiftUI dashboard',
      'Control Center and Do Not Disturb driven from code, plus a runner for Shortcuts and subprocesses',
      'A fluent query API with async polling waits and notification observers over the raw C interface',
    ],
    stack: ['Swift 5.9+', 'SwiftPM', 'AppKit', 'ApplicationServices', 'CoreGraphics', 'macOS 13+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/MacAgentKit`,
    shots: [],
  },
  {
    slug: 'sequence',
    logo: '/logos/sequence.png',
    name: 'Sequence',
    tagline: 'Habits tracked the way GitHub tracks commits.',
    summary:
      'One square per day, filling in as you show up. Over months the grid becomes an honest picture of consistency — nothing to fake, nothing to game. Everything lives on the phone.',
    built: [
      'A week-aligned contribution graph per habit with five intensity levels, and a second graph for daily tasks',
      'Three kinds of habit — yes/no, counted, and timed with a built-in stopwatch',
      'A continuity strip and streak logic with a configurable threshold, which shows a broken chain as 0d (was 5d) rather than hiding it',
      'A task board with templates, roll-over of unfinished items, and a Perfect Day ring when the list is cleared',
      'Bulk backfill for days logged late, an 18-colour palette manager, and a shareable Year in Sequence card',
    ],
    stack: ['Swift 5.9', 'SwiftUI', 'SwiftData', 'BackgroundTasks', 'iOS 17+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/Sequence`,
    shots: [],
  },
  {
    slug: 'focusnotch',
    logo: '/logos/focusnotch.png',
    name: 'FocusNotch',
    tagline: 'The notch on your MacBook, finally doing something.',
    summary:
      'Time remaining on one side of the notch, session progress on the other. Move the cursor up and it unfolds into a full control panel. No window, no Dock icon — the timer lives in the one piece of screen nothing else uses.',
    built: [
      'A panel positioned over the physical notch, floating above every Space and over fullscreen apps',
      'Click-through while collapsed, so the menu bar underneath keeps working normally',
      'A hover expansion with concave ears, so the camera housing flows into the panel instead of sitting on top of it',
      'A Pomodoro engine anchored to an absolute end time, which is why it stays accurate across sleep and App Nap',
      'macOS Focus toggled from the notch or automatically per session, with sounds, notifications and a mirrored menu bar timer for external displays',
    ],
    stack: ['Swift 5.9', 'SwiftUI', 'AppKit', 'ServiceManagement', 'macOS 14+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/FocusNotch`,
    shots: [],
  },
  {
    slug: 'movio',
    logo: '/logos/movio.png',
    name: 'Movio',
    tagline: 'A movie app whose API key never touches the phone.',
    summary:
      'Discover films, keep the ones you like, tick off what you have watched. The interesting half is behind it: a backend that owns authentication and every call to TMDB, so the device holds no secret — and trending is computed from what people actually searched for, not handed down by the API.',
    built: [
      'An Expo Router client with onboarding, tabbed discovery, search, saved and profile, styled with NativeWind',
      'Email and Google sign-in through BetterAuth, with tokens kept in the device secure store',
      'A trending list derived from real search activity recorded server-side',
      'Favorites and a watched list, where watched only applies to what was saved first',
      'An Express, Drizzle and PostgreSQL backend proxying TMDB, with migrations and a typed API',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'Express', 'Drizzle', 'PostgreSQL', 'BetterAuth'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Movio`,
    shots: [],
  },
  {
    slug: 'nearby',
    name: 'Nearby',
    tagline: 'Book a professional who is already close to you.',
    summary:
      'A three-sided marketplace: clients search for a service nearby, providers publish what they offer and manage their bookings, and an admin oversees both. Shared types sit in their own package so the phone and the API cannot drift apart.',
    built: [
      'Three distinct experiences in one app — client search and booking, provider dashboard and service catalogue, admin oversight',
      'A booking flow from service detail through confirmation, with a history screen on both sides',
      'A monorepo where the mobile app and the Express API import the same shared types package',
      'Location-based search over a Drizzle schema on PostgreSQL, brought up locally with Docker Compose',
      'Session tokens stored in expo-secure-store rather than plain device storage',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Express', 'Drizzle', 'PostgreSQL', 'Docker'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Nearby-App`,
    shots: [],
  },
  {
    slug: 'planora',
    name: 'Planora',
    tagline: 'A student planner that expects the connection to drop.',
    summary:
      'Tasks, timetable, focus sessions and grades that all work with the plane in flight mode. Sync exists, but as an opt-in extra behind a build flag rather than the price of entry — the app is fully usable having never seen a server.',
    built: [
      'Nine feature modules: tasks, calendar, pomodoro, grades, stats, home, profile, onboarding and auth',
      'A local Drift database as the source of truth, with Riverpod driving state and route guards',
      'A Pomodoro timer wired to local notifications, and a calendar view for planning the week',
      'Grades and statistics rendered as charts, with task templates plus CSV import and export',
      'Auth that falls back to a local account, and Google sign-in compiled in only when asked for',
    ],
    stack: ['Flutter', 'Dart', 'Riverpod', 'Drift', 'go_router', 'dio', 'fl_chart'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/student-planner`,
    shots: [],
  },
];

export const STATUS_LABEL: Record<Status, string> = {
  shipped: 'Shipped · downloadable',
  'source-only': 'Open source · build from source',
  prototype: 'Working prototype',
};
