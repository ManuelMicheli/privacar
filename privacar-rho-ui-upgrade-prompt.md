# Claude Code Prompt — Privacar Rho: Upgrade UI/UX Desktop a Livello Awwwards

Il sito base è già funzionante (Next.js 15, Tailwind, Supabase, Framer Motion). Questo prompt serve a trasformarlo in un'esperienza premium desktop degna di un sito Awwwards. Lavora SOLO sulla versione desktop (breakpoint lg: e superiori). Non toccare il layout mobile per ora.

Stack già installato: Next.js 15 App Router, TypeScript, Tailwind CSS 4, Framer Motion, Supabase. Font: Sora (heading) + Libre Franklin (body).

---

## 0. NUOVA PALETTE COLORI

Prima di tutto, aggiorna TUTTA la palette. La nuova identità visiva usa **bianco + verde smeraldo** come colori principali e **blu** per dettagli e accenti secondari.

### Definizione colori

```
/* === PRIMARI (Verde Smeraldo) === */
--primary:          #065F46    /* Verde smeraldo — header, footer, titoli, CTA, prezzi */
--primary-light:    #047857    /* Hover states bottoni primari */
--primary-dark:     #064E3B    /* Footer background, press states */
--primary-50:       #ECFDF5    /* Background sezioni alternate, badge sfondo */
--primary-100:      #D1FAE5    /* Hover leggero, card selezionate */
--primary-200:      #A7F3D0    /* Ring focus, bordi attivi */

/* === ACCENTO (Blu — usare con parsimonia per dettagli) === */
--accent:           #1E40AF    /* Link secondari, badge info, icone dettaglio */
--accent-light:     #2563EB    /* Hover link secondari */
--accent-50:        #EFF6FF    /* Background badge info */

/* === Neutri (grigi con sfumatura verde per coerenza) === */
--background:       #FFFFFF
--background-alt:   #F8FAF9    /* Sezioni alternate — bianco con appena una sfumatura verde */
--surface:          #FFFFFF    /* Card */
--border:           #E5E7EB
--border-light:     #F3F4F6
--text-primary:     #0F1A14    /* Quasi nero con sfumatura verde */
--text-secondary:   #4B5B52    /* Grigio-verde per testo secondario */
--text-muted:       #8A9A90    /* Grigio-verde chiaro per caption, placeholder */

/* === Status === */
--status-available: #065F46
--status-reserved:  #D97706    /* Ambra */
--status-sold:      #6B7280    /* Grigio */

/* === WhatsApp (NON è il verde primary, è un verde diverso) === */
--whatsapp:         #25D366

/* === Errori (resta rosso, solo per form validation e azioni distruttive) === */
--error:            #DC2626
```

### Badge Alimentazione
```
Benzina:    bg-red-50 text-red-700 border-red-200
Diesel:     bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]     /* Blu accento */
GPL:        bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]     /* Verde primary */
Metano:     bg-teal-50 text-teal-700 border-teal-200
Ibrida:     bg-emerald-50 text-emerald-700 border-emerald-200
Elettrica:  bg-violet-50 text-violet-700 border-violet-200
```

### Tailwind Config

Aggiorna `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#065F46',
        light: '#047857',
        dark: '#064E3B',
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
      },
      accent: {
        DEFAULT: '#1E40AF',
        light: '#2563EB',
        50: '#EFF6FF',
      },
    },
  },
},
```

### Mappatura sostituzioni globale

Cerca e sostituisci in TUTTI i file:

