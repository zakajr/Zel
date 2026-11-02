# NeoRide by Zelloufi — Unobstructed 100svh Hero, CRO & SEO/GEO Mastery Plan

This revised plan ensures the **entire Hero road & motorcycle animation fits within the first viewport (`100svh - 68px`) with zero scrolling required and zero UI elements overlapping the motorcycle**, while embedding high-converting **CRO (Conversion Rate Optimization)** mechanics and **SEO + GEO (Generative Engine Optimization)** structured data for Berkane and the Oriental region.

## User Review & Critical Decisions

> [!IMPORTANT]
> Every requirement from your latest feedback is built into this plan:

- **Confirmed Decision 1 — 100% Visible First-Screen Animation & Smart Non-Overlapping Layout**:
  - **No Scroll Needed**: Lock `.hero` strictly to `height: calc(100svh - 68px)` on both desktop and mobile so the entire animation, headline, and accelerate controls are 100% visible on the first screen without scrolling.
  - **Zero Overlays on the Motorcycle**:
    - On **Desktop**: Shift the canvas road vanishing point and motorcycle silhouette into the open right-hand theater lane (`cx = W * 0.68` in LTR, `W * 0.32` in RTL) while keeping `.hero-copy` on the left (`max-width: 470px`), the speedometer in the top corner, and the interaction dock at the bottom corner—so no text or box ever touches the motorcycle.
    - On **Mobile**: Use a 3-zone vertical viewport split (Top compact headline/CTA → **Middle open canvas window where the motorcycle rides at `by = H * 0.62` with zero overlapping text** → Bottom compact accelerate dock + trust bar), fitting 100% inside `calc(100svh - 68px)`.
    - **Full Fade on Hold (`.hero.run`)**: Holding `#thr` fades `.hero-copy`, `.trust`, and `.hero-interaction` to near-transparent (`opacity: 0.08`) while smoothly centering the road perspective for pure full-screen motion.
- **Confirmed Decision 2 — Compact Header WhatsApp Logo & Clean v11 Cards + Quick-View Modal**:
  - Keep the compact `48×42px` green WhatsApp logo button in the header (zero mobile horizontal scroll) and keep the catalog cards clean like `NeoRide-conversion-mockup-11.html` with a **"Vue rapide / Fiche"** trigger opening the full Quick-View modal.
- **Confirmed Decision 3 — Conversion Rate Optimization (CRO) & SEO / GEO Architecture**:
  - **CRO**: Above-the-fold price & savings anchors (`0 DH d'essence · Dès 5 200 DH`), monthly payment equivalents (`~DH/mois`), vocal WhatsApp micro-copy, and context-aware pre-filled WhatsApp funnels across every section.
  - **SEO + GEO**: Full Moroccan Oriental geo-meta tags (`MA-02`, Berkane `34.92, -2.32`, `fr_MA`/`ar_MA`) + a unified Schema.org `@graph` (`MotorcycleDealer`, `ItemList` of `Product`s with `MAD` `Offer`s and technical specs, and `FAQPage`) engineered for both Google Local Pack and AI Answer Engines (ChatGPT, Perplexity, Gemini).

---

## 1. Overview & Core Concept

- **What It Does**: Combines an immediately visible, non-overlapping 60fps electric road simulation on the first screen with a high-conversion bilingual (FR/AR) product showroom, interactive Quick-View & comparison tools, a fuel-to-electric payback calculator, and deep local SEO/GEO structured data for Berkane and l'Oriental.
- **Target Audience / Persona**: Commuters, students, and delivery professionals (*Livreurs*) in Berkane, Oujda, Nador, Saïdia, and Ahfir searching on Google or AI engines for electric motorcycles, scooters, and spare parts.
- **Key Value**: Instant visual impact on screen load (zero scrolling to see the bike, zero overlapping clutter) paired with frictionless WhatsApp lead conversion.

---

## 2. User Experience, Smart Non-Overlapping Layout & CRO

### Smart Non-Overlapping Hero Geometry (`100svh - 68px`)
```
DESKTOP VIEWPORT (100svh - 68px, Zero Scroll, Zero Overlap)
┌───────────────────────────────────────────────────────────────────────────┐
│ [NeoRide by ZELLOUFI]     Catalogue · Pièces · Électrique    [عربية] [WA] │ 68px
├───────────────────────────────────────────────────────────────────────────┤
│ NEORIDE · BERKANE                                                 0       │
│ Motos & scooters                  ╱│╲                            km/h     │
│ électriques à                    ╱ │ ╲                                    │
│ Berkane & l'Oriental.           ╱  │  ╲   <-- Open Right Theater Lane     │
│                                ╱  🏍️  ╲      (cx = 68% W, Unobstructed!) │
│ [Découvrir le catalogue ↗]    ╱    │    ╲                                 │
│  Réserver un essai →         ╱     │     ╲   [⚡ Maintenir] [🔊 Son]      │
├───────────────────────────────────────────────────────────────────────────┤
│ • Modèles dès 5 200 DH  • Pièces en stock  • SAV local Berkane & Oriental │
└───────────────────────────────────────────────────────────────────────────┘

MOBILE VIEWPORT (100svh - 68px, Zero Scroll, 3-Zone Non-Overlapping Split)
┌─────────────────────────────────────────┐
│ [NeoRide]                  [عربية] [WA] │ 68px Header
├─────────────────────────────────────────┤
│ NEORIDE · BERKANE                0 km/h │ Zone 1: Compact Copy & CTA
│ Motos & scooters électriques            │
│ à Berkane et dans l'Oriental.           │
│ [Découvrir le catalogue ↗] [Essai →]    │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│                   ╱│╲                   │ Zone 2: Dedicated Open Canvas
│                  ╱ │ ╲                  │ Window (by = 62% H) — ZERO
│                 ╱ 🏍️ ╲                 │ text or buttons over the bike!
│                ╱   │   ╲                │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│ [⚡ Maintenir pour accélérer] [🔊 Son]  │ Zone 3: Bottom Dock & Trust
│ • Dès 5 200 DH • SAV Berkane & Oriental │ (Fits 100% on Screen 1)
└─────────────────────────────────────────┘
```

