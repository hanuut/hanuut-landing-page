// src/modules/Careers/data/careersData.js

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
    title: {
      ar: "مهندس أول لتطبيقات وأنظمة الهاتف (Flutter)",
      fr: "Ingénieur Systèmes Mobiles Senior (Flutter)",
      en: "Senior Mobile Systems Engineer (Flutter)",
    },
    department: {
      ar: "الهندسة والبرمجيات",
      fr: "Ingénierie Logicielle",
      en: "Engineering",
    },
    location: {
      ar: "بجاية، الجزائر / عن بُعد (داخل الجزائر)",
      fr: "Béjaïa, Algérie / Télétravail (Algérie)",
      en: "Béjaïa, Algeria / Remote (Algeria)",
    },
    contractType: {
      ar: "عمل حر (يُفضّل المقاول الذاتي) / عقد عمل",
      fr: "Freelance (Auto-Entrepreneur préféré) / CDI",
      en: "Freelance (Auto-Entrepreneur preferred) / Full-time",
    },
    priority: 1,
    status: "OPEN",
    mission: {
      ar: "تطوير وتحسين بنية تطبيقات أبريذ على فلاتر (تطبيق الراكب وتطبيق الكابتن)، لضمان تتبع GPS خلفي موثوق، وسرعة الاستعادة بعد انقطاع التغطية، وأداء سلس على هواتف أندرويد اليومية في شوارع الجزائر.",
      fr: "Renforcer et faire évoluer les applications Flutter d'Abridh (Passager et Capitaine) pour garantir une télémétrie GPS en arrière-plan infaillible, une reconnexion immédiate après coupure réseau, et une grande fluidité sur les appareils Android courants en Algérie.",
      en: "Harden and scale the core Abridh Flutter mobile apps (Passenger & Captain) to ensure reliable background GPS telemetry, quick recovery after network loss, and smooth performance on everyday Android devices across Algeria.",
    },
    whyExists: {
      ar: "تعتمد منصة أبريذ للتنقل على دقة إرسال الإحداثيات الجغرافية في الخلفية واستقرار اتصالات المقابس (WebSockets) طوال الرحلات النشطة. نحن بحاجة إلى مهندس متمرس يستوعب بعمق سلوك نظام أندرويد وإدارة استهلاك البطارية وشبكات الاتصال الميدانية.",
      fr: "Les opérations de mobilité d'Abridh reposent sur une géolocalisation continue en tâche de fond, des sockets résilients et des transitions d'état fiables pendant les trajets. Nous avons besoin d'un ingénieur maîtrisant le cycle de vie Android, l'économie de batterie et les contraintes réseau locales.",
      en: "Abridh's mobility operations depend on reliable GPS tracking, background socket connections, and predictable state transitions during active trips. We need an experienced engineer who understands Android system behavior, battery management, and real-world mobile network conditions.",
    },
    responsibilities: {
      ar: [
        "قيادة الهندسة المعمارية وتحسين كفاءة تطبيقات الهاتف (Passager & Capitaine).",
        "تحسين تتبع الـ GPS في الخلفية وإعادة الاتصال بمقابس WebSockets على شبكات 3G/4G غير المستقرة.",
        "تشخيص ومعالجة تشنجات الواجهة (Stuttering)، تسريبات الذاكرة (Memory Leaks)، والإغلاق القسري للعمليات الخلفية على أجهزة أندرويد المنتشرة محلياً.",
        "بناء آليات قوية للمزامنة غير المتصلة (Offline Recovery) واستعادة حالة الرحلات بعد الانقطاع.",
        "التعاون المباشر مع فريق الواجهة الخلفية (Backend) لتطوير وتأمين واجهات البرمجة اللحظية.",
      ],
      fr: [
        "Piloter l'architecture et les performances du code Flutter (Applications Passager & Capitaine).",
        "Améliorer la précision du tracking GPS en tâche de fond et la reconnexion automatique WebSockets sur réseaux 3G/4G instables.",
        "Diagnostiquer et éliminer les latences d'interface, fuites de mémoire et arrêts inopinés du système sur les appareils locaux.",
        "Concevoir des mécanismes de synchronisation hors-ligne robustes pour les trajets en cours.",
        "Collaborer étroitement avec les ingénieurs backend pour perfectionner les flux de dispatching en temps réel.",
      ],
      en: [
        "Own the core architecture and performance of Abridh's Flutter codebases (Passenger & Captain apps).",
        "Improve background GPS tracking and WebSocket reconnection reliability on patchy 3G/4G networks.",
        "Diagnose and eliminate UI stutters, memory leaks, and background process terminations on common local devices.",
        "Build clean offline recovery mechanisms and state synchronization for active trips.",
        "Work closely with backend engineering to refine real-time dispatch and location-sharing APIs.",
      ],
    },
    mustHave: {
      ar: [
        "خبرة برمجية عملية في بناء وإطلاق تطبيقات فلاتر ودارت (Flutter & Dart) معقدة قيد الاستخدام الفعلي.",
        "فهم تقني عميق لدورة حياة نظام أندرويد (Android Lifecycle)، والخدمات الخلفية (Background Services)، وتتبع الموقع الموفر للطاقة.",
        "إتقان التعامل مع مقابس الاتصال اللحظي (WebSockets / socket.io) وإدارة الحالة الهيكلية (Bloc, Riverpod, أو Provider).",
        "القدرة على استكشاف الأخطاء الصعبة على أجهزة الاختبار المادية وتتبع سجلات التشغيل بدقة بدلاً من الاعتماد التام على المحاكيات.",
        "تواصل مهني واضح ومباشر، وقدرة على الاستقلالية واتخاذ القرارات البرمجية المسؤولة.",
      ],
      fr: [
        "Expérience confirmée de développement et de livraison d'applications Flutter & Dart en production.",
        "Excellente maîtrise du cycle de vie Android, des tâches en arrière-plan et du suivi de localisation économe en batterie.",
        "Maîtrise des protocoles de communication temps réel (WebSockets / socket.io) et d'un state-management structuré (Bloc, Riverpod ou Provider).",
        "Aptitude à déboguer des anomalies complexes sur des téléphones physiques plutôt que sur simples émulateurs.",
        "Sens de l'autonomie, rigueur architecturale et communication fluide au sein d'une équipe resserrée.",
      ],
      en: [
        "Solid production experience building and shipping non-trivial Flutter & Dart applications.",
        "Practical understanding of native Android lifecycle handling, background services, and battery-conscious location tracking.",
        "Familiarity with real-time sockets (socket.io/WebSockets) and structured state management (Bloc, Riverpod, or Provider).",
        "Ability to diagnose elusive bugs on physical test devices rather than relying solely on simulators.",
        "Clear communication, strong self-direction, and comfort taking ownership of core mobile modules.",
      ],
    },
    preferred: {
      ar: [
        "حيازة بطاقة المقاول الذاتي (ANAE) أو الاستعداد للفوترة والتعاقد الحر المباشر في الجزائر (مفضل جداً).",
        "خبرة سابقة في التعامل مع برمجيات وخرائط التوجيه والمواقع (Mapbox, OpenStreetMap, أو Google Maps SDK).",
        "فهم للتحديات التقنية وقيود الأجهزة المتداولة في السوق الجزائري.",
        "الإقامة في بجاية أو بالقرب منها، أو الاستعداد لحضور جلسات الاختبار الميداني الدورية.",
      ],
      fr: [
        "Statut Auto-Entrepreneur (carte ANAE) ou freelance prêt à facturer directement nos entités en Algérie (Fortement préféré).",
        "Expérience avec l'intégration de services cartographiques et de calcul d'itinéraires (Mapbox, OpenStreetMap ou Google Maps SDK).",
        "Bonne connaissance des particularités techniques du parc mobile en Algérie.",
        "Résidence à Béjaïa ou dans les environs, ou disponibilité pour des sessions ponctuelles de tests sur le terrain.",
      ],
      en: [
        "Registered Auto-Entrepreneur (ANAE cardholder) or freelance eligible for direct invoicing in Algeria (Strongly preferred).",
        "Experience with map rendering, routing, or location-based services (Mapbox, OpenStreetMap, or Google Maps SDK).",
        "Familiarity with local device constraints across the Algerian market.",
        "Based in or near Béjaïa, or available for occasional in-person field testing sessions.",
      ],
    },
    specificQuestion: {
      ar: "حدثنا عن مشكلة تقنية معقدة في تطبيقات الهاتف واجهتك في بيئة إنتاجية حقيقية (مثل تسريب ذاكرة، تعطل مهمة خلفية، أو انقطاع اتصال لحظي). ما كان السبب الجذري وكيف قمت بحلها؟",
      fr: "Décrivez un problème mobile complexe que vous avez diagnostiqué et résolu en production (fuite mémoire, rupture de socket, service background tué par l'OS). Quelle était la cause racine et comment l'avez-vous résolu ?",
      en: "Tell us about a challenging mobile problem you diagnosed and fixed in production (such as a memory leak, broken background task, or dropped connection). What was the root cause and how did you resolve it?",
    },
    questionPlaceholder: {
      ar: "اشرح المشكلة، وكيف قمت بتتبعها وعزل مكمن الخلل، والحل الهندسي الذي طبقته...",
      fr: "Expliquez le comportement anormal, votre démarche de diagnostic et la solution technique adoptée...",
      en: "Explain what was failing, how you tracked down the underlying cause, and the fix you implemented...",
    },
  },
  {
    slug: "technical-lead-backend",
    title: {
      ar: "قائد تقني / مهندس أول للواجهة الخلفية (NestJS / MongoDB)",
      fr: "Lead Technique / Ingénieur Backend Senior (NestJS)",
      en: "Technical Lead / Senior Backend Engineer (NestJS)",
    },
    department: {
      ar: "الهندسة والبرمجيات",
      fr: "Ingénierie Logicielle",
      en: "Engineering",
    },
    location: {
      ar: "بجاية، الجزائر / عن بُعد (داخل الجزائر)",
      fr: "Béjaïa, Algérie / Télétravail (Algérie)",
      en: "Béjaïa, Algeria / Remote (Algeria)",
    },
    contractType: {
      ar: "عمل حر (يُفضّل المقاول الذاتي) / عقد عمل",
      fr: "Freelance (Auto-Entrepreneur préféré) / CDI",
      en: "Freelance (Auto-Entrepreneur preferred) / Full-time",
    },
    priority: 2,
    status: "OPEN",
    mission: {
      ar: "تولي قيادة وتطوير خدمات الواجهة الخلفية المبنية على NestJS وقواعد بيانات MongoDB، المسؤولة عن خوارزميات التوزيع اللحظي (Dispatching)، وبث الإحداثيات الجغرافية، وبيانات المنظومة التجارية في حانووت وأبريذ.",
      fr: "Prendre en charge et faire évoluer les services NestJS et bases MongoDB assurant le dispatching en temps réel d'Abridh, les flux géospatiaux et les transactions du système Hanuut.",
      en: "Take ownership of the NestJS and MongoDB backend services powering Abridh dispatching, location streams, and core commerce data within the Hanuut ecosystem.",
    },
    whyExists: {
      ar: "مع إطلاق أبريذ تجارياً في مدينة بجاية، يجب أن تتحمل أنظمتنا طلبات الرحلات المتزامنة وتغيرات الحالة والبيانات الجغرافية بسرعة واعتمادية دون أي تعارض زمني (Race Conditions) أو تراجع في الأداء.",
      fr: "À l'heure du déploiement commercial d'Abridh à Béjaïa, notre backend doit orchestrer des offres de trajets concurrentes, des mises à jour transactionnelles et des requêtes géospatiales sans régression ni blocage.",
      en: "As Abridh launches commercial operations in Béjaïa, our backend must handle concurrent ride offers, transactional state changes, and geographic queries reliably, without race conditions or performance regressions.",
    },
    responsibilities: {
      ar: [
        "تطوير واستقرار خدمات NestJS ومستودعات MongoDB مع نمو حجم العمليات والاستخدام اللحظي.",
        "تحسين محرك التوزيع التلقائي (Dispatch Engine) لضمان دقة إسناد الرحلات ومنع الحجز المزدوج وضبط المهل الزمنية بدقة ذرية.",
        "تصميم وصيانة الاستعلامات الجغرافية المكانية (Geospatial Indexing) وإدارة حالات الـ WebSockets عالية الكثافة.",
        "كتابة اختبارات آلية شاملة لآلات الحالات (State Machines) وحالات الحجز الحرجة لضمان استقرار العمليات.",
        "ضمان حماية بيانات المستخدمين وتأمينها وفق أحكام القانون الجزائري 18-07.",
      ],
      fr: [
        "Maintenir et optimiser les microservices NestJS et clusters MongoDB face à la montée en charge.",
        "Perfectionner le moteur de dispatch pour garantir l'attribution atomique des courses et zéro double-réservation.",
        "Concevoir et maintenir les index géospatiaux et la gestion d'état des sockets sous forte concurrence.",
        "Rédiger des tests automatisés couvrant les transitions d'état critiques du service de mobilité.",
        "Assurer la conformité et la sécurité des données conformément à la loi algérienne 18-07.",
      ],
      en: [
        "Maintain and evolve our NestJS services and MongoDB datastore as real-time usage grows.",
        "Improve the dispatch engine to guarantee atomic driver assignments, reliable timeouts, and zero double-bookings.",
        "Design and maintain geospatial matching logic, indexing strategies, and WebSocket state management.",
        "Write automated tests for business-critical booking and state-machine transitions.",
        "Ensure candidate and customer data remains secure, well-structured, and compliant with Algerian Law 18-07.",
      ],
    },
    mustHave: {
      ar: [
        "خبرة متينة في هندسة النظم الخلفية باستخدام Node.js/TypeScript وأطر العمل الحديثة (NestJS, Express, أو Fastify).",
        "خبرة تطبيقية معمقة في تصميم مخططات MongoDB وفهارسها المتقدمة وتحسين الاستعلامات التجميعية (Aggregations).",
        "إتقان العمل مع مقابس WebSockets وإدارة الحالات المتزامنة وسلامة المعاملات الذرية.",
        "نهج هندسي عملي يركز على الكود النظيف والقابل للصيانة بعيداً عن التعقيد الزائد (Over-engineering).",
        "تركيز عالي على موثوقية الأداء ومعالجة الأخطاء بموضوعية ووضوح.",
      ],
      fr: [
        "Solide expérience backend avec Node.js, TypeScript et des frameworks modulaires (NestJS, Express ou Fastify).",
        "Maîtrise pratique de la modélisation sous MongoDB, de l'indexation et des pipelines d'agrégation.",
        "Expérience approfondie des WebSockets, de la concurrence et des garanties transactionnelles.",
        "Approche pragmatique privilégiant la simplicité, la lisibilité et la robustesse plutôt que la sur-ingénierie.",
        "Excellente gestion des exceptions, des logs et de la stabilité sous charge.",
      ],
      en: [
        "Strong backend engineering experience with Node.js/TypeScript and modern server frameworks (NestJS, Express, or Fastify).",
        "Hands-on experience with MongoDB schema design, indexes, and queries.",
        "Experience working with WebSockets, concurrent state updates, and transactional safety.",
        "A pragmatic approach to software design: building clean, maintainable systems without over-engineering.",
        "Focus on code reliability, readable abstractions, and meaningful error handling.",
      ],
    },
    preferred: {
      ar: [
        "حيازة بطاقة المقاول الذاتي (ANAE) أو الاستعداد للفوترة والتعاقد الحر المباشر في الجزائر (مفضل جداً).",
        "خبرة عملية في إدارة خوادم Linux VPS، حاويات Docker، وأدوات Nginx والمراقبة.",
        "اطلاع مسبق على أنظمة اللوجستيك والتتبع وحجز الرحلات التشاركية.",
        "فهم لمتطلبات وتحديات الاستضافة السحابية المحلية داخل الجزائر.",
      ],
      fr: [
        "Statut Auto-Entrepreneur (carte ANAE) ou freelance prêt à facturer directement nos entités en Algérie (Fortement préféré).",
        "Compétences d'administration système de base : serveurs Linux, conteneurs Docker, Nginx.",
        "Expérience préalable dans la mobilité, la livraison ou les systèmes de réservation temps réel.",
        "Connaissance des impératifs d'hébergement des données en Algérie.",
      ],
      en: [
        "Registered Auto-Entrepreneur (ANAE cardholder) or freelance eligible for direct invoicing in Algeria (Strongly preferred).",
        "Experience with Linux VPS deployment, Docker, Nginx, or basic server maintenance.",
        "Prior exposure to logistics, delivery tracking, or booking engines.",
        "Understanding of local hosting requirements in Algeria.",
      ],
    },
    specificQuestion: {
      ar: "حدثنا عن مشكلة معقدة واجهتك في الواجهة الخلفية أو قواعد البيانات، تطلبت منك فهماً ميكانيكياً عميقاً للأنظمة بدلاً من تطبيق حلول ترقيعية سطحية.",
      fr: "Décrivez un problème de backend ou de base de données où vous avez dû analyser le fonctionnement interne du système plutôt que d'appliquer un correctif superficiel.",
      en: "Tell us about a backend or database issue you tackled where you had to understand the system's mechanics rather than applying a superficial fix.",
    },
    questionPlaceholder: {
      ar: "اشرح المشكلة، وسلوك الاستعلامات أو البيانات الذي قمت بتحليله، والتعديلات المعمارية التي أدخلتها...",
      fr: "Précisez l'incident, le comportement des requêtes analysé et les ajustements structurels réalisés...",
      en: "Explain the issue, the data or query behavior you analyzed, and the architectural or query adjustments you made...",
    },
  },
  {
    slug: "launch-operations-coordinator",
    title: {
      ar: "منسق العمليات الميدانية والإطلاق (بجاية)",
      fr: "Coordinateur des Opérations & Lancement (Béjaïa)",
      en: "Launch & Operations Coordinator (Béjaïa)",
    },
    department: {
      ar: "العمليات الميدانية",
      fr: "Opérations Terrain",
      en: "Operations",
    },
    location: {
      ar: "بجاية، الجزائر (حضوري ميداني)",
      fr: "Béjaïa, Algérie (Sur site)",
      en: "Béjaïa, Algeria (On-Site)",
    },
    contractType: {
      ar: "عمل حر (يُفضّل المقاول الذاتي) / عقد محدد",
      fr: "Freelance (Auto-Entrepreneur préféré) / Contrat",
      en: "Freelance (Auto-Entrepreneur preferred) / Contract",
    },
    priority: 3,
    status: "OPEN",
    mission: {
      ar: "العمل جنباً إلى جنب مع المؤسسين في مدينة بجاية لإدارة استقبال الكباتن حضورياً، والتحقق من الوثائق والمركبات، والمتابعة الإدارية والتنسيق الميداني اليومي لإطلاق الخدمة.",
      fr: "Travailler directement aux côtés des fondateurs à Béjaïa pour piloter l'onboarding physique des Capitaines, vérifier les documents, contrôler les véhicules et coordonner le lancement sur le terrain.",
      en: "Work directly alongside the founders in Béjaïa to handle in-person Captain onboarding, document verification, administrative follow-up, and everyday operational execution.",
    },
    whyExists: {
      ar: "التكنولوجيا وحدها لا تكفي لبناء شبكة تنقل موثوقة في الميدان. نحتاج إلى منسق موثوق في بجاية للقاء الكباتن شخصياً، ومساعدتهم في التسجيل، وفحص المركبات، وحل العراقيل التشغيلية اليومية.",
      fr: "L'application seule ne crée pas un réseau de confiance : l'exécution terrain est décisive. Nous recrutons un coordinateur rigoureux à Béjaïa pour accueillir les Capitaines, inspecter leurs véhicules et résoudre les points de blocage.",
      en: "Technology alone doesn't create a trusted mobility network—hands-on execution does. We need a reliable operator in Béjaïa to meet Captains in person, assist them through onboarding, verify their vehicles, and help resolve operational bottlenecks during our commercial launch.",
    },
    responsibilities: {
      ar: [
        "تنظيم وإدارة جلسات استقبال الكباتن الجدد بمدينة بجاية حضورياً.",
        "التحقق من صحة وثائق الهوية والسيارات ومطابقتها لمعايير المنصة.",
        "متابعة ملفات التسجيل قيد الانتظار ومساعدة الأعضاء في استكمال تفعيل حساباتهم.",
        "المشاركة في متابعة العمليات التجريبية اليومية وجمع الملاحظات المباشرة من السائقين والركاب.",
        "التنسيق الإداري والميداني لتسهيل مهام القيادة وتثبيت الإطلاق في المحاور الرئيسية للمدينة.",
      ],
      fr: [
        "Animer les sessions d'accueil et d'embarquement en personne des nouveaux Capitaines à Béjaïa.",
        "Vérifier la conformité des documents d'identité et des pièces du véhicule.",
        "Assurer le suivi des dossiers en attente et assister les chauffeurs jusqu'à l'activation.",
        "Suivre l'activité pilote quotidienne et recueillir les retours d'expérience directs.",
        "Prendre en charge les formalités de terrain et épauler les fondateurs dans les étapes du lancement.",
      ],
      en: [
        "Conduct in-person onboarding sessions for new Captains in Béjaïa.",
        "Check driver identity documents and inspect vehicles against platform standards.",
        "Follow up on pending applications and help drivers complete profile verification.",
        "Help coordinate daily pilot operations and gather direct user feedback.",
        "Coordinate administrative steps, local follow-ups, and day-to-day launch tasks to support team leadership.",
      ],
    },
    mustHave: {
      ar: [
        "الإقامة الدائمة في بجاية ومعرفة شاملة بأحيائها ومحاور التنقل والمحطات الرئيسية فيها.",
        "إتقان اللهجة الجزائرية (الدارجة) واللغة الفرنسية؛ وإتقان القبائلية (الأمازيغية) يعتبر ميزة عملياتية هامة جداً.",
        "مهارات تواصل شخصية ممتازة: أسلوب واضح، رحب، ومحترم في التعامل مع مختلف الفئات.",
        "انضباط شخصي عالٍ، دقة في المواعيد، واحترافية في متابعة المهام دون حاجة لإشراف دائم.",
        "مرونة وراحة تامة في العمل الميداني ضمن بيئة ناشئة وسريعة التطور.",
      ],
      fr: [
        "Résidence permanente à Béjaïa et excellente connaissance des quartiers, axes et pôles de circulation.",
        "Maîtrise de l'arabe algérien (Darja) et du français ; la maîtrise du kabyle (Tamazight) constitue un atout déterminant.",
        "Excellentes qualités relationnelles : communication claire, écoute, patience et courtoisie.",
        "Grande rigueur d'organisation personnelle, ponctualité et sens des responsabilités.",
        "Aisance sur le terrain au sein d'un projet technologique en phase d'amorçage.",
      ],
      en: [
        "Residency in Béjaïa and strong familiarity with the city's neighborhoods, transit hubs, and commercial zones.",
        "Fluent in Algerian Arabic (Darja) and French; fluency in Kabyle (Tamazight) is a strong operational plus.",
        "Excellent interpersonal communication: patient, clear, and professional with diverse drivers and users.",
        "High level of personal organization, reliability, and punctuality.",
        "Comfort working on the ground in a fast-moving, early-stage environment.",
      ],
    },
    preferred: {
      ar: [
        "حيازة بطاقة المقاول الذاتي (ANAE) أو الاستعداد للتعاقد الحر المباشر لتسريع الإجراءات (مفضل جداً).",
        "خبرة سابقة في خدمة العملاء، إدارة المبيعات، أو خدمات النقل واللوجستيك.",
        "رخصة سياقة سارية المفعول مع قيادة منتظمة في بجاية.",
      ],
      fr: [
        "Statut Auto-Entrepreneur (carte ANAE) ou freelance pour une contractualisation directe et simplifiée (Fortement préféré).",
        "Expérience préalable en relation client, encadrement commercial, logistique ou transport.",
        "Permis de conduire valide et expérience régulière de conduite à Béjaïa.",
      ],
      en: [
        "Statut Auto-Entrepreneur (carte ANAE) or freelance for direct and simplified contracting (Strongly preferred).",
        "Prior experience in customer coordination, retail supervision, transport services, or local administration.",
        "Valid driver's license with regular driving experience in Béjaïa.",
      ],
    },
    specificQuestion: {
      ar: "حدثنا عن موقف أو مهمة ميدانية واجهت فيها تعطيلاً أو لم تسر كما خُطط لها. كيف تصرفت عملياً لتجاوز العقبة وتحقيق الهدف؟",
      fr: "Racontez une situation où une tâche opérationnelle était bloquée ou ne se déroulait pas comme prévu. Quelles initiatives concrètes avez-vous prises pour débloquer la situation ?",
      en: "Tell us about a situation where an operational task or project was stuck or not going as planned. What did you do to move it forward?",
    },
    questionPlaceholder: {
      ar: "اشرح المشكلة، والإجراءات الملموسة التي اتخذتها، والنتيجة التي حققتها...",
      fr: "Décrivez l'obstacle rencontré, vos actions directes et le résultat obtenu...",
      en: "Describe what went wrong, the concrete steps you took, and the end result...",
    },
  },
];

