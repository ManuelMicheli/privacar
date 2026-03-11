# Claude Code Prompt — Privacar Rho Website

## Contesto Progetto

Devi creare il sito web completo per **Privacar Rho**, un'agenzia di compravendita auto tra privati affiliata al network Privacar (https://www.privacar.com/). La sede è a Rho (MI), provincia di Milano.

Il modello di business Privacar: l'agenzia fa da intermediario nella vendita di auto tra privati, offrendo servizi professionali (perizia, finanziamento, garanzia) che rendono la compravendita tra privati sicura come acquistare da un concessionario. Il parco auto medio è di 60-100 veicoli.

**Ispirazione design**: siti come https://autosupermarket.it per il catalogo auto e le card veicoli, ma con un'esperienza più premium e curata dato che è un singolo punto vendita, non un marketplace.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4
- **Animazioni**: Framer Motion (transizioni pagina, card hover, modali)
- **Database & Auth**: Supabase (Postgres + Auth + Storage per immagini auto)
- **Deploy**: Vercel
- **Font**: Inter (body) + Plus Jakarta Sans o Outfit (headings)
- **Icons**: Lucide React

---

## Design System

### Palette — Ispirata a Privacar (pulito/moderno, sfondo bianco + colori brand)

```
Primary (Blu Privacar):     #1B3A5C (navy scuro — header, footer, titoli)
Primary Light:               #2A5A8C (hover states, accenti)
Secondary (Rosso Privacar):  #E63946 (CTA principali, prezzi, badge)
Secondary Light:             #FF6B6B (hover CTA)
Background:                  #FFFFFF (main)
Background Alt:              #F8F9FA (sezioni alternate, sidebar filtri)
Surface:                     #FFFFFF (card)
Border:                      #E5E7EB
Text Primary:                #1A1A2E
Text Secondary:              #6B7280
Text Muted:                  #9CA3AF
Success:                     #10B981 (badge "Disponibile")
Warning:                     #F59E0B (badge "Riservata")
Sold:                        #6B7280 (badge "Venduta")
```

### Badge Alimentazione (colori card)
```
Benzina:    bg-red-50 text-red-700 border-red-200
Diesel:     bg-blue-50 text-blue-700 border-blue-200
GPL:        bg-green-50 text-green-700 border-green-200
Metano:     bg-teal-50 text-teal-700 border-teal-200
Ibrida:     bg-emerald-50 text-emerald-700 border-emerald-200
Elettrica:  bg-violet-50 text-violet-700 border-violet-200
```

### Spacing & Border Radius
- Card border-radius: `rounded-2xl` (16px)
- Button border-radius: `rounded-xl` (12px)
- Spacing system: multipli di 4px, sezioni `py-16 md:py-24`
- Card shadow: `shadow-sm` default, `shadow-lg` on hover con transition

---

## Struttura Pagine

### 1. Homepage (`/`)

**Layout top-to-bottom:**

1. **Navbar** — Logo Privacar a sinistra, nav links (Parco Auto, Servizi, Vendi la tua Auto, Chi Siamo, Contatti), CTA button "Cerca Auto" a destra. Sticky on scroll con backdrop-blur. Mobile: hamburger menu con slide-in panel.

2. **Hero Section** — Full-width, altezza `min-h-[70vh]`. Background: immagine sfocata di un'auto premium o gradient blu scuro. Headline: "La tua prossima auto ti aspetta a Rho". Sottotitolo: "Oltre [counter dinamico] vetture selezionate e garantite. Compra e vendi tra privati in totale sicurezza." Sotto: **barra di ricerca rapida** inline (select Marca, select Fascia Prezzo con range predefiniti, select Alimentazione, bottone "Cerca" rosso). La barra deve avere sfondo bianco, bordi arrotondati, ombra, aspetto floating sulla hero.

3. **Auto in Evidenza** — Titolo "Vetture in Evidenza", sottotitolo "Selezionate dal nostro team". Griglia 3 colonne desktop (2 tablet, 1 mobile) con le auto flaggate `is_featured=true` dal DB. Max 6 auto. Ogni card è una `VehicleCard` (vedi componenti). Bottone "Vedi tutte le auto →" sotto.

