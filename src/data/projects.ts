/**
 * Project content for the /work terminal and the project pages.
 *
 * Every field here was read from the project's own repo on disk — README,
 * package.json / pubspec.yaml / Package.swift, and the source imports.
 * Nothing is guessed. When a project changes, update it here.
 *
 * `shots` stays empty until real screenshots are captured.
 */

export type Status = 'shipped' | 'source-only' | 'prototype' | 'scaffold';

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
    name: 'Orbit',
    tagline: 'A private, local-first personal OS for macOS.',
    summary:
      'Orbit brings habits, connected ideas, tasks, a visual canvas and workspaces into one native Mac window. Everything stays on the machine — no account, no server, no telemetry. Workspaces can be locked behind Touch ID.',
    built: [
      'Workspaces with per-space ideas, folders, tags and canvas',
      'Touch ID–locked private workspaces, re-locking on every launch',
      'Block editor with markdown shortcuts, slash commands and nested sub-pages',
      'Infinite canvas with Bézier links and card merging, rebuilt natively in SwiftUI',
      'Task board grouped by Overdue / Today / Upcoming, and 52-week habit heatmaps',
    ],
    stack: ['Swift', 'SwiftUI', 'SwiftData', 'macOS 14+'],
    status: 'shipped',
    year: '2025',
    repo: `${GH}/orbit-desktop`,
    download: `${GH}/orbit-desktop/releases/latest`,
    shots: [],
  },
  {
    slug: 'jo3t',
    name: 'JO3T',
    tagline: 'Find places worth eating at in Algeria, ranked by people who actually ate there.',
    summary:
      'A Flutter app for discovering restaurants, cafés and street food across the 48 wilayas. A For You feed with category chips, a daily featured pick, wilaya shortcuts and a Following activity tab. It boots on sample data, so every screen is reachable without a backend.',
    built: [
      'For You discovery feed with category chips and a daily featured place',
      'Wilaya shortcuts covering all 48 provinces, plus search and filters',
      'Community reviews with photos and a community-backed score per place',
      'Following tab with friend activity, and Google Maps integration',
      'Local cache with Hive, and Firebase wired as an optional backend',
    ],
    stack: ['Flutter 3.41', 'Dart', 'Riverpod', 'go_router', 'Hive', 'Firebase', 'Google Maps'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/jo3t-app`,
    shots: [],
  },
  {
    slug: 'macagentkit',
    name: 'MacAgentKit',
    tagline: 'The low-level macOS automation plumbing every agent re-implements badly.',
    summary:
      'A dependency-free Swift package that solves the fragile groundwork under menu-bar tools, automation utilities and AI desktop agents: the TCC permission maze, the C Accessibility API, Control Center toggles and Shortcuts. It is infrastructure, not an app.',
    built: [
      'MAPermissions — detect, request and deep-link Accessibility, Automation, Screen Recording and Input Monitoring',
      'MAAccessibility — a safe AXElement wrapper with robust manual traversal that survives modern macOS',
      'Fluent query API, async polling waits and notification observers over the raw C API',
      'MASystemControl for Control Center and Do Not Disturb, MAShortcuts for running Shortcuts',
      'Zero third-party dependencies, DocC documentation and CI',
    ],
    stack: ['Swift 5.9+', 'SwiftPM', 'AppKit', 'ApplicationServices', 'CoreGraphics', 'macOS 13+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/MacAgentKit`,
    shots: [],
  },
  {
    slug: 'appxray',
    name: 'App X-Ray',
    tagline: 'See what a Mac app can really do — read from the binary, not the marketing.',
    summary:
      'App Store privacy labels are self-declared, and most Mac apps ship outside the store with no label at all. App X-Ray points at any .app and reports what it can actually do, straight from the bundle and its code signature. Fully offline — nothing is ever uploaded.',
    built: [
      'Capability inventory read from the binary: sandbox status, entitlements, notarization, hardened runtime',
      'Detection of private framework linkage and installed background helpers',
      'Plain-language warnings with severity, such as disabled library validation',
      'Both a SwiftUI app and AppXrayKit as a reusable library',
      'Zero dependencies, DocC documentation and CI',
    ],
    stack: ['Swift 6.0', 'SwiftUI', 'SwiftPM', 'Security framework', 'macOS 13+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/AppXray`,
    shots: [],
  },
  {
    slug: 'focusnotch',
    name: 'FocusNotch',
    tagline: "Make your MacBook's notch useful — a Pomodoro timer that lives in it.",
    summary:
      'Time left on the left of the notch, session progress on the right. Move the cursor up and it expands into a full control panel with a countdown, progress bar, transport controls and a Do Not Disturb toggle. No window, no Dock icon.',
    built: [
      'A panel pinned over the physical notch, floating above every Space and fullscreen app',
      'Click-through when collapsed, so the menu bar keeps working',
      'Hover-to-expand animation with concave ears flowing into the notch',
      'Pomodoro engine anchored to an absolute end time, so it survives sleep and App Nap',
      'macOS Focus toggle, phase notifications and a mirrored menu bar timer',
    ],
    stack: ['Swift 5.9', 'SwiftUI', 'Observation', 'ServiceManagement', 'macOS 14+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/FocusNotch`,
    shots: [],
  },
  {
    slug: 'sequence',
    name: 'Sequence',
    tagline: 'Track habits the way GitHub tracks code.',
    summary:
      'Every day you show up is a square, and the grid becomes an honest picture of your consistency. An iOS habit tracker built around a GitHub-style contribution graph — no badges to chase, no streaks to fake. Local-first, no servers.',
    built: [
      'Per-habit contribution graph with a week-aligned grid and a 5-level intensity scale',
      'Three habit types — binary, counted, and timed with a built-in stopwatch',
      'Current and best streaks with a configurable intensity threshold',
      'Daily task board with templates, roll-over of unfinished items and a Perfect Day ring',
      'Habit reminders, streak-at-risk alerts and quiet hours via background refresh',
    ],
    stack: ['Swift 5.9', 'SwiftUI', 'SwiftData', 'BackgroundTasks', 'iOS 17+'],
    status: 'source-only',
    year: '2025',
    repo: `${GH}/Sequence`,
    shots: [],
  },
  {
    slug: 'ba33',
    name: 'BA33',
    tagline: "Algeria's wool traceability platform — from shepherd to certified product.",
    summary:
      'A hackathon-built traceability system tracking every kilogram of wool through collection, washing and transformation. One NestJS backend serving 137 endpoints, six client applications, and an end-to-end pipeline covering eleven personas.',
    built: [
      'NestJS + PostgreSQL backend with 137 documented endpoints and Swagger',
      'Six client apps: shepherd and collector mobile apps, plus operations, buyer and institutional web portals',
      'Event-log data model tracing each batch across the full pipeline',
      'Offline sync package for the field mobile apps, and a shared design-token system',
      '55 end-to-end pipeline tests passing, with seeded demo data',
    ],
    stack: ['NestJS', 'PostgreSQL', 'Redis', 'BullMQ', 'Flutter', 'Riverpod', 'Melos monorepo'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/ba33-aup4`,
    shots: [],
  },
  {
    slug: 'port-flow',
    name: 'Port Flow',
    tagline: 'Role-based slot booking for port terminals.',
    summary:
      'A booking platform for port terminals covering four roles end to end. Carriers register and request slots, operators approve or reject them, admins manage terminals and accounts, and drivers get their assignments with QR codes.',
    built: [
      'Four role flows — admin, operator, carrier and driver — over a shared Express + Prisma API',
      'Three separate Next.js frontends, one per back-office role',
      'An Expo mobile app for drivers with assignments, QR codes and push notifications',
      'Carrier onboarding with business-document verification stored in S3',
      'Audit logging and anomaly visibility, with Docker Compose and nginx for local deployment',
    ],
    stack: ['Express', 'Prisma', 'PostgreSQL', 'Next.js', 'React', 'Expo', 'Docker'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Port-Flow`,
    shots: [],
  },
  {
    slug: 'movio',
    name: 'Movio',
    tagline: 'Discover movies, save them, and track what you have watched.',
    summary:
      'A full-stack movie app: an Expo mobile client and its own Express backend. The backend owns authentication and all TMDB access, so no API key ever reaches the device. Trending is computed from what users actually search for.',
    built: [
      'Expo Router mobile client styled with NativeWind, plus an onboarding flow',
      'Email/password and Google OAuth authentication through BetterAuth',
      'Discover, search and movie detail screens backed by TMDB via the API',
      'Favorites and a watched list, with trending derived from real search activity',
      'Express + Drizzle + PostgreSQL backend with migrations and a typed API layer',
    ],
    stack: [
      'React Native',
      'Expo',
      'TypeScript',
      'NativeWind',
      'Express',
      'Drizzle',
      'PostgreSQL',
      'BetterAuth',
      'TMDB API',
    ],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Movio`,
    shots: [],
  },
  {
    slug: 'planora',
    name: 'Planora',
    tagline: 'An offline-first student planner for Android and iOS.',
    summary:
      'A Flutter study planner that works with no connection at all: tasks, calendar planning, Pomodoro sessions and grades stored locally, with cloud sync as an opt-in extra rather than a requirement.',
    built: [
      'Offline-first local database with Drift, and Riverpod-driven state and route guards',
      'Task management with templates, plus import and export',
      'Calendar planning view and a Pomodoro focus timer with local notifications',
      'Grades and statistics surfaces with charts',
      'Auth flow with a local fallback, and optional Google Sign-In behind a build flag',
    ],
    stack: ['Flutter', 'Dart', 'Riverpod', 'Drift', 'go_router', 'dio', 'fl_chart'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/student-planner`,
    shots: [],
  },
  {
    slug: 'nearby',
    name: 'Nearby',
    tagline: 'Book professional services in your immediate vicinity.',
    summary:
      'A location-based marketplace where clients find and book nearby professionals. Built as a monorepo with an Expo mobile client, an Express API and a shared package holding the types both sides agree on.',
    built: [
      'Monorepo with an Expo mobile app, an Express API and a shared types package',
      'Location-based discovery of nearby service providers',
      'Booking flow between clients and professionals',
      'Drizzle schema over PostgreSQL, running locally through Docker Compose',
      'Secure token storage on the device via expo-secure-store',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Express', 'Drizzle', 'PostgreSQL', 'Docker'],
    status: 'prototype',
    year: '2025',
    repo: `${GH}/Nearby-App`,
    shots: [],
  },
  {
    slug: 'doctorcom',
    name: 'doctor.com',
    tagline: 'A typed foundation for a medical practice workspace.',
    summary:
      'A Bun + Turborepo monorepo laying the groundwork for a medical practice tool: database schema, authentication, a typed tRPC layer and shared validation are wired and type-checked end to end. The clinical features themselves are not implemented yet — this is deliberately the skeleton, not the product.',
    built: [
      'Bun + Turborepo monorepo split into server, api, db, auth and shared packages',
      'End-to-end type safety from the database to the web client through tRPC and Zod',
      'Drizzle schema with synchronised PostgreSQL migrations',
      'Better-Auth wired into the server, and a TanStack Router web client',
      'Local service stack with Postgres, MinIO and Mailpit via Docker',
    ],
    stack: ['Bun', 'Turborepo', 'tRPC', 'Drizzle', 'PostgreSQL', 'Better-Auth', 'Zod', 'TanStack Router'],
    status: 'scaffold',
    year: '2025',
    repo: `${GH}/doctorcom`,
    shots: [],
  },
];

export const STATUS_LABEL: Record<Status, string> = {
  shipped: 'Shipped · downloadable',
  'source-only': 'Open source · build from source',
  prototype: 'Working prototype',
  scaffold: 'Foundation — features not built yet',
};