| Vecchio | Nuovo | Contesto |
|---------|-------|----------|
| `#1B3A5C` | `#065F46` | Primary (header, footer, titoli, CTA) |
| `#2A5A8C` | `#047857` | Primary hover/light |
| `#0D1B2A` | `#064E3B` | Footer, varianti scure |
| `#E63946` | `#065F46` | CTA, prezzi, accenti principali |
| `#FF6B6B` | `#047857` | CTA hover |
| `#D32F3F` | `#047857` | CTA pressed |
| `#F8F9FA` | `#F8FAF9` | Background alternato |
| `#1A1A2E` | `#0F1A14` | Testo primario |
| `#6B7280` (in contesto testo) | `#4B5B52` | Testo secondario |
| `#9CA3AF` (in contesto testo) | `#8A9A90` | Testo muted |

**Eccezioni — NON sostituire:**
- Badge "Venduta" → `#6B7280` resta grigio
- Badge "Riservata" → `#D97706` resta ambra
- WhatsApp button → `#25D366` resta il suo verde
- Errori/validazione form → `#DC2626` resta rosso
- Badge alimentazione diversi da diesel/gpl → restano come sono

### Note contrasto WCAG
- `#065F46` su bianco = 7.56:1 (passa AAA ✓)
- `#047857` su bianco = 5.92:1 (passa AA ✓)
- `#0F1A14` su bianco = 17.4:1 (passa AAA ✓)

---

## 1. SMOOTH SCROLL GLOBALE

Aggiungi Lenis per smooth scroll premium:

```bash
npm install lenis
```

Crea `src/components/SmoothScroll.tsx` (client component):
- Inizializza Lenis con `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `smoothWheel: true`
- Integra con Framer Motion tramite `useScroll` sync
- Wrappa il children nel layout root
- Aggiungi `html { scroll-behavior: auto !important; }` per evitare conflitti

---

## 2. NAVBAR — Premium Sticky con Glassmorphism

Rifai completamente la Navbar desktop:

**Stato iniziale (top of page):**
- Background completamente trasparente
- Logo bianco (se hero è scura) o in verde `#065F46`
- Nav links in bianco/scuro a seconda della pagina
- Padding generoso: `py-6 px-12`
- Nessun bordo, nessuna ombra

**Stato scrolled (dopo 80px di scroll):**
- Transizione smooth (0.4s ease) a:
  - Background: `rgba(255, 255, 255, 0.85)` con `backdrop-blur-xl` (20px)
  - Bordo bottom: `1px solid rgba(6, 95, 70, 0.08)` (verdino appena percettibile)
  - Padding ridotto: `py-3 px-12`
  - Shadow sottile: `shadow-[0_1px_20px_rgba(0,0,0,0.04)]`
  - Logo in verde `#065F46`
  - Nav links diventano scuri `#0F1A14`

**Nav links:**
- Font: `font-heading font-medium text-[15px] tracking-[-0.01em]`
- Hover: NO semplice color change. Usa un underline animato custom:
  - Pseudo-element `::after` che scala da `scaleX(0)` a `scaleX(1)` con `transform-origin: left`
  - Colore underline: `#065F46`, height `2px`, offset `4px` sotto il testo
  - Transition: `0.3s cubic-bezier(0.65, 0, 0.35, 1)`
- Link attivo: underline sempre visibile + font-weight 600 + `text-[#065F46]`

**CTA "Cerca Auto" button:**
- Background: `#065F46`, border-radius `10px`, padding `10px 24px`
- Hover: scala a `scale(1.03)`, background `#047857`, shadow `0 4px 15px rgba(6, 95, 70, 0.25)`
- Transition con spring physics (Framer Motion `whileHover`)
- Effetto "magnetic button" leggero: il bottone si muove leggermente verso il cursore on mouse move (±3px max)

---

## 3. HERO SECTION — Cinematic Entrance

Rifai la hero per desktop come un momento cinematografico:

**Layout:**
- Full viewport height `min-h-screen` con contenuto centrato verticalmente
- Background: gradient overlay scuro `bg-gradient-to-b from-[#064E3B]/90 via-[#065F46]/70 to-[#065F46]/90` sopra l'immagine hero
- L'immagine hero usa `next/image` con `fill`, `object-cover`, `priority`

