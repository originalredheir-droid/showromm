# REDHEIR SHOWROOM

An internal digital showroom built with Next.js 15, TypeScript, and Tailwind CSS. Used by REDHEIR during executive client meetings to present website design concepts, browse pre-architected industry engines, explore responsive screen mockups, and assemble curated project scopes in real-time.

**Core Concept: Explore → Select → Review.**

---

## 🌟 Key Features

- **Home / Showroom:** Executive overview, specialized industry domains bento grid, and featured website concepts.
- **Industry Categories:** Database-managed industry verticals with deep-linking to filtered views.
- **Website Catalogue:** Primary browsing module with keyword search, category filters, concept type tabs (Complete Concepts, Functional Modules, Individual Pages, UI Sections), sorting, and instant cart selection.
- **Design Details / Showcase:** Interactive multi-viewport previewer (Desktop 1440px, Tablet 768px, Mobile 375px), dual-tabbed visual vs. functional capability breakdown, core architectural features checklist, and related modules.
- **Selection Cart & Scope Estimator:** Add/remove items, adjust quantities, review scope descriptions, view basic summary metrics (deliverable counts, estimated engineering hours, and base commercial license values), copy project briefs to clipboard, with full browser `localStorage` persistence.
- **Meeting Presenter Controls:** Client-facing in-room switches to toggle commercial pricing and internal technical dev hours on the fly.
- **Fully Responsive:** Optimized for mobile phones, tablets, and desktop workstations during in-person and screen-shared meetings.
- **Admin Console:** Email/password protected category and design management, drafts and publishing, plus public catalog-image uploads to Supabase Storage.

---

## 🏗 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5.9
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Storage:** Supabase Postgres and Storage for catalog content and images; React Context + browser `localStorage` for the selection cart
- **Fonts:** Plus Jakarta Sans (Headings) & Inter (UI/Body)

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css         # Global Tailwind & design tokens
│   ├── layout.tsx          # Root layout with fonts, providers & sidebar
│   ├── page.tsx            # Home / Showroom Stage
│   ├── catalogue/          # Website catalogue with search & filters
│   ├── categories/         # Industry domain overview
│   ├── admin/              # Protected content management
│   ├── design/[id]/        # Design Details & Viewport Showcase
│   ├── selection/          # Selection Cart & Scope Estimator
│   └── showroom/           # Route alias to /catalogue
├── components/
│   ├── layout/             # Sidebar, Header, MobileNav
│   ├── catalogue/          # CatalogueCard, FilterBar, EmptyState
│   ├── admin/              # Admin sign-in, forms, and image uploads
│   ├── categories/         # CategoryCard
│   ├── design/             # ViewportPreview, CapabilityNotice, DesignShowcase
│   └── cart/               # CartItemRow, CartSummary
├── context/
│   ├── CartContext.tsx     # LocalStorage-backed cart state
│   └── PresenterContext.tsx# Meeting mode & presenter toggles
├── data/
│   ├── categories.ts       # Legacy sample data (not loaded by the app)
│   └── designs.ts          # Legacy sample data (not loaded by the app)
├── lib/
│   ├── storage.ts          # Safe SSR LocalStorage helper
│   ├── supabase/           # Browser and server Supabase clients
│   └── utils.ts            # Formatting & class merging
├── supabase/
│   └── migrations/         # Database schema, RLS, and Storage policies
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

### Supabase setup

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from Supabase project settings. Never put a service-role key in browser environment variables.
2. Link this repository to the project and apply the migration:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push --remote
   ```

3. In Supabase Authentication, create the initial email/password user. In the SQL Editor, authorize that exact user as an admin:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users
   where lower(email) = lower('admin@example.com')
   on conflict (user_id) do nothing;
   ```

   Replace the example email with the user you created. Do not enable public signup for this internal admin console.
4. Open `/admin` to create categories and designs. Lists include confirmed deletion actions that also remove uploaded images. A category cannot be deleted while designs reference it; hide it instead or remove its designs first. Published catalog images are publicly viewable; uploads and content edits require an authorized admin.

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

## 🔒 Future Roadmap

The initial Supabase-backed admin and public catalogue are in place. Future milestones may introduce:
- Automated quotation PDF generation and invoice milestone billing
- Internal pricing intelligence engine