4. **Servizi** — Due card grandi affiancate per Finanziamento e Garanzia. Ogni card: icona, titolo, breve descrizione (2-3 righe), CTA "Scopri di più". Sfondo `#F8F9FA`, design pulito.

5. **Perché Privacar** — Sezione trust con 4 blocchi a griglia: "100+ Controlli" (icona shield), "Prezzo Trasparente" (icona tag), "Finanziamento su Misura" (icona credit-card), "Garanzia Inclusa" (icona check-circle). Counter animati con Framer Motion su scroll.

6. **CTA Vendita** — Banner full-width con sfondo blu scuro: "Vuoi vendere la tua auto?" + testo breve + CTA bianco "Valuta la tua auto gratuitamente". Link a `/vendi`.

7. **Recensioni** — Carousel con 3-4 recensioni placeholder (nome, stelle, testo). Integrazione futura con Google Reviews API (per ora dati statici).

8. **Footer** — Sfondo `#1B3A5C`, testo bianco. 4 colonne: Logo + descrizione breve | Link utili (nav) | Servizi | Contatti (indirizzo Rho, telefono, email, orari). Sotto: riga con copyright, link privacy/cookie, social icons. Google Maps embed piccolo opzionale.

---

### 2. Parco Auto (`/auto`)

**Layout:**

- **Header pagina**: Titolo "Il Nostro Parco Auto", sottotitolo con counter dinamico ("X vetture disponibili"), breadcrumb.

- **Filtri + Griglia**: Layout a due colonne su desktop. Sidebar sinistra (280px) con filtri, griglia auto a destra.

**Sidebar Filtri (desktop) / Bottom Sheet (mobile):**
- **Marca**: Select searchable con tutte le marche presenti nel DB (query distinct)
- **Modello**: Select dipendente dalla marca selezionata (cascading filter)
- **Prezzo**: Doppio range slider (min/max) con input numerici, step €500
- **Anno**: Doppio range slider (min/max)
- **Chilometraggio**: Doppio range slider (min/max), step 5.000 km
- **Alimentazione**: Checkbox group (Benzina, Diesel, GPL, Metano, Ibrida, Elettrica)
- **Cambio**: Checkbox group (Manuale, Automatico)
- Bottone "Applica Filtri" + "Reset" su mobile
- Su desktop i filtri si applicano live con debounce 300ms via URL search params
- I filtri devono essere persistiti nell'URL (`/auto?brand=audi&fuel=diesel&price_max=25000`) per condivisibilità

**Griglia Auto:**
- 3 colonne desktop, 2 tablet, 1 mobile
- Sorting dropdown: "Più recenti", "Prezzo crescente", "Prezzo decrescente", "Km crescenti"
- **Paginazione**: 12 auto per pagina, paginazione numerica in fondo (non infinite scroll — meglio per SEO)
- Stato vuoto: "Nessuna vettura trovata con questi filtri. Prova a modificare la ricerca."

---

### 3. Dettaglio Auto (`/auto/[slug]`)

**Slug format**: `marca-modello-versione-anno` (es: `audi-a3-sportback-35-tdi-2021`). Generato automaticamente all'inserimento.

**Layout pagina:**

1. **Breadcrumb**: Home > Parco Auto > [Marca] > [Modello]

2. **Sezione principale** — Due colonne su desktop:
   - **Sinistra (60%)**: Gallery foto. Foto principale grande (aspect 16:10) + thumbnails sotto (scrollabili). Click su foto apre lightbox fullscreen con swipe (usare Framer Motion per animazioni). Se nessuna foto: placeholder elegante con icona auto.
   - **Destra (40%)**: Card info sticky (`sticky top-24`):
     - Marca + Modello + Versione (titolo H1)
     - Badge alimentazione colorato
     - **Prezzo** grande e bold con colore rosso `#E63946`
     - Riga: "Finanziabile da **€XXX/mese**" (calcolo base: prezzo / 48 mesi, solo indicativo)
     - Divider
     - Quick specs in griglia 2x3: Anno, Km, Alimentazione, Cambio, Potenza CV, Cilindrata
     - Divider
     - **4 CTA buttons** in stack verticale:
       1. 🟢 "Scrivici su WhatsApp" (link `https://wa.me/39XXXXXXXXXX?text=Ciao, sono interessato a [marca] [modello] - [url]`) — sfondo verde WhatsApp `#25D366`
       2. 📞 "Chiama ora" (link `tel:+39XXXXXXXXXX`) — outline blu
       3. 📋 "Richiedi Informazioni" — apre modale con form (vedi sotto) — sfondo rosso `#E63946`
       4. 📅 "Prenota un Appuntamento" — apre modale appuntamento — outline blu