**Animazione d'ingresso (staggered reveal):**
Tutto appare con una sequenza orchestrata al primo caricamento:

1. **0ms** — Background image fade in (opacity 0→1, duration 1.2s)
2. **200ms** — Subtitle "PRIVACAR RHO" slide up + fade (y: 30→0, opacity 0→1, duration 0.7s, ease: `[0.25, 0.4, 0.25, 1]`)
3. **400ms** — Headline principale clip-reveal dall'alto: usa `overflow: hidden` su un wrapper e il testo scorre da `y: 100%` a `y: 0` (duration 0.8s, ease: `[0.76, 0, 0.24, 1]`). Riga per riga se il titolo è su 2 righe, con 150ms di delay tra le righe
4. **700ms** — Paragrafo sottotitolo fade in + slide up (y: 20→0, duration 0.6s)
5. **900ms** — Search bar scale up + fade (scale: 0.95→1, opacity 0→1, duration 0.5s)
6. **1100ms** — Freccia scroll indicator appare in basso (fade + bounce leggero infinito)

**Subtitle "PRIVACAR RHO":**
- `font-body font-semibold text-[13px] tracking-[4px] uppercase text-[#A7F3D0]` (verde chiaro su sfondo scuro)
- Lettera-spacing ampio, effetto premium

**Headline:**
- `font-heading font-bold text-[56px] leading-[1.05] text-white tracking-[-0.02em]`
- Max width `max-w-[700px]`

**Search bar:**
- Sfondo bianco, `rounded-2xl`, padding `8px`, shadow `0 20px 60px rgba(0,0,0,0.25)`
- Campi interni: bordi invisibili, separati da divider verticali `1px solid #E5E7EB`
- Ogni campo ha label piccola sopra (`text-[11px] font-semibold uppercase tracking-wider text-[#8A9A90]`) e valore sotto
- Bottone "Cerca": `bg-[#065F46] hover:bg-[#047857]`, `rounded-xl`, padding `14px 32px`, `font-heading font-bold text-white`
- Hover search bar: leggerissimo lift `translateY(-2px)` con shadow più pronunciato

**Scroll indicator in basso:**
- Icona chevron-down o mouse-outline in bianco/50% opacity
- Animazione bounce infinita: `y: [0, 8, 0]` con duration 2s, ease `easeInOut`, repeat `Infinity`
- On click: smooth scroll alla prossima sezione

---

## 4. SEZIONI HOMEPAGE — Scroll Reveal Orchestrato

Ogni sezione della homepage deve avere un'entrata reveal on scroll. Crea un componente riutilizzabile `ScrollReveal.tsx`:

```tsx
// Varianti disponibili:
// - "fadeUp": opacity 0→1, y: 40→0
// - "fadeLeft": opacity 0→1, x: -40→0
// - "fadeRight": opacity 0→1, x: 40→0
// - "scaleIn": opacity 0→1, scale: 0.95→1
// - "clipUp": overflow hidden, y: 100%→0 (per titoli)

// Props: variant, delay, duration, className, once (boolean)
// Usa Framer Motion whileInView con viewport={{ once: true, amount: 0.2 }}
// Default transition: duration 0.7s, ease [0.25, 0.4, 0.25, 1]
```

**Applicazione per sezione:**

### Sezione "Auto in Evidenza"
- Titolo sezione: `clipUp`, delay 0
- Sottotitolo: `fadeUp`, delay 0.1s
- Card auto: `fadeUp` staggered, delay incrementale di 0.1s per ogni card (0.2, 0.3, 0.4...)
- Bottone "Vedi tutte": `fadeUp`, delay 0.5s

### Sezione Servizi
- Titolo: `clipUp`
- Card Finanziamento: `fadeLeft`, delay 0.15s
- Card Garanzia: `fadeRight`, delay 0.15s

