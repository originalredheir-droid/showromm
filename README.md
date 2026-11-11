# REDHEIR SHOWROOM

An internal digital showroom built with Next.js 15, TypeScript, and Tailwind CSS. Used by REDHEIR during executive client meetings to present website design concepts, browse pre-architected industry engines, explore responsive screen mockups, and assemble curated project scopes in real-time.

**Core Concept: Explore → Select → Review.**

---

## 🌟 Key Features

- **Home / Showroom:** Executive overview, specialized industry domains bento grid, and featured website concepts.
- **Industry Categories:** 10 pre-architected industry verticals (Education & EdTech, Healthcare & Telemed, SaaS & Software, Ecommerce & Retail, Corporate, Legal, Hospitality, Agencies, NGOs, Custom Applications) with deep-linking to filtered views.
- **Website Catalogue:** Primary browsing module with keyword search, category filters, concept type tabs (Complete Concepts, Functional Modules, Individual Pages, UI Sections), sorting, and instant cart selection.
- **Design Details / Showcase:** Interactive multi-viewport previewer (Desktop 1440px, Tablet 768px, Mobile 375px), dual-tabbed visual vs. functional capability breakdown, core architectural features checklist, and related modules.
- **Selection Cart & Scope Estimator:** Add/remove items, adjust quantities, review scope descriptions, view basic summary metrics (deliverable counts, estimated engineering hours, and base commercial license values), copy project briefs to clipboard, with full browser `localStorage` persistence.
- **Meeting Presenter Controls:** Client-facing in-room switches to toggle commercial pricing and internal technical dev hours on the fly.
- **Fully Responsive:** Optimized for mobile phones, tablets, and desktop workstations during in-person and screen-shared meetings.

---

## 🏗 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5.9
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Storage:** React Context + browser `localStorage` for offline persistence
- **Fonts:** Plus Jakarta Sans (Headings) & Inter (UI/Body)

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css         # Global Tailwind & design tokens
│   ├── layout.tsx          # Root layout with fonts, providers & sidebar
│   ├── page.tsx            # Home / Showroom Stage
│   ├── catalogue/          # Website catalogue with search & filters
│   ├── categories/         # 10 Industry domain bento overview
│   ├── design/[id]/        # Design Details & Viewport Showcase
│   ├── selection/          # Selection Cart & Scope Estimator
│   └── showroom/           # Route alias to /catalogue
├── components/
│   ├── layout/             # Sidebar, Header, MobileNav
│   ├── catalogue/          # CatalogueCard, FilterBar, EmptyState
│   ├── categories/         # CategoryCard
│   ├── design/             # ViewportPreview, CapabilityNotice, DesignShowcase
│   └── cart/               # CartItemRow, CartSummary
├── context/
│   ├── CartContext.tsx     # LocalStorage-backed cart state
│   └── PresenterContext.tsx# Meeting mode & presenter toggles
├── data/
│   ├── categories.ts       # Structured seed data for 10 industries
│   └── designs.ts          # Structured seed data for website concepts
├── lib/
│   ├── storage.ts          # Safe SSR LocalStorage helper
│   └── utils.ts            # Formatting & class merging
└── types/
    └── index.ts            # TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or newer
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/redheir-showroom.git
cd redheir-showroom

# Install dependencies
npm install
```

This repository is configured as the `redheir-showroom` frontend MVP and is intended to run independently with the standard Next.js scripts listed above.

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🔒 Future Roadmap (Beyond MVP)

This MVP focuses strictly on the frontend exploration, selection, and review workflow without requiring a backend. Future milestones will introduce:
- PostgreSQL / Cloud SQL persistence for multi-device sync
- Cloud Storage bucket integration for dynamic client asset uploads
- Administrative catalogue management console
- Automated quotation PDF generation and invoice milestone billing
- Internal pricing intelligence engine
