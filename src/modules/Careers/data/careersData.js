// modules/Careers/data/careersData.js
export const ABRIDH_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqu/3yIy+TSv9CfbGhVgL
W/vkk5lS5wg2xQFS8TyIjVqBpLOsejx2eihkaLXmhdaHcemUdKVdfQpltSzslvrx
eUhVhd86onIKe6sXDESJg/Xl8iu0krRLSvXhMXZ72/35fbhbwJf7O6Ao5BcfKQip
Ky28OVV9eCKhCpHHKa/VbZFC12548j8WjzHUv95aqNHP1btvGFzf0vPLdsMeFbw7
8N78kn35RuSHuxgLTF+p6i0icEUR5fNSOvm55p+ctFkBsPMW/aAGWvY4umo5P5Dr
PqDnnbhVV+cHAY0cQF1fF/Hqw0BNGJX2RVdQisjnA97SBvzEBtShKnlZSgH3nZEf
rQIDAQAB
-----END PUBLIC KEY-----`;

export const JOBS_DATA = [
  {
    slug: "senior-mobile-systems-engineer",
    titleEn: "Senior Mobile Systems Engineer",
    titleFr: "Ingénieur Systèmes Mobiles Senior",
    titleAr: "مهندس أول للأنظمة وتطبيقات الهاتف",
    department: "Engineering",
    location: "Béjaïa, Algeria / Remote (Algeria)",
    type: "Freelance (Auto-Entrepreneur préféré) / CDI",
    contractBadge: "Auto-Entrepreneur Préféré",
    priority: 1,
    status: "OPEN",
    mission: "Harden and scale the core Abridh Flutter mobile apps (Passenger & Captain) to ensure reliable background GPS telemetry, quick recovery after network loss, and smooth performance on everyday Android devices across Algeria.",
    whyExists: "Abridh's mobility operations depend on reliable GPS tracking, background socket connections, and predictable state transitions during active trips. We need an experienced engineer who understands Android system behavior, battery management, and real-world mobile network conditions.",
    responsibilities: [
      "Own the core architecture and performance of Abridh's Flutter codebases (Passenger & Captain apps).",
      "Improve background GPS tracking and WebSocket reconnection reliability on patchy 3G/4G networks.",
      "Diagnose and eliminate UI stutters, memory leaks, and background process terminations on common local devices.",
      "Build clean offline recovery mechanisms and state synchronization for active trips.",
      "Work closely with backend engineering to refine real-time dispatch and location-sharing APIs."
    ],
    mustHave: [
      "Solid production experience building and shipping non-trivial Flutter & Dart applications.",
      "Practical understanding of native Android lifecycle handling, background services, and battery-conscious location tracking.",
      "Familiarity with real-time sockets (socket.io/WebSockets) and structured state management (Bloc, Riverpod, or Provider).",
      "Ability to diagnose elusive bugs on physical test devices rather than relying solely on simulators.",
      "Clear communication, strong self-direction, and comfort taking ownership of core mobile modules."
    ],
    preferred: [
      "Statut Auto-Entrepreneur (carte ANAE) ou freelance prêt à facturer directement nos entités en Algérie (Fortement préféré).",
      "Experience with map rendering, routing, or location-based services (Mapbox, OpenStreetMap, or Google Maps SDK).",
      "Familiarity with local device constraints across the Algerian market.",
      "Based in or near Béjaïa, or available for occasional in-person field testing sessions."
    ],
    specificQuestion: "Tell us about a challenging mobile problem you diagnosed and fixed in production (such as a memory leak, broken background task, or dropped connection). What was the root cause and how did you resolve it?",
    questionPlaceholder: "Explain what was failing, how you tracked down the underlying cause, and the fix you implemented..."
  },
  {
    slug: "technical-lead-backend",
    titleEn: "Technical Lead / Senior Backend Engineer",
    titleFr: "Lead Technique / Ingénieur Backend Senior",
    titleAr: "قائد تقني / مهندس أول للواجهة الخلفية",
    department: "Engineering",
    location: "Béjaïa, Algeria / Remote (Algeria)",
    type: "Freelance (Auto-Entrepreneur préféré) / CDI",
    contractBadge: "Auto-Entrepreneur Préféré",
    priority: 2,
    status: "OPEN",
    mission: "Take ownership of the NestJS and MongoDB backend services powering Abridh dispatching, location streams, and core commerce data within the Hanuut ecosystem.",
    whyExists: "As Abridh launches commercial operations in Béjaïa, our backend must handle concurrent ride offers, transactional state changes, and geographic queries reliably, without race conditions or performance regressions.",
    responsibilities: [
      "Maintain and evolve our NestJS services and MongoDB datastore as real-time usage grows.",
      "Improve the dispatch engine to guarantee atomic driver assignments, reliable timeouts, and zero double-bookings.",
      "Design and maintain geospatial matching logic, indexing strategies, and WebSocket state management.",
      "Write automated tests for business-critical booking and state-machine transitions.",
      "Ensure candidate and customer data remains secure, well-structured, and compliant with Algerian Law 18-07."
    ],
    mustHave: [
      "Strong backend engineering experience with Node.js/TypeScript and modern server frameworks (NestJS, Express, or Fastify).",
      "Hands-on experience with MongoDB schema design, indexes, and queries.",
      "Experience working with WebSockets, concurrent state updates, and transactional safety.",
      "A pragmatic approach to software design: building clean, maintainable systems without over-engineering.",
      "Focus on code reliability, readable abstractions, and meaningful error handling."
    ],
    preferred: [
      "Statut Auto-Entrepreneur (carte ANAE) ou freelance prêt à facturer directement nos entités en Algérie (Fortement préféré).",
      "Experience with Linux VPS deployment, Docker, Nginx, or basic server maintenance.",
      "Prior exposure to logistics, delivery tracking, or booking engines.",
      "Understanding of local hosting requirements in Algeria."
    ],
    specificQuestion: "Tell us about a backend or database issue you tackled where you had to understand the system's mechanics rather than applying a superficial fix.",
    questionPlaceholder: "Explain the issue, the data or query behavior you analyzed, and the architectural or query adjustments you made..."
  },
  {
    slug: "launch-operations-coordinator",
    titleEn: "Launch & Operations Coordinator",
    titleFr: "Coordinateur des Opérations & Lancement",
    titleAr: "منسق العمليات الميدانية والإطلاق",
    department: "Operations",
    location: "Béjaïa, Algeria (On-Site)",
    type: "Freelance (Auto-Entrepreneur préféré) / Contrat",
    contractBadge: "Auto-Entrepreneur Préféré",
    priority: 3,
    status: "OPEN",
    mission: "Work directly alongside the founders in Béjaïa to handle in-person Captain onboarding, document verification, administrative follow-up, and everyday operational execution.",
    whyExists: "Technology alone doesn't create a trusted mobility network—hands-on execution does. We need a reliable operator in Béjaïa to meet Captains in person, assist them through onboarding, verify their vehicles, and help resolve operational bottlenecks during our commercial launch.",
    responsibilities: [
      "Conduct in-person onboarding sessions for new Captains in Béjaïa.",
      "Check driver identity documents and inspect vehicles against platform standards.",
      "Follow up on pending applications and help drivers complete profile verification.",
      "Help coordinate daily pilot operations and gather direct user feedback.",
      "Coordinate administrative steps, local follow-ups, and day-to-day launch tasks to support team leadership."
    ],
    mustHave: [
      "Residency in Béjaïa and strong familiarity with the city's neighborhoods, transit hubs, and commercial zones.",
      "Fluent in Algerian Arabic (Darja) and French; fluency in Kabyle (Tamazight) is a strong operational plus.",
      "Excellent interpersonal communication: patient, clear, and professional with diverse drivers and users.",
      "High level of personal organization, reliability, and punctuality.",
      "Comfort working on the ground in a fast-moving, early-stage environment."
    ],
    preferred: [
      "Statut Auto-Entrepreneur (carte ANAE) ou freelance pour une contractualisation et facturation directe et simplifiée (Fortement préféré).",
      "Prior experience in customer coordination, retail supervision, transport services, or local administration.",
      "Valid driver's license with regular driving experience in Béjaïa."
    ],
    specificQuestion: "Tell us about a situation where an operational task or project was stuck or not going as planned. What did you do to move it forward?",
    questionPlaceholder: "Describe what went wrong, the concrete steps you took, and the end result..."
  }
];

export const DEFERRED_ROLES = [
  {
    titleEn: "Captain Acquisition & Community",
    titleFr: "Acquisition & Communauté Capitaines",
    titleAr: "استقطاب ورعاية مجتمع الكباتن",
    department: "Growth",
    location: "Béjaïa, Algeria",
    statusBadge: "NOT CURRENTLY OPEN",
    timeframe: "Planned for Post-Launch"
  },
  {
    titleEn: "QA Automation & Device Engineer",
    titleFr: "Ingénieur QA & Tests Appareils",
    titleAr: "مهندس ضمان الجودة واختبارات الأجهزة",
    department: "Engineering",
    location: "Béjaïa / Remote (Algeria)",
    statusBadge: "NOT CURRENTLY OPEN",
    timeframe: "Planned for Post-Launch"
  }
];