### Sezione "Perché Privacar" (Trust)
- Titolo: `clipUp`
- 4 blocchi trust: `scaleIn` staggered, 0.1s tra ognuno
- Icone trust: `text-[#065F46]`
- Counter animati: usa un hook `useCountUp` che anima il numero da 0 al target quando entra nel viewport. Durata 2s, easing easeOut. Formatta con `Intl.NumberFormat('it-IT')`. Colore counter: `text-[#065F46]`

### Sezione CTA Vendita
- Background banner: gradient `from-[#064E3B] to-[#065F46]`
- Testo bianco, CTA button invertito: `bg-white text-[#065F46] hover:bg-[#ECFDF5]`
- Tutto il banner: `fadeUp` con `scaleIn` leggero (0.98→1)
- Testo interno staggered: titolo 0ms, paragrafo 150ms, bottone 300ms

### Sezione Recensioni
- Carousel: `fadeUp`
- Ogni review card entra con `fadeUp` staggered

---

## 5. VEHICLE CARD — Micro-interazioni Premium

La card auto è il componente più importante. Deve sentirsi "alive":

**Stato base:**
- `rounded-2xl`, background white, `border border-[#E5E7EB]/50`
- Shadow: `shadow-[0_1px_3px_rgba(0,0,0,0.04)]` (quasi invisibile)
- `overflow-hidden`

**Hover state (tutto con transition 0.4s cubic-bezier(0.25, 0.4, 0.25, 1)):**
- Shadow intensificata: `shadow-[0_12px_40px_rgba(0,0,0,0.1)]`
- Card lift: `translateY(-4px)` (NON scale, è più elegante)
- Border diventa: `border-[#E5E7EB]` (più visibile)
- L'immagine dentro la card: `scale(1.05)` con `transition: transform 0.6s cubic-bezier(0.25, 0.4, 0.25, 1)` — effetto zoom lento e smooth
- Badge alimentazione: leggero glow dietro (box-shadow colorato con opacità 0.15)
- Il prezzo: color transition da `#065F46` a `#047857` (leggermente più luminoso)
- I CTA buttons in fondo: opacity da 0.8 a 1, slide up leggero di 2px

**Immagine auto:**
- Container con `aspect-[16/10]`, `overflow-hidden`, `rounded-t-2xl`
- L'immagine ha `object-cover w-full h-full`
- Overlay gradient in basso: `bg-gradient-to-t from-black/20 via-transparent to-transparent` — leggero, per contrasto col badge
- Badge alimentazione: posizionato `absolute top-3 left-3`, `rounded-lg`, padding `4px 10px`, `text-[11px] font-semibold`, con backdrop-blur `backdrop-blur-sm` e background semi-trasparente
- Se l'auto è "Riservata" o "Venduta": overlay semi-trasparente con testo centrato

**Sezione info card:**
- Padding: `p-5`
- Brand: `text-[11px] font-body font-semibold uppercase tracking-[1.5px] text-[#8A9A90]` — con `mb-1`
- Model: `text-[17px] font-heading font-semibold text-[#0F1A14] leading-tight` — con `mb-3`
- Quick specs row: `flex gap-3 items-center text-[12px] font-body text-[#4B5B52]` — separati da dot `·` colorato (`text-[#D1D5DB]`)
- Divider: `border-t border-[#F3F4F6]` con `my-3`
- Price row: flex between, prezzo `font-heading font-bold text-[22px] text-[#065F46]`, rata `font-body text-[12px] text-[#8A9A90]`
- CTA row: `flex gap-2 mt-3`:
  - Bottone "Dettagli": `bg-[#065F46] hover:bg-[#047857] text-white rounded-xl text-[13px] font-body font-semibold py-[10px]`
  - Bottone "WhatsApp": `bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-[13px] font-body font-semibold py-[10px]`

**Click behavior:**
- Tutta la card è wrappata in `<Link>` verso `/auto/[slug]`
- I CTA buttons (Dettagli e WhatsApp) hanno `onClick={e => e.stopPropagation()}` per il WhatsApp, mentre Dettagli segue il link della card