### Conversion Rate Optimization (CRO) System
1. **Above-the-Fold Value & Risk Reversal**: Clear price anchor (`Modèles dès 5 200 DH`), zero-fuel hook (`~1,5 DH / 100 km`), and local Berkane showroom + after-sales warranty trust markers visible immediately on screen 1.
2. **Pre-Qualified WhatsApp Micro-Funnels**:
   - **Catalog & Quick-View**: Pre-fills model name, price in DH, and stock/test-ride request.
   - **Comparison Winner**: Pre-fills both compared models and asks for personalized advice.
   - **3-Step Advisor Quiz & Payback Calculator**: Pre-fills the user's daily km, calculated annual DH savings, payback months, and recommended vehicle.
   - **Voice-Note Friendly Copy**: Highlights *"Vous pouvez écrire ou envoyer un message vocal (audio) sur WhatsApp"* to maximize mobile conversion in Morocco.

---

## 3. SEO & GEO (Generative Engine Optimization) Strategy

- **HTML Head & Geo-Targeting (`index.html` & Dynamic Sync)**:
  - Branded, keyword-rich `<title>` and `<meta name="description">` tailored for *"Motos électriques, scooters et pièces à Berkane, Oujda, Nador et dans l'Oriental"*.
  - Geographic meta tags (`geo.region="MA-02"`, `geo.placename="Berkane, Maroc"`, `geo.position="34.92;-2.32"`, `ICBM="34.92, -2.32"`) and bilingual OpenGraph/Twitter cards.
- **Unified Schema.org `@graph` JSON-LD for Search & AI Citation (GEO)**:
  - **`MotorcycleDealer` & `AutoPartsStore`**: Full NAP (Name, Address in Berkane, Phone/WhatsApp), geo-coordinates, opening hours (`Mo-Sa 09:00-19:30`), `areaServed` (`Berkane`, `Oujda`, `Nador`, `Saïdia`, `Ahfir`, `Taourirt`, `Oriental`), and `priceRange` (`5 200 DH - 14 900 DH`).
  - **`ItemList` of `Product` + `Offer` Entities**: Structured data for every NeoRide model (`NR-1 Sport` at `14 900 MAD`, `Urban 3000` at `11 500 MAD`, `Eco City` at `7 800 MAD`, `Trottinette Pro-X` at `5 200 MAD`, plus helmet and battery) including `PropertyValue` specs (`Autonomie`, `Vitesse max`, `Batterie`) so AI engines extract exact specs and prices.
  - **`FAQPage`**: Structured Q&A covering 220V home charging, cost per 100 km (`1,5 DH`), warranty/spare parts in Berkane, and Oriental regional delivery.
- **Semantic GEO Fact Summary**: Clean semantic `<dl>` / `<article>` data structures and regional city links (`#localisation`) that allow LLM crawlers and search bots to index verifiable facts without visual clutter.

---

## 4. Technical Architecture & Component Mapping

- **Header (`App.tsx`)**: Sticky `68px` bar with `NeoRide by ZELLOUFI`, desktop nav links, `عربية / Français` toggle, and compact `48×42px` `.header-wa` green WhatsApp icon button.
- **Hero (`ElectricRoadHero.tsx`)**:
  - Locked to `height: calc(100svh - 68px)` across all viewports.
  - Responsive canvas coordinates (`cx` offset to `0.68 * W` on desktop LTR / `0.32 * W` on desktop RTL so the bike rides in the open right/left lane; centered at `by = 0.62 * H` in the open middle window on mobile) + smooth interpolation toward `0.5 * W` when `.hero.run` is active and overlays fade to `opacity: 0.08`.
  - Simple v11 controls: `#thr` (`Maintenir pour accélérer`) + `#snd` (`Son activé / Son coupé`) + giant unboxed `.spd` (`0 km/h`).
- **Catalog (`CatalogSection.tsx`) & Modals (`CompareAndQuickViewModals.tsx`)**:
  - Clean `v11` cards in Carousel/Grid modes with **"Vue rapide / Fiche"** opening the Quick-View modal and **"Comparer"** feeding the `.ctray` comparison bar.