export const DEFERRED_ROLES = [
  {
    title: {
      ar: "مسؤول استقطاب ورعاية مجتمع الكباتن",
      fr: "Responsable Acquisition & Communauté Capitaines",
      en: "Captain Acquisition & Community Lead",
    },
    department: {
      ar: "النمو والمجتمع",
      fr: "Croissance & Communauté",
      en: "Growth",
    },
    location: {
      ar: "بجاية، الجزائر",
      fr: "Béjaïa, Algérie",
      en: "Béjaïa, Algeria",
    },
    statusBadge: {
      ar: "قيد التحضير للإطلاق",
      fr: "Ouverture prochaine",
      en: "Opening Post-Launch",
    },
  },
  {
    title: {
      ar: "مهندس ضمان الجودة واختبارات الأجهزة (QA)",
      fr: "Ingénieur QA & Tests d'Appareils",
      en: "QA Automation & Device Engineer",
    },
    department: {
      ar: "الهندسة والبرمجيات",
      fr: "Ingénierie Logicielle",
      en: "Engineering",
    },
    location: {
      ar: "بجاية / عن بُعد (الجزائر)",
      fr: "Béjaïa / Télétravail (Algérie)",
      en: "Béjaïa / Remote (Algeria)",
    },
    statusBadge: {
      ar: "قيد التحضير للإطلاق",
      fr: "Ouverture prochaine",
      en: "Opening Post-Launch",
    },
  },
];