---

## 6. PAGINA CATALOGO `/auto` — Filtri Premium

**Sidebar filtri desktop:**
- Width fisso `280px`, `sticky top-24`, altezza `max-h-[calc(100vh-120px)]` con `overflow-y-auto` e scrollbar custom (thin, grigio chiaro)
- Background: `#F8FAF9`, border-right `1px solid #F3F4F6`, `rounded-2xl`, padding `24px`
- Ogni gruppo filtro:
  - Label: `font-heading font-semibold text-[13px] uppercase tracking-wider text-[#065F46] mb-3`
  - Separato dal precedente con `mb-6`
  - Range slider: track grigio chiaro `#E5E7EB`, thumb `#065F46` con shadow, active range `#065F46`
  - Checkbox: custom checkbox con `accent-[#065F46]`, label `font-body text-[14px]`, hover highlight leggero
  - Select: custom styled, no browser default, `rounded-xl`, border `#E5E7EB`, focus ring `#065F46`

**Counter risultati:**
- Sopra la griglia: `font-body text-[14px] text-[#4B5B52]` — "**67** vetture trovate" dove il numero è `font-heading font-bold text-[#0F1A14]`
- Il numero anima con un mini count-up quando cambia (transition number)

**Griglia auto:**
- `grid grid-cols-3 gap-6` (desktop large), `grid-cols-2` (desktop medium)
- Le card appaiono con `fadeUp` staggered all'ingresso della pagina
- Quando i filtri cambiano e le card si aggiornano: animazione `layout` di Framer Motion per smooth reflow, con `AnimatePresence` per exit/enter delle card filtrate

**Sorting dropdown:**
- Custom styled, non il select nativo del browser
- Dropdown con shadow, rounded, animazione open/close con Framer Motion (scaleY da 0.95 a 1, opacity)

**Paginazione:**
- Design minimal: numeri in cerchi, active state `bg-[#065F46] text-white`, hover `bg-[#ECFDF5]`
- Frecce prev/next con icone Lucide
- Hover su numeri: `scale(1.05)` leggero

---

## 7. PAGINA DETTAGLIO `/auto/[slug]` — Esperienza Showroom

**Gallery foto:**
- Foto principale: `aspect-[16/10]`, `rounded-2xl`, `overflow-hidden`
- Hover sulla foto: cursor cambia a zoom-in, lieve shadow intensificata
- Click: apre lightbox fullscreen
- Lightbox: background `rgba(0,0,0,0.95)` con backdrop-blur, immagine centrata grande, frecce laterali grandi e semi-trasparenti, close button top-right, counter "2/8" in basso
- Animazione apertura: la foto si espande dalla sua posizione alla fullscreen (shared layout animation con Framer Motion `layoutId`)
- Thumbnails sotto la foto principale: `flex gap-2`, ogni thumb `w-20 h-14 rounded-lg overflow-hidden cursor-pointer`
- Thumb attiva: `ring-2 ring-[#065F46] ring-offset-2`
- Thumb hover: `opacity-80` → `opacity-100`, leggero `scale(1.05)`
- Transizione tra foto: crossfade smooth (opacity transition, no slide)

**Card info sticky:**
- `sticky top-24`, `rounded-2xl`, background white, `border border-[#E5E7EB]/60`
- Shadow: `shadow-[0_4px_20px_rgba(0,0,0,0.06)]`
- Padding `28px`
- Animazione ingresso: `fadeUp` con delay 0.3s
- Prezzo: `font-heading font-bold text-[36px] text-[#065F46]` con simbolo € più piccolo `text-[24px]`
- Rata finanziamento: sotto il prezzo, `font-body text-[14px] text-[#4B5B52]`, icona credit-card inline
- CTA buttons: stack verticale con `gap-3`
  - WhatsApp: `bg-[#25D366] hover:bg-[#20BD5A]`, `rounded-xl`, icona + testo, `shadow-[0_4px_12px_rgba(37,211,102,0.25)]` on hover
  - Chiama: outline `border-2 border-[#065F46] text-[#065F46]`, hover fill `bg-[#065F46] text-white`
  - Richiedi Info: `bg-[#065F46] hover:bg-[#047857]`, `shadow-[0_4px_12px_rgba(6,95,70,0.25)]` on hover
  - Prenota: outline `border-2 border-[#065F46] text-[#065F46]`, hover fill `bg-[#065F46] text-white`
