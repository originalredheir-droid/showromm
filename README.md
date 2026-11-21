# REDHEIR SHOWROOM

An internal digital showroom built with Next.js 15, TypeScript, and Tailwind CSS. Used by REDHEIR during executive client meetings to present website design concepts, browse pre-architected industry engines, explore responsive screen mockups, and assemble curated project scopes in real-time.

**Core Concept: Explore → Select → Review.**

---

## 🌟 Key Features

- **Home / Showroom:** Executive overview, specialized industry domains bento grid, and featured website concepts.
- **Industry Categories:** Database-managed industry verticals with deep-linking to filtered views.
- **Website Catalogue:** Primary browsing module with keyword search, category filters, concept type tabs (Complete Concepts, Functional Modules, Individual Pages, UI Sections), and sorting. Catalogs link to their individual image offers; the catalog itself is not a cart item.
- **Design Details / Image Offers:** Each catalog presents its images as independent, vertically ordered cards with optional titles and descriptions, individual prices, development-time estimates, and add/remove actions.
- **Selection Cart & Proposal:** Review selected image offers and their estimates, see aggregate price and development-time totals, copy a project brief, or use browser Print / Save as PDF. Cart state persists in browser `localStorage`.
- **Client Proposals:** Anyone can enter client/project details and generate a branded, image-led PDF without signing in. Client details stay in the browser unless an admin explicitly saves a copy; saved records remain admin-only.
- **Meeting Presenter Controls:** Client-facing in-room switches to toggle commercial pricing and internal technical dev hours on the fly.
- **Fully Responsive:** Optimized for mobile phones, tablets, and desktop workstations during in-person and screen-shared meetings.
- **Admin Console:** Email/password protected category and design management, drafts and publishing, catalog-image uploads, business profile settings, saved proposal records, simple proposal-based invoices and payment receipts, and Supabase Storage usage/capacity estimates. Each image offer has editable display order, optional title/description, price, and development time.
- **Invoices & receipts:** Start a draft from an unchanged saved proposal, edit the agreed scope and prices, issue a numbered commercial invoice, record partial or final payments, and print a numbered receipt for each payment. Issued invoices and payment history are immutable; the first version does not calculate taxes and is not a GST invoice system.
- **Error reporting:** Browser and server errors are logged with route templates and optional digests only; proposal details, request data, and error messages are not transmitted. Review these events in the hosting platform logs.

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
│   ├── design/[id]/        # Ordered independent image offers
│   ├── selection/          # Image-offer cart and print-ready proposal
│   ├── api/proposals/      # Admin-checked proposal creation endpoint
│   ├── api/invoices/       # Draft, issue, and payment endpoints for admins
│   └── showroom/           # Route alias to /catalogue
├── components/
│   ├── layout/             # Sidebar, Header, MobileNav
│   ├── catalogue/          # CatalogueCard, FilterBar, EmptyState
│   ├── admin/              # Admin sign-in, catalog forms, invoices, and receipts
│   ├── categories/         # CategoryCard
│   ├── design/             # DesignShowcase image-offer cards
│   ├── proposals/          # Saved branded proposal and print view
│   └── cart/               # CartItemRow, CartSummary
├── context/
│   ├── CartContext.tsx     # LocalStorage-backed cart state
│   └── PresenterContext.tsx# Meeting mode & presenter toggles
├── data/
│   ├── categories.ts       # Legacy sample data (not loaded by the app)
│   └── designs.ts          # Legacy sample data (not loaded by the app)
├── lib/
│   ├── storage.ts          # Safe SSR LocalStorage helper
│   ├── invoices.ts         # Admin invoice and payment queries
│   ├── supabase/           # Browser and server Supabase clients
│   └── utils.ts            # Formatting & class merging
├── supabase/
│   └── migrations/         # Database schema, RLS, and Storage policies
└── types/
    ├── database.ts         # Supabase table and RPC types
    └── index.ts            # Shared application interfaces
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
2. Link this repository to the intended project. Review the remote migration state before applying migrations; this includes the admin-only proposal, invoice, and receipt schema:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase migration list --remote
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

Saved proposals contain client contact and project information. Access is restricted to authorized admins. Business identity fields can be configured at `/admin/settings`; those fields are included in PDFs and are publicly readable. Proposal numbering is allocated server-side only for saved admin records.

Invoices and receipts are admin-only. Invoice numbering and receipt numbering are allocated server-side; invoice totals, final scope, and business identity are snapshotted when issued. Payment recording is transactional and prevents overpayment. The simple commercial invoice does not calculate tax and should not be treated as a GST/tax invoice. Review production migrations and verify the linked Supabase project before applying them.

The admin Storage page reports object bytes and image usage from Supabase Storage. Enter the storage quota shown for your Supabase plan to calculate an approximate number of additional catalogs. Actual capacity varies with future image sizes and files not referenced by published catalogs.

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

Future milestones may introduce:
- Internal pricing intelligence and catalog analytics
- Invoice milestone billing and other accounting integrations, if needed
