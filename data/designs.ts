import { Design } from '@/types';

export const DESIGNS: Design[] = [
  {
    id: 'pinnacle-iitjee',
    slug: 'pinnacle-iitjee-entrance-portal',
    title: 'Pinnacle IIT–JEE Entrance Portal & Ecosystem',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'concept',
    conceptTypeLabel: 'Complete Concept',
    shortDescription: 'High-conversion admissions engine paired with an end-to-end student onboarding, batch scheduling, and exam registration portal.',
    fullDescription: 'Architected specifically for competitive coaching enterprises and university entrance portals. Combines a high-impact editorial landing experience with a structured timetable filtering engine, multi-tier enrollment funnels, and real-time exam notifications. Designed to handle intense traffic surges on results and admission deadlines.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLEJjKmOkt75Ud707ezN9foKnMHAKm2vTiAD1LKWpszIoVzIBzGNDegjbgtqfzoK6ALjHafG8qfvYliNIK2zDWr8-9aP1Ai_AnrTsPM151-2GmGBwGTSJSjDifb6FFaZSkuWY-VrxJnHf1KoBMYBZZ46-jCtN0NAw9Vkkg-hUrUnIGPPDvWOPri-1XUwomNBPocuMuTNFIgz0mAhyncTPM6AGDlq0Y6B18uydy6Beq',
    screenPreviews: [
      {
        id: 'pinnacle-desktop-hero',
        title: 'Desktop Executive Hero & Timetable Hub',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA740cfigzC-5QS4fiL_wB4qp-SLCwZBRCRI-Kqru33SKey_1ccxAsdUAqxLW30TvogXQ3raDhBaIYT8pQCJWwB5EdBu9FGs9GwLxvJqNdbUJ5EH_hhP6sy6RIb3L78iSCrN6dgK_yVxrZvDXUPKdc6QrvViZ988XLZjXSFncr3pHYYuVcWjjZVbDRQ7OsHCYf6RGU7fhW8id-4tAO3R4XzAKUhbLvG2BLE-c8fuRqw',
        description: '1440px viewport showcasing batch countdown schedules, educator badges, and admission inquiry forms.'
      },
      {
        id: 'pinnacle-tablet-explorer',
        title: 'Tablet Course Catalog View',
        viewport: 'tablet',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWbkjdYtLzBMPRZOx8slN-qzsCZ-ULSxzDJi5C7NjOZcyD8uPUfCf4811qelXVNyp8joe0e9KYO3QCc-6ue_20zgy05iiP1q2EDCdzzce9rVgJGNy_PgkuQX81jRTI3EuoBBakrb9ipdw8pD0CGNF6DI_78Cj75szU7trbZFAZCEAuKiABJsbalE0DWcVt16vCZgHRbX2qnZfzYlYZIBId9PYioLjzAlJ-8NFjyhpi',
        description: 'Adaptive 2-column layout for tablet touch screens during in-person student counseling.'
      },
      {
        id: 'pinnacle-mobile-registration',
        title: 'Mobile Registration & Class Alerts',
        viewport: 'mobile',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaEPcxEf3V3jKKJ9YBJft3e94_GZqEZ8M4k6RYrx9qUNkclzICIJ_v3SGcpVd2bfCMQZ-bYVrTObUg4V51GfSgxxS-50qcnzLbdG_oBMy1EF0st5C7fLcJFoVYwrgcjemVL60F3dmJsGRZKejKhkvVojtAF-HQFYvdewaASXlPasBQMvAU0kYwUAIobxmshfM1uML9mskKnm8PVjQqEBwSV6ZmEG39g4pJsqhUGAry',
        description: 'Sub-30-second mobile registration flow with instant WhatsApp counselor callback trigger.'
      }
    ],
    features: [
      {
        title: 'Batch Timetable & Multi-Center Scheduling Engine',
        description: 'Dynamic filtering across regional branches with real-time class rescheduling SMS alert hooks.',
        status: 'UI Prototype Included',
        isCore: true
      },
      {
        title: 'Automated Merit Scholarship & EMI Calculator',
        description: 'Instant rank-based fee discount breakdown with automated credit eligibility checks.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Dynamic Faculty Profile Showcase',
        description: 'Interactive educator credentials directory with research paper filter and video reels.',
        status: 'Module Included',
        isCore: true
      },
      {
        title: 'WhatsApp Lead Dispatch Webhook Flow',
        description: 'Sub-30-second lead routing via WhatsApp Cloud API with customized brochure PDFs.',
        status: 'Frontend Hook Included'
      }
    ],
    technicalSpecs: {
      devHours: 140,
      techStack: ['Next.js 15 App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (768px)', 'Mobile (375px)'],
      deliverables: [
        'Atomic Figma UI tokens & design system',
        'Clean Next.js 15 production repository',
        'Responsive layout tests across iOS & Android browsers',
        'SEO metadata & OpenGraph social share cards'
      ],
      architectureNotes: 'SSR for instant search engine indexability with edge-cached course schedules.'
    },
    commercial: {
      estimatedBaseINR: 120000,
      licenseType: 'Enterprise Single-Client Perpetual',
      warrantyDays: 90
    },
    tags: ['Complete Concept', 'EdTech', 'Admissions', 'Next.js', 'Coaching'],
    featured: true,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual preview demonstrates the complete user interface layout and interactive state transitions. Backend database tables (e.g. PostgreSQL), SMS/WhatsApp gateway credentials, and payment gateway merchant keys require independent production configuration.',
    relatedIds: ['aura-lms', 'faculty-showcase', 'smart-fee-calculator', 'mock-test-engine']
  },
  {
    id: 'apex-health',
    slug: 'apex-health-telemed-suite',
    title: 'Apex Health Telemed Suite',
    categoryId: 'healthcare',
    categoryName: 'Healthcare & Telemed',
    conceptType: 'concept',
    conceptTypeLabel: 'Complete Concept',
    shortDescription: 'Full patient-physician intake lifecycle, interactive video room layout, and real-time electronic health records preview.',
    fullDescription: 'Engineered for medical practices, multi-specialty polyclinics, and digital telemedicine startups. Offers an executive, clinical-grade interface featuring calendar appointment scheduling, HIPAA-styled patient intake sheets, prescription vaults, and live queue status monitors.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdxaLFzk5vvd4zeBWI8UjO08CTjGfBAg87Q9_-wHcnhkGPL9kG4yP8ogGt7om9HWZ4qsd76UQLl06UYVCzyJHlf7e1xu-AXCxQEEmiTHbwLzegRYTkqqHwusIhwwvWWZj6UhtruFn6xLMewzF9u-dHFnrgW6g2S3-rZxg55fYlo5YOe16U-H54OO9IHW6ikKDe5-PB52TlY9E8FnHxHd1Ex0FwqQZqc71-dKZs1Rt_',
    screenPreviews: [
      {
        id: 'apex-desktop-triage',
        title: 'Clinical Triage Console',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaV6-QArRWyXnfCh9VlRpIpmMNiiJ02oCYHY-SYqgAL-KHXiFd2-KdoWs4TPyelPR5BRqgvNNh8Z5irvXDfhRW-e-pAC0vJGMQefBejn_B5zjZeYg5b-wHpZ_r8ikVD2DYS8FVjK55PgPJpTHqxXQXjgAhDbKLbudswGBVoqFLLldY__sMDg-LmiX_FB7ncf7uSZ9kLrPJj59dWcrEK3a9y0am_ZnbxxlpgFHlOHvb',
        description: 'EHR timeline with vital telemetry readings and consultation waiting room.'
      }
    ],
    features: [
      {
        title: 'Doctor Appointment Queue & Availability Matrix',
        description: 'Multi-doctor scheduling with time slot availability and calendar sync.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Patient Intake & Telehealth Room Frame',
        description: 'Clean video consult frame placeholder with vital signs telemetry panel.',
        status: 'UI Prototype Included',
        isCore: true
      },
      {
        title: 'Prescription & Diagnostic Report Vault',
        description: 'Categorized document repository for lab results and discharge summaries.',
        status: 'Layout Included'
      }
    ],
    technicalSpecs: {
      devHours: 95,
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (768px)', 'Mobile (375px)'],
      deliverables: [
        'Complete telemedicine patient UI kit',
        'Responsive appointment booking flow',
        'WCAG AAA accessible medical color scheme',
        'Source code transfer with GitHub repository'
      ]
    },
    commercial: {
      estimatedBaseINR: 85000,
      licenseType: 'Commercial License',
      warrantyDays: 90
    },
    tags: ['Complete Concept', 'Healthcare', 'Doctor Booking', 'Telemedicine'],
    featured: true,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual preview illustrates the clinical user experience. Actual WebRTC streaming servers, compliance certification (HIPAA/DISHA), and medical lab API connections require designated server-side implementation.',
    relatedIds: ['vertex-saas', 'pinnacle-iitjee']
  },
  {
    id: 'kinetix-luxury',
    slug: 'kinetix-d2c-luxury-storefront',
    title: 'Kinetix D2C Luxury Storefront',
    categoryId: 'ecommerce',
    categoryName: 'Ecommerce & Retail',
    conceptType: 'concept',
    conceptTypeLabel: 'UI Screen & Funnel',
    shortDescription: 'High-ticket apparel storefront featuring micro-interactions, floating bag drawer, and seamless headless checkout.',
    fullDescription: 'A modern direct-to-consumer luxury fashion experience that blends bold architectural typography, high-definition product carousels, responsive lookbook galleries, and a frictionless 2-step checkout drawer optimized for high average order values.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbHEhTvzrpZqLxKPT6jKvl55k_SgmOPcQsIRJxowLcy8zA3RTHzXO1gwUN36N7IGbDTOSom7kKbbz7u71B55XUJ-WP3udyMLL2JMmDSKA_rQ-LyATiYeO_yBH1xaNFfM4UZxCY57tgTb10r82w-R-FVO919qHJXWRBDKet1s4Ps37s3LvVkjm0biej6eTgXuXMOEnSG72SOBRByg7Gx9xWtws_bzdWqur4g1zCcZBs',
    screenPreviews: [
      {
        id: 'kinetix-desktop-hero',
        title: 'Editorial Hero & Curated Collection',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbHEhTvzrpZqLxKPT6jKvl55k_SgmOPcQsIRJxowLcy8zA3RTHzXO1gwUN36N7IGbDTOSom7kKbbz7u71B55XUJ-WP3udyMLL2JMmDSKA_rQ-LyATiYeO_yBH1xaNFfM4UZxCY57tgTb10r82w-R-FVO919qHJXWRBDKet1s4Ps37s3LvVkjm0biej6eTgXuXMOEnSG72SOBRByg7Gx9xWtws_bzdWqur4g1zCcZBs',
        description: 'Monochrome product carousel with tactile cursor interactions and quick buy drawers.'
      }
    ],
    features: [
      {
        title: 'Floating Bag Drawer with Real-Time Totalizer',
        description: 'Slide-out cart drawer with free-shipping progress indicators and cross-sell pills.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Modular Lookbook & Hotspot Tagging',
        description: 'Interactive editorial photography with tap-to-inspect item tags.',
        status: 'Module Included',
        isCore: true
      },
      {
        title: 'Multi-Currency & Size Guide Modal',
        description: 'Instant currency formatting and interactive measurement tables.',
        status: 'Included'
      }
    ],
    technicalSpecs: {
      devHours: 85,
      techStack: ['Next.js 15', 'Tailwind CSS', 'Framer Motion', 'Headless Ready'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (768px)', 'Mobile (375px)'],
      deliverables: [
        'Shopify Hydrogen or Next.js Commerce compatible frontend',
        'Complete UI component library for PDP and PLP',
        'Fluid image gallery with zoom inspection',
        'Production checkout step layout'
      ]
    },
    commercial: {
      estimatedBaseINR: 72000,
      licenseType: 'Commercial License',
      warrantyDays: 90
    },
    tags: ['Complete Concept', 'Ecommerce', 'Luxury Fashion', 'Headless', 'D2C'],
    featured: true,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual preview includes the complete storefront design, product detail page architecture, and cart drawer. Real inventory synchronization, payment processor webhooks, and shipping rate calculations require backend integration.',
    relatedIds: ['titan-industrial', 'vertex-saas']
  },
  {
    id: 'vertex-saas',
    slug: 'vertex-b2b-saas-dashboard',
    title: 'Vertex B2B SaaS Dashboard',
    categoryId: 'saas',
    categoryName: 'Software & SaaS',
    conceptType: 'module',
    conceptTypeLabel: 'Functional Module',
    shortDescription: 'Unified analytics control center equipped with multi-tenant role provisioning, automated usage metering, and query visualizers.',
    fullDescription: 'A technical software interface built for modern B2B SaaS platforms. Features dense data grids, telemetry charts, role-based permission toggles, audit logs, and developer API key generators in a refined dark obsidian aesthetic.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiNAfeRSjx1DJjl1ltisXaAVFZU0n3depmTKKCnlC4yK-CzlfbW0HoyHeIag-Tp5ZsNUcOq65nxxSXaqirnGRmPecxhw4DAhbafOMZXMqOSUnnMHOLO_1fFtLR20ycLGJrkXw-soTnnPvOcVZZ_kOSKFCH-Tm9bVenITymEGvd3oq8ukCjGl7h2Jo5tLi07rfeUYXASNWQzlMql9gaU_Yr2au-0fcmmCWa_EfOU8nl',
    screenPreviews: [
      {
        id: 'vertex-desktop-console',
        title: 'Telemetry & Server Metrics Console',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyIS4-VIXy_PJ2L0PdgqXjqbfpcPPXbLqsRzvPV92USeHEXYgdylobQhfyhs6_11LWGHTiNbdqwW6DdyLsZ7-zgb2_pUWUbSsyDosq7BjidCt2D-IIljOB-zGj5TuRBUbqwWJBQubi-djJl8x9h0dWjqtBVQPcDXEyJwzqQBBSRZYRkSbeFqu9MaCVxEy4AsVkBEybwxKCedYav5thQjhG5SbOFzG4vV5XFqcV1wTc',
        description: 'Real-time throughput metrics, latency heatmaps, and query visualizers.'
      }
    ],
    features: [
      {
        title: 'High-Density Data Grid with Sorting & Filtering',
        description: 'Virtual scrolling enabled table layout for thousands of audit log records.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Usage Metering & Tier Progress Rings',
        description: 'Real-time quota monitoring with alert threshold configuration.',
        status: 'Module Included',
        isCore: true
      },
      {
        title: 'Role-Based Access Control (RBAC) Matrix',
        description: 'Visual permission matrix for admin, developer, and viewer roles.',
        status: 'UI Prototype Included'
      }
    ],
    technicalSpecs: {
      devHours: 110,
      techStack: ['React 19', 'Next.js App Router', 'Tailwind CSS', 'Recharts / SVG'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (1024px)'],
      deliverables: [
        'Complete SaaS admin console UI source code',
        'Data table component with pagination and sorting',
        'Dark mode optimized theme system',
        'API endpoint mock handlers'
      ]
    },
    commercial: {
      estimatedBaseINR: 88000,
      licenseType: 'Commercial License',
      warrantyDays: 90
    },
    tags: ['Functional Module', 'SaaS', 'Dashboard', 'Telemetry', 'B2B'],
    featured: true,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual showcase illustrates dashboard views, charts, and table interactions with mock state. Real database query execution and live server metrics require backend connection.',
    relatedIds: ['aura-lms', 'apex-health']
  },
  {
    id: 'aura-lms',
    slug: 'aura-lms-student-dashboard',
    title: 'Aura LMS Student Dashboard & Analytics',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'module',
    conceptTypeLabel: 'Functional Module',
    shortDescription: 'Self-service learning space with progress tracking, attendance analytics, interactive question bank, and video lecture synchronization.',
    fullDescription: 'Designed as a companion module for academic institutions and coaching academies. Provides students with an organized view of their enrolled courses, pending assignment submissions, test schedules, and personal performance trajectory.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNC5AcxA0CQfnn4NgVfzQ2jWrq3P4b7xxtIVMuTxYTM26dKknxTiHcg0QxtuGGMqrxhiMbr-AumkmUB7Prkd5o-O5AsrE2M6tgXCgT_WheY-yu1JgDYVE5fMve5gS5_C31LwcvpyFCOH5xdTO9-bZe0wGkGxutghvWqY0N_R6NUycg3kRE42oyUpey8yg1_azekn91LUTUl7_1hjVA-H-F1dWkc_dMMs4KHylQ8J07',
    screenPreviews: [
      {
        id: 'aura-desktop-lms',
        title: 'Student Course Player & Gradebook',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdY8hucC4-AuHZFBJqpiNsoTIeN1O6TbnPgONDQyH8gUnLeEAuwiUWmBFT9AxiKl4xu75qZbY_Kq_RGu8F2dk3yYlAILvudkv3WZ03yUiqBZZNPBv15eizsCbgB_Juk-sRphFE0UOerHZDgv2jNqIfOaMS2Veb3YcXXPWAyfpSbd5zJI8qPoNxUUCDes-9WI2psyMu8KKHM3dqWhzBKY1NqZGjGqCRSFiRpNZKyTp6',
        description: 'VOD player with chapter markers, interactive quiz overlays, and progress graphs.'
      }
    ],
    features: [
      {
        title: 'Video Lecture Player with Chapter Index',
        description: 'Responsive video container with timestamped notes and playback speed toggles.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Question Bank Solver & Timed Practice Arena',
        description: 'Interactive question solver interface with immediate step-by-step solutions.',
        status: 'Module Included',
        isCore: true
      },
      {
        title: 'Student Gradebook & Attendance Graph',
        description: 'Visual progress trackers with weekly assignment milestone indicators.',
        status: 'Included'
      }
    ],
    technicalSpecs: {
      devHours: 65,
      techStack: ['Next.js', 'React 19', 'Tailwind CSS', 'Lucide Icons'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (768px)', 'Mobile (375px)'],
      deliverables: [
        'Modular LMS dashboard component set',
        'Video player layout with playlist sidebar',
        'Question bank interactive prototype',
        'State persistence hooks'
      ]
    },
    commercial: {
      estimatedBaseINR: 45000,
      licenseType: 'Commercial License',
      warrantyDays: 90
    },
    tags: ['Functional Module', 'EdTech', 'LMS', 'Dashboard', 'Video Player'],
    featured: false,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual preview demonstrates the student dashboard interface. Video transcoding pipelines, student auth databases, and quiz grading engines require backend integration.',
    relatedIds: ['pinnacle-iitjee', 'mock-test-engine']
  },
  {
    id: 'faculty-showcase',
    slug: 'dynamic-faculty-showcase-grid',
    title: 'Dynamic Faculty Showcase Grid Section',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'section',
    conceptTypeLabel: 'Landing Section',
    shortDescription: 'High-credibility educator section with interactive credential popups, alumni achievement statistics, and subject tags.',
    fullDescription: 'A modular, high-impact bento grid section designed to establish elite educational authority. Features monochrome mentor portraits, educational credentials, years of domain tenure, student All-India Rank track records, and video lecture previews.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpkdvMRV5Dcy614Mpdu5JmifI3ead9iUM697qSqFpcl0lLKeCsN41wxbOwbe3lxGmq6cW-q4ZMT_61j5p_WeQ4IV9GqzQ2EG45jOXAUuKBeGjPuF8HsUzPvplYalNfveG9RnBT6d4rLwhlm7fz3PRXbQT-7OJUfnpi074Xkk3WLdZ6P2c5Oj3AYsqlAjhZN3VB3Zr5IrvcB-qrumuzE4D6zoVq8hpi0kPha6PO768t',
    screenPreviews: [
      {
        id: 'faculty-grid-preview',
        title: 'Faculty Bento Cards Grid',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCToIAdW0DBbDZVMFupBON0LdPDQ0Qjthr-LXPPMTH_ZkhhdXhsIyqSD9y-vH3sEyzZ_iMWfVL66m80Snr0UieYTugty0rwNd1tlcRZI5Trbv7PkEbA24EW1vpmbj4lSRfwdS8NiJz132kLZbUz2v3UgoW8CmEiOV4s5xjr-g8OuaxoEf0V27G0lKV7p9v-dy7fDEqKBZuIMocIClGbv9opuwtHdjLGdFq9shq0Tpzb',
        description: 'Interactive cards with pedigree chips, department filters, and demo reel modals.'
      }
    ],
    features: [
      {
        title: 'Alumni Pedigree & Achievement Badges',
        description: 'Clean typographic indicators showcasing mentor qualifications (e.g. ex-IIT, AIIMS).',
        status: 'Included',
        isCore: true
      },
      {
        title: 'Department & Subject Filter Bar',
        description: 'Instant client-side filter by subject (Physics, Chemistry, Mathematics, Biology).',
        status: 'Interactive Included',
        isCore: true
      },
      {
        title: 'Sample Demo Lecture Video Embed Modal',
        description: 'Lightweight modal dialog for previewing teaching style.',
        status: 'Component Included'
      }
    ],
    technicalSpecs: {
      devHours: 22,
      techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Mobile (375px)'],
      deliverables: [
        'Drop-in React component for any Next.js landing page',
        'Configurable JSON data schema for faculty rosters',
        'Responsive mobile carousel fallback'
      ]
    },
    commercial: {
      estimatedBaseINR: 18000,
      licenseType: 'Section License',
      warrantyDays: 60
    },
    tags: ['Landing Section', 'Faculty', 'Bento Grid', 'Education'],
    featured: false,
    popular: false,
    newAddition: true,
    functionalNotice: 'Visual component integrates with any standard Next.js page. Content is populated via props or local CMS data structures.',
    relatedIds: ['pinnacle-iitjee', 'zenith-landing']
  },
  {
    id: 'smart-fee-calculator',
    slug: 'smart-fee-calculator-emi-planner',
    title: 'Smart Fee & EMI Installment Planner',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'module',
    conceptTypeLabel: 'Functional Module',
    shortDescription: 'Real-time installment breakdown widget featuring instant merit-scholarship calculations and financing schedule estimators.',
    fullDescription: 'Reduces admission friction by providing prospective students and parents transparent financial planning. Users adjust target courses, scholarship test scores, and preferred installment tranches with instant calculation of monthly commitments.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc7YgN6PR0HNQDlW2vG-CnW-HDRWnMJMsll8hIDykCgfTtMc8disQUwIbCaMdgskW6OqzrlIMyOy-8F-aNziWsL80gUWu9Hu-O_Kq-3vRPdgCdDwRYR4QgG5uQDMEg_2-6-I7j02Db7lkkK_ceKGj_fN04UxWWez-4HKnmQ_UqGUMKTTg8hkKXijy1xlwKjq-KA8nK9TUBlEq_pSWt5iXWLYgUtF7HV0T6-hf2XOd1',
    screenPreviews: [
      {
        id: 'calculator-preview',
        title: 'Interactive Calculation Canvas',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc7YgN6PR0HNQDlW2vG-CnW-HDRWnMJMsll8hIDykCgfTtMc8disQUwIbCaMdgskW6OqzrlIMyOy-8F-aNziWsL80gUWu9Hu-O_Kq-3vRPdgCdDwRYR4QgG5uQDMEg_2-6-I7j02Db7lkkK_ceKGj_fN04UxWWez-4HKnmQ_UqGUMKTTg8hkKXijy1xlwKjq-KA8nK9TUBlEq_pSWt5iXWLYgUtF7HV0T6-hf2XOd1',
        description: 'Interactive sliders, scholarship score tiers, and monthly EMI breakdown table.'
      }
    ],
    features: [
      {
        title: 'Scholarship Score Discount Engine',
        description: 'Formulaic discount adjustments reflecting entrance test percentile tiers.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Installment Tranche Visualizer',
        description: 'Milestone payments split across 2, 3, or 4 tranches with due date projections.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'One-Click WhatsApp Project Estimate Share',
        description: 'Formats calculated estimate into pre-filled WhatsApp inquiry message.',
        status: 'Hook Included'
      }
    ],
    technicalSpecs: {
      devHours: 35,
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Mobile (375px)'],
      deliverables: [
        'Standalone calculation module with configurable rate JSON',
        'PDF export helper utility',
        'Embeddable in modal or inline page layout'
      ]
    },
    commercial: {
      estimatedBaseINR: 25000,
      licenseType: 'Module License',
      warrantyDays: 60
    },
    tags: ['Functional Module', 'Calculator', 'EdTech', 'Financing', 'EMI'],
    featured: false,
    popular: false,
    newAddition: false,
    functionalNotice: 'Visual calculation widget runs entirely client-side. Direct integration with credit/lending NBFC partners or bank gateway loans requires third-party API keys.',
    relatedIds: ['pinnacle-iitjee', 'aura-lms']
  },
  {
    id: 'zenith-landing',
    slug: 'zenith-global-academy-landing',
    title: 'Zenith Global Academy Landing Page',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'page',
    conceptTypeLabel: 'Individual Page',
    shortDescription: 'Full-funnel admissions landing page optimized for paid ad campaigns with sticky lead capture, video reels, and trust anchors.',
    fullDescription: 'Engineered specifically for high-volume paid performance marketing (Google Search & Meta Ads). Features authoritative headline typography, trust markers, parent testimonial carousels, curriculum breakdown tabs, and a sticky lead capture form.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4Q4s2hrd10pTSJIIZTONlkUi8fhSzXLlWTSRw83iSKVDPv6viHH9znfdheUg1gtPFaQKmMo8FortcFRXuZ-1m3TiBhWNlolaXmu2Am9ShBUJgH3sMmEdWhR21Q5eDgAPdFpTmFYSJyM4iedD9lu9RkL7xU7R6DHNiBPb5em2IqJhBSazKmCXR8uyIyzQDd_yYPdlEu3_ZNCksuk9eu54S-SXgpk7jnokeWEZeodW',
    screenPreviews: [
      {
        id: 'zenith-hero-preview',
        title: 'Full Page Admissions Funnel',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4Q4s2hrd10pTSJIIZTONlkUi8fhSzXLlWTSRw83iSKVDPv6viHH9znfdheUg1gtPFaQKmMo8FortcFRXuZ-1m3TiBhWNlolaXmu2Am9ShBUJgH3sMmEdWhR21Q5eDgAPdFpTmFYSJyM4iedD9lu9RkL7xU7R6DHNiBPb5em2IqJhBSazKmCXR8uyIyzQDd_yYPdlEu3_ZNCksuk9eu54S-SXgpk7jnokeWEZeodW',
        description: 'Complete single-page architecture designed for sub-1-second mobile load times.'
      }
    ],
    features: [
      {
        title: 'Sticky Lead Capture Floating Form',
        description: 'High-converting 3-field intake form that persists unobtrusively on scroll.',
        status: 'Included',
        isCore: true
      },
      {
        title: 'Alumni Ranker Hall of Fame',
        description: 'Animated counter cards celebrating previous year percentile qualifiers.',
        status: 'Included',
        isCore: true
      },
      {
        title: 'Curriculum & Study Material Download Drawer',
        description: 'Lead generation gate exchanging PDF syllabus for verified phone number.',
        status: 'Included'
      }
    ],
    technicalSpecs: {
      devHours: 48,
      techStack: ['Next.js 15', 'Tailwind CSS', 'Framer Motion'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Mobile (375px)'],
      deliverables: [
        'Complete landing page route with 100/100 Core Web Vitals targets',
        'Lead capture form with phone validation',
        'Conversion tracking analytics data-layer hooks'
      ]
    },
    commercial: {
      estimatedBaseINR: 35000,
      licenseType: 'Page License',
      warrantyDays: 60
    },
    tags: ['Individual Page', 'Landing Page', 'Lead Generation', 'EdTech'],
    featured: false,
    popular: false,
    newAddition: true,
    functionalNotice: 'Visual landing page is ready for deployment. CRM endpoint webhooks (e.g. LeadSquared, Zoho, HubSpot) require client API credentials.',
    relatedIds: ['pinnacle-iitjee', 'faculty-showcase']
  },
  {
    id: 'mock-test-engine',
    slug: 'mock-test-engine-analytics',
    title: 'Mock Test Engine & Result Analytics',
    categoryId: 'education',
    categoryName: 'Education & EdTech Portals',
    conceptType: 'section',
    conceptTypeLabel: 'UI Screen',
    shortDescription: 'Timed online exam interface paired with multi-axis radar chart diagnostics, question palette, and percentile projection models.',
    fullDescription: 'A precision simulation of competitive exam environments (NTA CBT pattern). Features a multi-axis performance radar chart, topic-wise accuracy breakdown, time-spent telemetry per question, and national peer percentile comparison.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSfRtr-pvAgpPr-_EFUlLYPwWZ5eWMTxkbRP8gIXAVb7E-qzcmIs9jeufQNU0PNflm_DZN6TINDtrhOFbDaNFzmaIDasP8_hXOJn4dM82HnYVS7CLjbH-6ZnyDspmrXBK8CThDBxgSldCGFH7McVb2PMmN5Lp2wjng3CogjU_pbxGRmCgYSDsBlhQZV6iJ7km4V14oCt5aHEHrZFaTJLtPOJWShau5U8ps4gUSn2Cz',
    screenPreviews: [
      {
        id: 'mock-test-analytics',
        title: 'Multi-Axis Radar Performance Screen',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT4BmfTTnEt-moJzQ4uq-QUFA-tadOZekqrWBX9AvVDcZDVJ5E58TzD3xU761OVmyyRFjRPm5ri9K8rMEpj_f_3DZ0imdv5DrpgllCUtanZoni34aU2Kn9uMmhv04B7TXhprM-0rV8scpFZlfPjwWPt4yKtULH44peEYOvQJhDrefbVMdSieefYH8xcsmavnDOFVTMOzUzd3ZrBQdjwi9nXskcJWGG6TLB1USwFAyF',
        description: 'Interactive radar charts displaying student subject competencies.'
      }
    ],
    features: [
      {
        title: 'NTA Exam Pattern Question Palette',
        description: 'Standard color-coded status palette (Answered, Marked for Review, Unvisited).',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Multi-Axis Radar Performance Diagnostics',
        description: 'Interactive radar chart benchmarking student score against 99th percentile cutoff.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Anti-Cheat Tab Switching Telemetry State',
        description: 'UI alert indicators triggered if browser tab loses focus during exam.',
        status: 'Included'
      }
    ],
    technicalSpecs: {
      devHours: 80,
      techStack: ['React 19', 'Tailwind CSS', 'SVG Radar Engine'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Tablet (1024px)'],
      deliverables: [
        'Interactive test evaluation screen',
        'Custom SVG radar chart without bloated third-party dependencies',
        'Result breakdown card kit'
      ]
    },
    commercial: {
      estimatedBaseINR: 55000,
      licenseType: 'UI Screen License',
      warrantyDays: 90
    },
    tags: ['UI Screen', 'Mock Test', 'Exam Engine', 'Analytics', 'Radar Chart'],
    featured: false,
    popular: true,
    newAddition: false,
    functionalNotice: 'Visual preview includes question navigation and result radar charts. Scaled exam proctoring backend, encrypted question vault, and auto-grading web workers require custom server architecture.',
    relatedIds: ['pinnacle-iitjee', 'aura-lms']
  },
  {
    id: 'titan-industrial',
    slug: 'titan-industrial-corporate-hub',
    title: 'Titan Industrial Machinery & B2B Hub',
    categoryId: 'corporate',
    categoryName: 'Business & Corporate',
    conceptType: 'concept',
    conceptTypeLabel: 'Complete Concept',
    shortDescription: 'Industrial manufacturing export hub featuring interactive 3D machinery specifications, CAD downloads, and global distributor portal.',
    fullDescription: 'Tailored for engineering manufacturers, heavy machinery builders, and international export firms. Highlights technical equipment specifications, compliance certifications, multi-facility capabilities, and global inquiry dispatch.',
    visualPreviewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyIS4-VIXy_PJ2L0PdgqXjqbfpcPPXbLqsRzvPV92USeHEXYgdylobQhfyhs6_11LWGHTiNbdqwW6DdyLsZ7-zgb2_pUWUbSsyDosq7BjidCt2D-IIljOB-zGj5TuRBUbqwWJBQubi-djJl8x9h0dWjqtBVQPcDXEyJwzqQBBSRZYRkSbeFqu9MaCVxEy4AsVkBEybwxKCedYav5thQjhG5SbOFzG4vV5XFqcV1wTc',
    screenPreviews: [
      {
        id: 'titan-desktop',
        title: 'Industrial Machinery Spec Matrix',
        viewport: 'desktop',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyIS4-VIXy_PJ2L0PdgqXjqbfpcPPXbLqsRzvPV92USeHEXYgdylobQhfyhs6_11LWGHTiNbdqwW6DdyLsZ7-zgb2_pUWUbSsyDosq7BjidCt2D-IIljOB-zGj5TuRBUbqwWJBQubi-djJl8x9h0dWjqtBVQPcDXEyJwzqQBBSRZYRkSbeFqu9MaCVxEy4AsVkBEybwxKCedYav5thQjhG5SbOFzG4vV5XFqcV1wTc',
        description: 'Technical equipment specification tables with PDF schematic download gates.'
      }
    ],
    features: [
      {
        title: 'Interactive Equipment Spec Comparison Matrix',
        description: 'Multi-machine side-by-side technical comparison with tolerance metrics.',
        status: 'Component Included',
        isCore: true
      },
      {
        title: 'Global Distributor & Agency Locator',
        description: 'Regional representative directory with direct email/phone routing.',
        status: 'Included'
      }
    ],
    technicalSpecs: {
      devHours: 75,
      techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
      responsiveBreakpoints: ['Desktop (1440px)', 'Mobile (375px)'],
      deliverables: [
        'Full industrial B2B website layout',
        'Technical specification table components',
        'Multi-lingual ready copy architecture'
      ]
    },
    commercial: {
      estimatedBaseINR: 65000,
      licenseType: 'Commercial License',
      warrantyDays: 90
    },
    tags: ['Complete Concept', 'Corporate', 'B2B', 'Manufacturing', 'Industrial'],
    featured: false,
    popular: false,
    newAddition: false,
    functionalNotice: 'Visual preview illustrates the corporate architecture. Integration with enterprise ERPs (SAP/Oracle) or CAD file asset servers is scoped separately.',
    relatedIds: ['vertex-saas', 'kinetix-luxury']
  }
];