- Tutti i bottoni: `font-body font-semibold text-[14px]`, padding `14px`, `rounded-xl`, transition `all 0.25s ease`
- Icone nei bottoni: Lucide, `size={18}`, con `mr-2`

**Specifiche tecniche:**
- Tabella a due colonne alternata: righe pari `bg-[#F8FAF9]`, righe dispari `bg-white`
- Label: `font-body text-[14px] text-[#4B5B52]`
- Valore: `font-body font-semibold text-[14px] text-[#0F1A14]`
- Padding righe: `py-3 px-4`
- Bordi: nessun bordo tra righe (usa solo background alternato per separare)
- `rounded-xl overflow-hidden` sul container tabella

**Sezione "Auto Simili":**
- Titolo con reveal animation
- Card in riga orizzontale, max 4, con lo stesso stile VehicleCard
- Se < 4 risultati, centra orizzontalmente

---

## 8. FOOTER — Premium e Dettagliato

- Background: `#064E3B` (verde smeraldo scuro profondo)
- Padding top generoso: `pt-20 pb-8`
- Sopra il footer: un divider decorativo — linea orizzontale con gradiente da trasparente a `#065F46` a trasparente, height `1px`, width `60%`, centrata
- Layout 4 colonne: Logo + tagline | Link Navigazione | Servizi | Contatti
- Logo: versione bianca, con sotto tagline `font-body text-[14px] text-[#A7F3D0]/70 max-w-[260px] leading-relaxed`
- Link: `font-body text-[14px] text-[#A7F3D0]/60`, hover: color `#fff` con transition 0.3s + leggero `translateX(3px)` (slide a destra)
- Titoli colonne: `font-heading font-semibold text-[13px] uppercase tracking-[2px] text-white mb-5`
- Sezione contatti: telefono e email cliccabili, icone Lucide `size={16}` inline
- Bottom bar: `border-t border-white/10 mt-12 pt-6`, flex between
  - Sinistra: copyright `text-[13px] text-[#A7F3D0]/40`
  - Destra: link Privacy, Cookie, social icons (hover: color da `text-[#A7F3D0]/40` a `#fff`)
- Social icons: cerchietti `w-9 h-9` con bordo `border border-white/20`, hover: `bg-white/10`, transition smooth
- Tutto il footer: `ScrollReveal fadeUp` con stagger sulle colonne

---

## 9. MODALI — Glassmorphism e Polish

Quando si aprono i form di contatto o appuntamento:

**Overlay:**
- `bg-black/60` con `backdrop-blur-sm` (4px)
- Click sull'overlay chiude la modale
- Animazione: opacity 0→1, duration 0.25s

**Modale:**
- `bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.2)]`
- Max width `520px`, padding `36px`
- Animazione ingresso: `scale(0.95) opacity(0)` → `scale(1) opacity(1)`, duration 0.35s, ease `[0.25, 0.4, 0.25, 1]`
- Animazione uscita: `scale(0.98) opacity(0)`, duration 0.2s
- Close button: `absolute top-4 right-4`, icona X in cerchio grigio chiaro, hover: background più scuro