3. **Dettagli Completi** — Sotto la sezione principale, tabs o accordion:
   - **Specifiche Tecniche**: tabella a due colonne (label/valore) con tutte le info: anno immatricolazione, km, alimentazione, cilindrata cc, potenza CV/kW, cambio (manuale/automatico), trazione, carrozzeria, colore esterno, colore interni, porte, posti, classe emissioni, consumo (se disponibile), neopatentati (sì/no)
   - **Descrizione**: testo libero inserito dall'admin
   - **Dotazioni/Optional**: lista da campo JSONB `features`, divisa in categorie (Comfort, Sicurezza, Infotainment, Altro) se popolate

4. **Auto Simili** — Sezione bottom: "Potrebbe interessarti anche". Query: stessa marca OR stessa fascia prezzo (±20%), max 4 risultati, esclusa l'auto corrente.

**SEO**: Genera `<title>` come "[Marca] [Modello] [Versione] [Anno] | Privacar Rho" e meta description dinamica. Implementa Schema.org `Vehicle` e `Car` markup in JSON-LD.

---

### 4. Servizi (`/servizi`)

Due sezioni full-width:

**Finanziamento:**
- Headline: "Finanziamento su Misura"
- Descrizione: spiega che è possibile acquistare un'auto tra privati con finanziamento grazie a Privacar. Nessun anticipo obbligatorio, rate personalizzabili, risposta rapida.
- Lista vantaggi (3-4 punti con icone)
- CTA: "Richiedi una simulazione" → apre form contatto con `request_type: "finanziamento"`

**Garanzia:**
- Headline: "Garanzia Meccanica"
- Descrizione: tutte le auto Privacar sono sottoposte a perizia con 100+ controlli. Possibilità di garanzia meccanica estesa.
- Lista coperture (motore, cambio, elettronica, etc.)
- CTA: "Scopri la copertura" → apre form contatto con `request_type: "garanzia"`

---

### 5. Vendi la tua Auto (`/vendi`)

Landing page per lead acquisition:

1. **Hero**: "Vuoi vendere la tua auto? Fallo al miglior prezzo, senza stress." Sottotitolo che spiega il metodo Privacar in una riga.

2. **Come Funziona**: 4 step visuali orizzontali (con icone + numeri):
   - 1. Portaci la tua auto o chiedi una visita
   - 2. Perizia gratuita con 100+ controlli
   - 3. Pubblichiamo l'annuncio e gestiamo tutto
   - 4. Vendiamo al miglior prezzo, tu incassi

3. **Vantaggi**: griglia 3 colonne — "Nessun vincolo", "Servizio fotografico professionale", "Trattativa gestita da esperti", "Servizi per l'acquirente (finanziamento, garanzia)", "Prezzo più alto vs. concessionario", "Zero pensieri burocratici"

4. **Form Valutazione Rapida**: card con sfondo chiaro, campi: Marca (select), Modello (text), Anno (select), Km (number), Nome, Telefono, Email. Submit → salva in `contact_requests` con `request_type: "valutazione"`. Messaggio di conferma: "Grazie! Ti ricontatteremo entro 24 ore."

---

### 6. Chi Siamo (`/chi-siamo`)

- Breve intro su Privacar come network e sulla sede di Rho
- Foto placeholder del team/sede (per ora immagine segnaposto)
- Sezione "Il Metodo Privacar": perizia 100+ controlli, foto professionali, documenti verificati, tutela legale
- Numeri: counter animati (auto vendute, clienti soddisfatti, anni di esperienza — placeholder)
- CTA verso contatti