**Form fields:**
- Input: `rounded-xl`, `border border-[#E5E7EB]`, padding `14px 16px`, `font-body text-[15px]`
- Focus state: `border-[#065F46] ring-2 ring-[#065F46]/10` — NO blu default del browser
- Label: `font-body font-medium text-[13px] text-[#0F1A14] mb-1.5`
- Placeholder: `text-[#8A9A90]`
- Textarea: stessa style, min-height `120px`
- Spacing tra campi: `space-y-4`

**Submit button:**
- Full width, `bg-[#065F46]`, `rounded-xl`, padding `14px`, `font-heading font-semibold text-[15px] text-white`
- Hover: `bg-[#047857]`, shadow `0 4px 12px rgba(6, 95, 70, 0.25)`
- Loading state: testo sostituito da spinner elegante (SVG animato, non il classico spinner brutto)
- Success state: il bottone resta verde `#065F46` (è già verde!), icona check appare con animazione, dopo 2 secondi la modale si chiude smooth

---

## 10. TIPOGRAFIA — Ritmo e Gerarchia Perfetti

Definisci in `globals.css` un sistema tipografico coerente:

```css
/* Titoli sezione homepage */
.section-title {
  @apply font-heading font-bold text-[40px] leading-[1.1] tracking-[-0.02em] text-[#0F1A14];
}

/* Sottotitoli sezione */
.section-subtitle {
  @apply font-body text-[17px] leading-relaxed text-[#4B5B52] max-w-[520px];
}

/* Etichette sopra i titoli (es: "IL NOSTRO PARCO AUTO") */
.section-label {
  @apply font-body font-semibold text-[12px] uppercase tracking-[3px] text-[#065F46] mb-3;
}
```

**Regole tipografiche generali:**
- Titoli h1: `text-[56px]` hero, `text-[40px]` pagine interne
- Titoli h2: `text-[32px]`
- Titoli h3: `text-[22px]`
- Body text: `text-[16px] leading-[1.7]` per paragrafi
- Captions: `text-[13px]`
- MAI usare `font-light` o `font-thin` — il minimo è `font-normal` (400)
- Letter-spacing negativo sui titoli grandi: `tracking-[-0.02em]` su h1, `tracking-[-0.01em]` su h2
- Letter-spacing positivo su label/captions: `tracking-[2px]` o `tracking-[3px]`

---

## 11. MICRO-DETTAGLI CHE FANNO LA DIFFERENZA

### Cursor personalizzato (opzionale ma molto Awwwards)
Crea un dot follower custom:
- Un cerchio piccolo (8px) che segue il cursor con leggero delay (lerp, non ritardo)
- Colore dot: `#065F46`
- Su hover dei link/bottoni: il cerchio si espande a 40px con `rgba(6, 95, 70, 0.15)`
- Su hover delle immagini: il cerchio mostra "ZOOM" o icona espandi
- Implementa con `useMotionValue` e `useSpring` di Framer Motion
- Nascondi il cursor default con `cursor: none` sul `<body>` (solo desktop, verifica con media query)

### Progress bar di scroll
- Barra sottilissima (2px) fissa in cima alla pagina, sopra la navbar
- Colore `#065F46`, width proporzionale allo scroll
- Usa `useScroll` → `scrollYProgress` → `scaleX` su un `motion.div` con `transform-origin: left`

### Transizioni tra pagine
- Quando si naviga tra le pagine, wrappa ogni page in:
```tsx
<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
>
```
- Questo dà un fade+slide up leggero ad ogni cambio pagina

### Bottoni con "ripple effect" al click
- Quando si clicca un bottone primario, un cerchio si espande dal punto di click con opacity decrescente
- Colore: bianco con opacity 0.3, durata 0.6s
- Implementa con un `<span>` posizionato absolute che anima scale e opacity

### Hover su link testuali
- Tutti i link nel body text: color `#065F46`, `underline-offset-4`, `decoration-[#065F46]/30`
- Hover: `decoration-[#065F46]` piena, transition smooth

### Loading skeleton premium
- Quando le card auto stanno caricando, mostra skeleton con effetto shimmer
- Il shimmer: gradiente che si muove da sinistra a destra infinitamente
- Colori: `bg-[#F3F4F6]` base, shimmer `#EAEAEA` → `#F3F4F6` → `#EAEAEA`
- Bordi arrotondati identici ai componenti reali
- Skeleton card: aspect ratio 16:10 per immagine + 3 righe di testo + 1 riga prezzo

### Notifiche Toast
- Posizione: bottom-right
- Background bianco, `rounded-xl`, shadow pronunciata, bordo sinistro colorato (`#065F46` per success, `#DC2626` per errore)
- Animazione: slide in da destra + fade, slide out dopo 4s
- Icona + testo su una riga, close button

---

## 12. DETTAGLI CSS GLOBALI

Aggiungi in `globals.css`:

```css
/* Smooth scroll nativo come fallback */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Custom scrollbar (solo desktop) */
@media (min-width: 1024px) {
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #F8FAF9;
  }
  ::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #8A9A90;
  }
}

/* Selection color — verde smeraldo */
::selection {
  background: rgba(6, 95, 70, 0.12);
  color: #0F1A14;
}

/* Focus visible per accessibilità */
:focus-visible {
  outline: 2px solid #065F46;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Rimuovi tap highlight su mobile */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Immagini */
img {
  -webkit-user-drag: none;
  user-select: none;
}
```

---

## 13. PAGINE STATICHE (Servizi, Vendi, Chi Siamo, Contatti) — Layout Premium

Tutte le pagine interne devono avere:

**Page header:**
- Background: sfumatura sottile da `#F8FAF9` a `#FFFFFF`
- Altezza: `py-20`
- Contenuto centrato: section-label `text-[#065F46]` in alto, titolo h1 sotto, breadcrumb sotto il titolo
- Breadcrumb: `font-body text-[13px] text-[#8A9A90]`, separatori `/`, link in `text-[#4B5B52]` hover `text-[#065F46]`
- Animazione: staggered reveal (label → title → breadcrumb)

**Contenuto:**
- Max width `max-w-[1200px] mx-auto px-6`
- Sezioni alternate: sfondo bianco e `#F8FAF9` per ritmo visivo
- Ogni sezione: `py-20`
- Immagini: `rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]`

---

## 14. PERFORMANCE CHECKLIST

- `will-change: transform` solo sugli elementi che effettivamente animano (card hover, modali)
- Usa `transform` e `opacity` per tutte le animazioni — mai animare `width`, `height`, `top`, `left`
- Framer Motion: `viewport={{ once: true }}` su tutti i reveal (non ri-animare al re-scroll)
- Immagini: tutte con `next/image`, `loading="lazy"` eccetto hero
- Font: solo i weight necessari (Sora: 400,500,600,700,800 | Libre Franklin: 400,500,600,700)
- `font-display: swap` già gestito da `next/font`
- Nessun layout shift: tutti i contenitori immagine hanno dimensioni fisse o aspect-ratio

---

## ORDINE DI IMPLEMENTAZIONE

1. **Palette** — Sostituzione globale colori + aggiornamento Tailwind config
2. Smooth scroll (Lenis) + CSS globali (scrollbar, selection, font smoothing)
3. Progress bar di scroll
4. Componente ScrollReveal riutilizzabile
5. Navbar premium con glassmorphism + animazione scroll
6. Hero cinematic con staggered reveal
7. Aggiornamento VehicleCard con hover premium
8. Sezioni homepage con scroll reveal orchestrato
9. Footer premium
10. Pagina catalogo: filtri, sorting, paginazione, layout animation
11. Pagina dettaglio: gallery + lightbox + card info sticky
12. Modali contatto/appuntamento
13. Page transitions
14. Toast notifications
15. Loading skeletons
16. Cursor custom (se tempo lo permette)
17. Polish finale e performance check