---

### 7. Contatti (`/contatti`)

- **Mappa**: Google Maps embed centrato sull'indirizzo dell'agenzia a Rho (usare indirizzo placeholder: "Via [da definire], Rho (MI)")
- **Info Card**: Indirizzo, telefono (cliccabile), WhatsApp (cliccabile), email, orari di apertura (tabella giorno/orario)
- **Form Contatto Generico**: Nome, Email, Telefono, Messaggio, select Motivo (Info generali, Interessato a un'auto, Vendere la mia auto, Finanziamento, Altro). Submit → `contact_requests`.
- **Form Prenotazione Appuntamento**: Nome, Email, Telefono, Data preferita (date picker, no domenica), Fascia oraria preferita (mattina/pomeriggio), Note. Submit → `appointments`.

---

## Schema Database Supabase

### Tabella `vehicles`
```sql
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT, -- allestimento/trim (es: "Sportback 35 TDI S-Tronic")
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL, -- km
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('benzina','diesel','gpl','metano','ibrida','elettrica')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manuale','automatico')),
  power_hp INTEGER, -- cavalli
  power_kw INTEGER, -- kW
  engine_cc INTEGER, -- cilindrata in cc
  body_type TEXT, -- berlina, sw, suv, coupé, cabrio, monovolume, etc.
  color_exterior TEXT,
  color_interior TEXT,
  doors INTEGER DEFAULT 5,
  seats INTEGER DEFAULT 5,
  emission_class TEXT, -- Euro 6, Euro 5, etc.
  drive_type TEXT, -- FWD, RWD, AWD
  new_driver_ok BOOLEAN DEFAULT false, -- adatta neopatentati
  price DECIMAL(10,2) NOT NULL,
  monthly_payment DECIMAL(10,2), -- rata finanziamento indicativa
  description TEXT, -- testo libero
  features JSONB DEFAULT '{}', -- { "comfort": [...], "sicurezza": [...], "infotainment": [...] }
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'disponibile' CHECK (status IN ('disponibile','riservata','venduta')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_fuel ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_year ON vehicles(year);
```

### Tabella `vehicle_images`
```sql
CREATE TABLE vehicle_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL, -- URL da Supabase Storage
  position INTEGER DEFAULT 0, -- ordine (0 = foto copertina)
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle ON vehicle_images(vehicle_id);
```

### Tabella `contact_requests`
```sql
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL, -- nullable, non tutte le richieste sono su un'auto specifica
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('info','finanziamento','garanzia','valutazione','generico')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabella `appointments`
```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT CHECK (preferred_time IN ('mattina','pomeriggio')),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabella `site_settings`
```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dati iniziali
INSERT INTO site_settings (key, value) VALUES
  ('contact_info', '{"phone": "+39 02 XXXXXXX", "whatsapp": "+39 XXX XXXXXXX", "email": "rho@privacar.com", "address": "Via [Da Definire], 20017 Rho (MI)"}'),
  ('opening_hours', '{"lunedi": "9:00-12:30 / 15:00-19:00", "martedi": "9:00-12:30 / 15:00-19:00", "mercoledi": "9:00-12:30 / 15:00-19:00", "giovedi": "9:00-12:30 / 15:00-19:00", "venerdi": "9:00-12:30 / 15:00-19:00", "sabato": "9:00-12:30", "domenica": "Chiuso"}'),
  ('social_links', '{"facebook": "", "instagram": ""}'),
  ('stats', '{"cars_sold": 200, "happy_clients": 180, "years_experience": 1}');
```

### Supabase Storage
- Bucket `vehicle-images`: pubblico, per foto auto
- Policy: upload/delete solo per utenti autenticati (admin), read pubblico

### RLS Policies
```sql
-- Vehicles: lettura pubblica, scrittura solo admin
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Vehicles are editable by admins" ON vehicles FOR ALL USING (auth.role() = 'authenticated');

-- Stesso pattern per vehicle_images (read public, write auth)
-- contact_requests e appointments: insert pubblico (form), read/update solo admin
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contacts" ON contact_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update contacts" ON contact_requests FOR UPDATE USING (auth.role() = 'authenticated');

-- Stesso per appointments
```

---

## Dashboard Admin (`/admin`)

Protetta da Supabase Auth. Login con email/password. Redirect a `/admin` dopo login, redirect a `/admin/login` se non autenticato. Layout con sidebar di navigazione.

### Pagine Admin:

**1. Dashboard Overview (`/admin`)**
- Card metriche: Auto totali (per status), Contatti non letti, Appuntamenti in attesa
- Lista ultimi 5 contatti e ultimi 5 appuntamenti

**2. Gestione Veicoli (`/admin/veicoli`)**
- Tabella con tutte le auto: foto thumbnail, marca/modello, anno, prezzo, status, featured (toggle), azioni (modifica/elimina)
- Filtri rapidi per status
- Bottone "Aggiungi Veicolo"

**3. Editor Veicolo (`/admin/veicoli/nuovo` e `/admin/veicoli/[id]`)**
- Form completo con tutti i campi della tabella `vehicles`
- Marca: select con le marche auto più comuni italiane pre-populate (Abarth, Alfa Romeo, Audi, BMW, Citroen, Dacia, Fiat, Ford, Hyundai, Jeep, Kia, Lancia, Land Rover, Mazda, Mercedes-Benz, Mini, Nissan, Opel, Peugeot, Porsche, Renault, Seat, Skoda, Smart, Suzuki, Tesla, Toyota, Volkswagen, Volvo) + opzione "Altro" con input libero
- Upload foto: zona drag & drop, upload multiplo a Supabase Storage, preview thumbnails, possibilità di riordinare (drag to reorder), selezionare foto di copertina, eliminare singole foto
- Slug: auto-generato da marca+modello+versione+anno, editabile manualmente
- Features/dotazioni: interfaccia per aggiungere item per categoria (Comfort, Sicurezza, Infotainment, Altro)
- Preview: bottone per vedere come apparirà la pagina pubblica
- Salva → upsert su Supabase con validazione Zod

**4. Contatti (`/admin/contatti`)**
- Lista con: data, nome, tipo richiesta, auto collegata (se presente, link), stato letto/non letto
- Click → dettaglio con tutti i dati + bottone "Segna come letto" + link rapido a WhatsApp/telefono/email del richiedente
- Filtro per tipo e stato

**5. Appuntamenti (`/admin/appuntamenti`)**
- Lista con: data appuntamento, nome, auto (se collegata), status (badge colorato)
- Click → dettaglio con possibilità di cambiare status (pending → confirmed → completed / cancelled)
- Filtro per status e data

**6. Impostazioni (`/admin/impostazioni`)**
- Form per modificare dati della tabella `site_settings`: telefono, WhatsApp, email, indirizzo, orari di apertura, link social, statistiche counter

---

## Componenti Chiave

### VehicleCard
```
Struttura visiva:
┌─────────────────────────────┐
│  [FOTO 16:10]               │
│  ┌──────┐                   │
│  │DIESEL│  (badge overlay)  │
│  └──────┘                   │
├─────────────────────────────┤
│  AUDI                       │ ← brand (text-sm, text-muted, uppercase)
│  A3 Sportback 35 TDI        │ ← model+version (text-lg, font-semibold)
│                              │
│  📅 2021  ·  📏 45.000 km  ·  ⚙️ Automatico  │ ← quick specs row
│                              │
│  ─────────────────────────  │
│  €22.900          da €477/m │ ← prezzo bold rosso + rata piccola
│  ─────────────────────────  │
│  [DETTAGLI]  [WHATSAPP]     │ ← 2 CTA buttons
└─────────────────────────────┘
```
- Sfondo bianco, `rounded-2xl`, `shadow-sm`, hover: `shadow-lg` + `scale-[1.02]` con `transition-all duration-300`
- Foto: aspect ratio 16:10 con `object-cover`, overlay gradiente leggero in basso
- Badge alimentazione: posizionato in overlay sulla foto (top-left), con colori come da design system
- Badge "Riservata" o "Venduta" se applicabile (overlay semi-trasparente sulla foto)
- Link wrapper: tutta la card è cliccabile verso `/auto/[slug]`

### FilterSidebar
- Componente riutilizzabile, collassabile su mobile (bottom sheet o slide-in)
- Ogni filtro gestisce il proprio state, sync con URL search params via `useSearchParams()` e `useRouter()`
- Range slider custom con Tailwind (o libreria leggera tipo `rc-slider`)
- Debounce 300ms su desktop per filtering live
- Counter risultati aggiornato in tempo reale

### ContactModal
- Modale con overlay backdrop-blur
- Form con validazione Zod client-side
- Campi: Nome (required), Email (required, validazione formato), Telefono (opzionale), Messaggio (required per tipo "info", opzionale per altri)
- Submit con loading state, success toast, error handling
- Se aperto dalla pagina di un'auto, pre-popola `vehicle_id` e include riferimento auto nel messaggio

### AppointmentModal
- Come ContactModal ma con campi aggiuntivi: date picker (no domenica, no date passate), select fascia oraria (Mattina 9-12:30 / Pomeriggio 15-19)

---

## SEO & Performance

### SEO
- `metadata` Next.js su ogni pagina con title e description dinamici
- Schema.org JSON-LD:
  - Homepage: `LocalBusiness` (AutoDealer)
  - Dettaglio auto: `Vehicle` / `Car` con price, mileage, fuelType, etc.
  - Contatti: `LocalBusiness` con `openingHours`, `address`, `telephone`
- `sitemap.xml` dinamica generata da Next.js che include tutte le auto disponibili
- `robots.txt` corretto
- Tag `<link rel="canonical">` su ogni pagina
- Open Graph e Twitter Card meta tags per condivisione social (con immagine auto per le pagine dettaglio)

### Performance
- Immagini auto: servite da Supabase Storage con trasformazioni (thumbnail per card, full per gallery)
- `next/image` con `priority` sulla hero e sulle prime 6 card visibili
- Lazy loading per card sotto il fold
- Filtri: query Supabase con index ottimizzati, no fetch di tutte le auto
- ISR o SSG dove possibile per le pagine statiche (servizi, chi siamo)

### Sicurezza
- Form: validazione Zod sia client che server-side (Server Actions)
- Rate limiting base sui form submit (opzionale, via Supabase Edge Functions o middleware)
- Sanitizzazione input
- CSP headers in `next.config.js`
- Supabase RLS attivo su tutte le tabelle

---

## Struttura File Progetto

```
privacar-rho/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (navbar + footer)
│   │   ├── page.tsx                  # Homepage
│   │   ├── auto/
│   │   │   ├── page.tsx              # Catalogo con filtri
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Dettaglio auto
│   │   ├── servizi/
│   │   │   └── page.tsx
│   │   ├── vendi/
│   │   │   └── page.tsx
│   │   ├── chi-siamo/
│   │   │   └── page.tsx
│   │   ├── contatti/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin layout (sidebar + auth guard)
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── veicoli/
│   │   │   │   ├── page.tsx          # Lista veicoli
│   │   │   │   ├── nuovo/
│   │   │   │   │   └── page.tsx      # Crea veicolo
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Modifica veicolo
│   │   │   ├── contatti/
│   │   │   │   └── page.tsx
│   │   │   ├── appuntamenti/
│   │   │   │   └── page.tsx
│   │   │   └── impostazioni/
│   │   │       └── page.tsx
│   │   └── api/                      # Route handlers se necessari
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── vehicles/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleGrid.tsx
│   │   │   ├── VehicleGallery.tsx
│   │   │   ├── VehicleSpecs.tsx
│   │   │   ├── VehicleFeatures.tsx
│   │   │   ├── SimilarVehicles.tsx
│   │   │   └── FeaturedVehicles.tsx
│   │   ├── filters/
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── RangeSlider.tsx
│   │   │   ├── FilterCheckboxGroup.tsx
│   │   │   └── HeroSearchBar.tsx
│   │   ├── forms/
│   │   │   ├── ContactModal.tsx
│   │   │   ├── AppointmentModal.tsx
│   │   │   ├── ValuationForm.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Counter.tsx           # Animated number counter
│   │   └── admin/
│   │       ├── VehicleForm.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── ContactsList.tsx
│   │       ├── AppointmentsList.tsx
│   │       └── StatsCards.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── admin.ts              # Service role client (per server actions)
│   │   ├── queries/
│   │   │   ├── vehicles.ts           # Query functions per veicoli
│   │   │   ├── contacts.ts
│   │   │   ├── appointments.ts
│   │   │   └── settings.ts
│   │   ├── schemas/
│   │   │   ├── vehicle.ts            # Zod schemas per veicoli
│   │   │   ├── contact.ts
│   │   │   └── appointment.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts         # formatPrice, formatMileage, etc.
│   │   │   ├── slug.ts               # generateSlug
│   │   │   └── constants.ts          # FUEL_TYPES, BRANDS, TRANSMISSION_TYPES, etc.
│   │   └── actions/
│   │       ├── vehicle-actions.ts    # Server actions CRUD veicoli
│   │       ├── contact-actions.ts
│   │       └── appointment-actions.ts
│   └── types/
│       └── index.ts                  # TypeScript types/interfaces per Vehicle, Contact, Appointment, Settings
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg              # Placeholder hero
│   │   ├── logo-privacar.svg
│   │   └── placeholder-car.jpg
│   └── fonts/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Tutto lo schema SQL sopra
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Dati Seed / Placeholder

Crea un file `supabase/seed.sql` con almeno 8-10 auto di esempio per testare filtri e paginazione. Mix di marche (Audi, BMW, Fiat, Toyota, Mercedes, Volkswagen), anni (2018-2024), fasce prezzo (€8.000-€35.000), alimentazioni diverse. Ogni auto con description e features JSONB popolate.

---

## Note Implementative

1. **Slug generation**: prima di salvare un veicolo, genera slug unico. Se esiste duplicato, appendi `-2`, `-3`, etc.
2. **Monthly payment**: se non inserito manualmente, calcolalo come `price / 48` (approssimativo).
3. **WhatsApp link**: costruisci il messaggio pre-compilato con marca, modello e URL della pagina auto.
4. **Responsive first**: tutto deve funzionare perfettamente su mobile. Il 70%+ del traffico sarà mobile.
5. **Loading states**: usa Skeleton components durante il fetch delle auto.
6. **Animazioni Framer Motion**: keep them subtle — fade-in su scroll per sezioni homepage, scale su hover card, slide-in per modali. Non esagerare.
7. **Admin image upload**: comprimi le foto lato client prima dell'upload (max 1920px larghezza, quality 85%) per non saturare lo storage.
8. **Accessibilità**: `aria-label` su tutti i bottoni icon-only, focus states visibili, form labels corretti.
9. **Internazionalizzazione**: il sito è solo in italiano, ma formatta prezzi con `Intl.NumberFormat('it-IT')` e date con `Intl.DateTimeFormat('it-IT')`.
10. **Error boundaries**: implementa error.tsx e not-found.tsx custom per ogni route segment.

---

## Ordine di Implementazione Suggerito

1. Setup progetto (Next.js 15, Tailwind, Supabase client, struttura cartelle)
2. Schema DB + migrations + seed data
3. Types TypeScript + Zod schemas
4. Layout globale (Navbar + Footer)
5. Homepage (hero + search bar + featured + servizi + CTA)
6. VehicleCard component
7. Pagina catalogo `/auto` con filtri e paginazione
8. Pagina dettaglio `/auto/[slug]` con gallery + specs + CTA
9. Form/modali contatto e appuntamento
10. Pagine statiche (servizi, vendi, chi siamo, contatti)
11. Admin: auth + layout + dashboard
12. Admin: CRUD veicoli + image upload
13. Admin: gestione contatti e appuntamenti
14. SEO (metadata, sitemap, schema.org)
15. Performance optimization + testing finale
