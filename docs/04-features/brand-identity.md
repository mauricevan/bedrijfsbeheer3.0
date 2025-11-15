# Brand Identity & Visuele Stijl

**Versie:** 1.0
**Laatst bijgewerkt:** November 2025
**Doel:** Definieer de unieke visuele identiteit van Bedrijfsbeheer Dashboard

---

## 📋 Inhoudsopgave

1. [Brand Persoonlijkheid](#brand-persoonlijkheid)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Iconografie](#iconografie)
5. [Visuele Elementen](#visuele-elementen)
6. [Fotografie & Illustraties](#fotografie--illustraties)
7. [Do's en Don'ts](#dos-en-donts)
8. [Implementatie](#implementatie)

---

## Brand Persoonlijkheid

### Wie Zijn We?

**Bedrijfsbeheer Dashboard** is een **modern, betrouwbaar en menselijk** bedrijfsbeheer systeem voor MKB productiebedrijven.

### Persoonlijkheidskenmerken

#### 1. Betrouwbaar 🏗️

**Wat dit betekent:**
- Solide en stabiel (zoals een goed gebouwd product)
- Voorspelbaar en consistent
- Veilig en vertrouwd
- Professioneel

**Visueel vertaald:**
- Kalmerende blauwtinten (vertrouwen)
- Stevige, duidelijke typografie
- Consistente spacing en alignment
- Subtiele, niet-afleidende effecten

#### 2. Modern 🚀

**Wat dit betekent:**
- 2025 tech-standaard
- Up-to-date met trends (maar niet trendy)
- Efficient en snel
- Future-proof

**Visueel vertaald:**
- Gradients waar passend
- Glassmorphism effecten (subtiel)
- Smooth animaties
- Moderne color palette

#### 3. Menselijk 😊

**Wat dit betekent:**
- Niet kil of robotisch
- Begripvol en helpend
- Toegankelijk voor iedereen
- Met gevoel voor humor (gepast)

**Visueel vertaald:**
- Warme accentkleuren
- Vriendelijke empty states
- Leuke emoji's waar passend
- Positieve feedback messages

#### 4. Energiek ⚡

**Wat dit betekent:**
- Productie en actie-gericht
- Snel en responsief
- Dynamisch maar niet chaotisch
- "Getting things done" mentaliteit

**Visueel vertaald:**
- Levendige accentkleuren (oranje, teal)
- Quick animations (< 200ms)
- Active states met feedback
- Duidelijke call-to-actions

---

## Color Palette

### Primaire Kleuren

#### Primary Blue - Vertrouwen & Stabiliteit

**Gebruik voor:**
- Primary buttons (Opslaan, Toevoegen)
- Links en interactieve elementen
- Active states in navigatie
- Focus rings

**Tinten:**
```css
primary-50:  #eff6ff  /* Zeer lichte achtergronden */
primary-100: #dbeafe  /* Hover backgrounds */
primary-200: #bfdbfe  /* Disabled states */
primary-300: #93c5fd  /* Borders, dividers */
primary-400: #60a5fa  /* Hover states */
primary-500: #3b82f6  /* DEFAULT - Primary buttons */
primary-600: #2563eb  /* Hover op primary buttons */
primary-700: #1d4ed8  /* Active states */
primary-800: #1e40af  /* Tekst op lichte achtergrond */
primary-900: #1e3a8a  /* Zeer donker, headlines */
```

**Psychologie:**
- Blauw = Vertrouwen, stabiliteit, professionaliteit
- Meest gebruikte kleur in business software
- Kalmerend effect

#### Secondary Gray - Neutraal & Clean

**Gebruik voor:**
- Body tekst (gray-700/800)
- Borders en dividers (gray-200/300)
- Disabled states (gray-400)
- Backgrounds (gray-50/100)
- Secondary buttons

**Tinten:**
```css
gray-50:  #f9fafb  /* Page backgrounds */
gray-100: #f3f4f6  /* Card backgrounds alternatief */
gray-200: #e5e7eb  /* Borders, dividers */
gray-300: #d1d5db  /* Disabled borders */
gray-400: #9ca3af  /* Placeholder text */
gray-500: #6b7280  /* Icons, labels */
gray-600: #4b5563  /* Secondary text */
gray-700: #374151  /* Body text */
gray-800: #1f2937  /* Headings */
gray-900: #111827  /* Zeer belangrijke headings */
```

### Accent Kleuren

#### Success Green - Positief & Voltooid

**Gebruik voor:**
- Success messages
- Completed status
- Positive metrics (↑ omzet)
- Checkmarks, success icons
- "In stock" indicators

**Tinten:**
```css
success-50:  #f0fdf4  /* Success message backgrounds */
success-100: #dcfce7
success-500: #22c55e  /* DEFAULT - Success states */
success-600: #16a34a  /* Hover on success buttons */
success-700: #15803d  /* Completed status badges */
```

**Voorbeelden:**
- ✅ "Werkorder voltooid!"
- ✅ Betaalde facturen badge
- ✅ Voorraad op niveau (groen)

#### Warning Orange - Aandacht & Energie

**Gebruik voor:**
- Warning messages
- Pending status
- Lage voorraad waarschuwingen
- "Wacht op actie" states
- Energieke accent color

**Tinten:**
```css
warning-50:  #fff7ed  /* Warning backgrounds */
warning-100: #ffedd5
warning-500: #f97316  /* DEFAULT - Warnings */
warning-600: #ea580c  /* Hover */
warning-700: #c2410c  /* Pending badges */
```

**Voorbeelden:**
- ⚠️ "Lage voorraad"
- ⏸️ "In wacht" status
- 🔔 Notificaties badge

#### Error Red - Urgent & Kritiek

**Gebruik voor:**
- Error messages
- Destructive actions (Verwijderen)
- Kritieke waarschuwingen
- Out of stock indicators
- Validation errors

**Tinten:**
```css
error-50:  #fef2f2  /* Error backgrounds */
error-100: #fee2e2
error-500: #ef4444  /* DEFAULT - Errors */
error-600: #dc2626  /* Hover op delete buttons */
error-700: #b91c1c  /* Critical alerts */
```

**Voorbeelden:**
- ❌ "Veld is verplicht"
- 🗑️ Verwijder button (hover)
- 🚨 Kritieke voorraad

#### Info Blue - Informatief & Helpend

**Gebruik voor:**
- Info messages
- Tips en hints
- Nieuwe features
- Help tekstjes

**Tinten:**
```css
info-50:  #eff6ff  /* Info backgrounds */
info-100: #dbeafe
info-500: #3b82f6  /* DEFAULT - Info states */
info-600: #2563eb
```

### Brand Accent Kleuren

#### Teal - Fris & Modern

**Gebruik voor:**
- Alternative primary color
- Categorie badges (wisselend)
- Charts en grafieken
- Special features

**Tinten:**
```css
teal-400: #2dd4bf  /* Light teal */
teal-500: #14b8a6  /* DEFAULT */
teal-600: #0d9488  /* Hover */
```

**Wanneer gebruiken:**
- Diversiteit in charts
- Categorie onderscheid
- Accent naast primary blue

#### Purple - Premium & Innovatief

**Gebruik voor:**
- Categorie badges
- Premium features (toekomstig)
- Accent in illustraties
- Special call-outs

**Tinten:**
```css
purple-400: #a78bfa  /* Light purple */
purple-500: #8b5cf6  /* DEFAULT */
purple-600: #7c3aed  /* Hover */
```

**Wanneer gebruiken:**
- Inventaris categorieën
- Feature highlights
- Variatie in UI

### Color Gebruik Guidelines

#### Do's ✅

**Primary Color:**
- Gebruik voor belangrijkste acties (CTA buttons)
- Links en interactieve elementen
- Focus states
- Navigatie active states

**Success Color:**
- Alleen voor positieve feedback
- Voltooide states
- "Alles goed" indicatoren

**Warning Color:**
- Aandacht vragen (geen paniek)
- Pending states
- "Actie vereist" maar niet urgent

**Error Color:**
- Alleen voor errors en destructieve acties
- Kritieke waarschuwingen
- Validatie fouten

#### Don'ts ❌

**Vermijd:**
- ❌ Rood gebruiken voor niet-errors (verwarrend)
- ❌ Teveel kleuren door elkaar (max 3 per view)
- ❌ Kleuren zonder betekenis
- ❌ Kleur als enige indicator (accessibility)

**Voorbeelden van FOUT gebruik:**
```
❌ Rode button voor "Opslaan" (rood = danger)
❌ Groene "Verwijder" button (groen = success)
❌ Blauw/paars/teal/oranje allemaal op één card (te druk)
```

### Kleur Contrast (Accessibility)

**WCAG AA Vereisten:**

**Normale tekst (< 18px):**
- Contrast ratio minimum: **4.5:1**
- Voorbeeld: `text-gray-700` op `bg-white` ✅

**Grote tekst (≥ 18px of ≥ 14px bold):**
- Contrast ratio minimum: **3:1**
- Voorbeeld: `text-gray-600` op `bg-white` ✅

**UI componenten (buttons, icons):**
- Contrast ratio minimum: **3:1**
- Voorbeeld: Border `border-gray-300` op `bg-white` ✅

**Tools voor checking:**
- WebAIM Contrast Checker
- Chrome DevTools Accessibility panel
- Figma contrast plugins

---

## Typography

### Font Families

#### System Font Stack (Huidig)

**Voordeel:**
- ✅ Laadt instant (geen webfont download)
- ✅ Native OS look & feel
- ✅ Betere performance
- ✅ Cross-platform consistent

**Stack:**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial,
             sans-serif;
```

**Resultaat op verschillende OS:**
- macOS: San Francisco
- Windows: Segoe UI
- Android: Roboto
- Linux: Ubuntu / system default

#### Custom Webfont (Optioneel Toekomstig)

**Overwegen indien:**
- Branded look gewenst
- Unieke typografische identiteit
- Budget voor webfont licentie

**Suggesties:**
- **Inter** - Modern, tech-friendly, gratis
- **Poppins** - Friendly, rounded, gratis
- **Work Sans** - Professional, clean, gratis

### Type Scale

#### Desktop

```css
/* Headers */
text-4xl: 36px / 40px  /* H1 - Page titles */
text-3xl: 30px / 36px  /* H2 - Section headers */
text-2xl: 24px / 32px  /* H3 - Card headers */
text-xl:  20px / 28px  /* H4 - Subheaders */
text-lg:  18px / 28px  /* Large body, emphasized */

/* Body */
text-base: 16px / 24px /* DEFAULT - Body text */
text-sm:   14px / 20px /* Small text, labels */
text-xs:   12px / 16px /* Very small, timestamps */
```

#### Mobile

```css
/* Headers (kleiner op mobile) */
text-2xl: 24px / 32px  /* H1 on mobile */
text-xl:  20px / 28px  /* H2 on mobile */
text-lg:  18px / 28px  /* H3 on mobile */

/* Body (zelfde als desktop) */
text-base: 16px / 24px /* Body - MINIMUM 16px voor iOS! */
text-sm:   14px / 20px /* Small */
text-xs:   12px / 16px /* Tiny */
```

**Waarom 16px minimum:**
- iOS Safari zoomt in bij < 16px in inputs
- Voorkomt frustratie bij formulieren
- Betere leesbaarheid algemeen

### Font Weights

```css
font-normal:   400  /* Body text, beschrijvingen */
font-medium:   500  /* Emphasis in body, labels */
font-semibold: 600  /* Subheaders, belangrijke labels */
font-bold:     700  /* Headers, cijfers in KPI's */
```

**Gebruik guidelines:**

**Headers (H1-H4):**
- H1: `font-bold` (700)
- H2: `font-semibold` (600)
- H3: `font-semibold` (600)
- H4: `font-medium` (500)

**Body & UI:**
- Normale tekst: `font-normal` (400)
- Labels: `font-medium` (500)
- Buttons: `font-medium` (500)
- KPI cijfers: `font-bold` (700)

**Status badges:**
- `font-medium` (500)

### Line Height

**Body tekst:**
```css
leading-relaxed: 1.625  /* Extra ruim, lange tekstblokken */
leading-normal:  1.5    /* DEFAULT - Body text */
leading-snug:    1.375  /* Compact, headings */
```

**Gebruik:**
- Lange paragrafen: `leading-relaxed`
- Standaard body: `leading-normal`
- Headers: `leading-snug`
- Buttons/badges: `leading-none`

### Letter Spacing

**Meestal default laten!**

Alleen aanpassen voor:
```css
tracking-wide:    0.025em  /* UPPERCASE LABELS */
tracking-normal:  0        /* DEFAULT - Alles */
tracking-tight:  -0.025em  /* Grote headers (optioneel) */
```

---

## Iconografie

### Icon Stijl

#### Lijn-gebaseerde Icons (Stroke)

**Kenmerken:**
- Outline style (niet filled)
- Consistent stroke width: **2px**
- Rounded caps en joins
- Minimalistische stijl

**Voordelen:**
- Modern en clean
- Werkt op elke achtergrond
- Smaller file size
- Consistenter te maken

**Library suggestie:**
- **Lucide Icons** (huidige keuze)
- **Heroicons**
- **Feather Icons**

#### Filled Icons (Solid)

**Gebruik alleen voor:**
- Active/selected states
- Icons in buttons (primary action)
- Belangrijke waarschuwingen
- Brand icon/logo

**Wanneer NIET:**
- Normale navigatie icons
- List item icons
- Decoratieve icons

### Icon Sizes

```css
size-4:  16px  /* Zeer klein - inline met text-sm */
size-5:  20px  /* Klein - inline met text-base */
size-6:  24px  /* Medium - DEFAULT voor UI icons */
size-8:  32px  /* Large - Belangrijke acties */
size-12: 48px  /* XL - Empty states, hero sections */
size-16: 64px  /* XXL - Grote empty states */
```

**Gebruik per context:**

**Navigatie sidebar:**
- `size-5` (20px) of `size-6` (24px)

**Buttons:**
- Small button: `size-4` (16px)
- Normal button: `size-5` (20px)
- Large button: `size-6` (24px)

**Empty states:**
- `size-12` (48px) tot `size-16` (64px)
- Of gebruik emoji's! 😊

**Inline met tekst:**
- `text-sm`: gebruik `size-4` (16px)
- `text-base`: gebruik `size-5` (20px)
- `text-lg`: gebruik `size-6` (24px)

### Icon Kleuren

**Do's ✅**

**Volg tekstkleur:**
```tsx
<UserIcon className="text-gray-600" size={20} />
// Icon krijgt zelfde kleur als tekst
```

**Status-gerelateerd:**
```tsx
<CheckIcon className="text-success-600" size={20} />
<AlertIcon className="text-warning-600" size={20} />
<XIcon className="text-error-600" size={20} />
```

**Interactive states:**
```tsx
<PlusIcon className="text-white" />  // In primary button
<TrashIcon className="text-error-600 hover:text-error-700" />
```

**Don'ts ❌**

```tsx
❌ <Icon className="text-pink-500" />  // Random kleur zonder betekenis
❌ <Icon style={{ color: '#ff00ff' }} />  // Inline color buiten palette
❌ <Icon className="text-purple-300" />  // Te laag contrast op wit
```

---

## Visuele Elementen

### Borders & Dividers

**Border Widths:**
```css
border:   1px  /* DEFAULT - Card borders, inputs */
border-2: 2px  /* Emphasis, focus rings */
border-4: 4px  /* Zeer prominent (zelden) */
```

**Border Colors:**
```css
border-gray-200  /* Subtiele dividers */
border-gray-300  /* Card borders */
border-primary-500  /* Focus rings, active states */
```

**Border Radius:**
```css
rounded-sm:   2px   /* Zeer subtiel */
rounded:      4px   /* Kleine elementen (badges) */
rounded-md:   6px   /* Inputs, small buttons */
rounded-lg:   8px   /* DEFAULT - Cards, buttons */
rounded-xl:   12px  /* Large cards, modals */
rounded-2xl:  16px  /* Hero sections (optioneel) */
rounded-full: 9999px /* Pills, avatars */
```

**Gebruik:**
- Buttons: `rounded-lg` (8px)
- Cards: `rounded-lg` of `rounded-xl`
- Inputs: `rounded-md` (6px)
- Badges: `rounded-full`
- Modals: `rounded-xl` (desktop), `rounded-none` (mobile fullscreen)

### Shadows

**Shadow Scale:**
```css
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)      /* Subtiel, hover states */
shadow:     0 1px 3px rgba(0,0,0,0.1)       /* Cards rust state */
shadow-md:  0 4px 6px rgba(0,0,0,0.1)       /* DEFAULT - Cards, dropdowns */
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)     /* Modals, popovers */
shadow-xl:  0 20px 25px rgba(0,0,0,0.1)     /* Floating elements */
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)    /* Zeer prominent (hero) */
```

**Gebruik per element:**

**Cards (rust):**
- `shadow` of `shadow-md`

**Cards (hover):**
- `shadow-lg`

**Dropdowns/Popovers:**
- `shadow-lg`

**Modals:**
- `shadow-xl`

**Floating Action Buttons:**
- `shadow-lg` hover: `shadow-xl`

**Mobile optimalisatie:**
```css
/* Lichtere shadows op mobile voor performance */
@media (max-width: 640px) {
  .shadow-xl {
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
}
```

### Spacing System

**Base unit: 4px**

```css
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px   /* DEFAULT gap */
6:   24px
8:   32px
12:  48px
16:  64px
20:  80px
24:  96px
```

**Gebruik:**

**Inline spacing (gap tussen icon en text):**
- `gap-2` (8px)

**Component internal padding:**
- Small: `p-3` (12px)
- Medium: `p-4` (16px)
- Large: `p-6` (24px)

**Spacing tussen elementen:**
- Tight: `gap-2` (8px)
- Normal: `gap-4` (16px)
- Loose: `gap-6` (24px)

**Spacing tussen sections:**
- `gap-8` (32px) of `gap-12` (48px)

---

## Fotografie & Illustraties

### Fotografie (Toekomstig)

**Stijl richtlijnen:**
- Real mensen in productie omgeving
- Lichte, natuurlijke belichting
- Focus op actie en "getting things done"
- Diverse workforce (inclusief)

**Vermijd:**
- Cheesy stock photos (thumbs up)
- Te geposeerd
- Irrelevante beelden
- Slechte kwaliteit

### Illustraties

#### Empty States Illustraties

**Stijl optie 1: Emoji's** (Makkelijk)
```
😊 Vriendelijk en universeel
🎯 Actie-gericht
📦 Context-specifiek
```

**Voordelen:**
- Geen design/development tijd
- Kleurrijk zonder ontwerp
- Universeel begrepen
- Altijd consistent

**Stijl optie 2: Custom Illustrations** (Advanced)
- Lijn-stijl (consistent met icons)
- Branded kleuren gebruiken
- Simpel en herkenbaar
- Niet te kinderlijk

**Resources:**
- unDraw (gratis, aanpasbare kleuren)
- Streamline Icons (inclusief illustraties)
- Custom maken in Figma

### Achtergrond Patterns (Optioneel)

**Subtiele patterns voor:**
- Hero sections
- Empty states backgrounds
- Login/onboarding schermen

**Voorbeelden:**
- Dot grid (zeer subtiel)
- Diagonal lines (licht)
- Gradient mesh

**Regel:**
- Altijd subtiel (5-10% opacity)
- Mag content NIET afleiden
- Accessibility behouden

---

## Do's en Don'ts

### Color Do's ✅

- ✅ Gebruik color palette consistent
- ✅ Check altijd contrast (WCAG AA)
- ✅ Status kleuren hebben betekenis
- ✅ Primary color voor hoofdacties
- ✅ Grijs voor neutrale elementen

### Color Don'ts ❌

- ❌ Random kleuren buiten palette
- ❌ Rood voor niet-errors
- ❌ Kleur als enige indicator
- ❌ Te veel kleuren tegelijk (max 3)
- ❌ Low contrast combinaties

### Typography Do's ✅

- ✅ Minimum 16px voor body text
- ✅ Consistent font weights gebruiken
- ✅ Line height 1.5 voor leesbaarheid
- ✅ Hierarchy duidelijk (size + weight)
- ✅ Voldoende witruimte

### Typography Don'ts ❌

- ❌ < 16px in formulieren (iOS zoom)
- ❌ ALL CAPS voor lange tekst
- ❌ Te veel font weights (max 3-4)
- ❌ Tiny text voor belangrijke info
- ❌ Slechte line height (< 1.3)

### Icon Do's ✅

- ✅ Consistent stroke width (2px)
- ✅ Passende size voor context
- ✅ Kleur volgt tekst of semantisch
- ✅ Touch-friendly sizes (min 20px)
- ✅ Accessible (ARIA labels)

### Icon Don'ts ❌

- ❌ Mix stroke en filled zonder reden
- ❌ Te klein (< 16px moeilijk zichtbaar)
- ❌ Random kleuren
- ❌ Icon zonder betekenis
- ❌ Teveel icons (visual noise)

---

## Implementatie

### Tailwind Config Aanpassingen

**Waar:** `tailwind.config.js`

**Wat toevoegen:**

```javascript
// BESCHRIJVING van configuratie (geen echte code)

module.exports = {
  theme: {
    extend: {
      colors: {
        // Definieer custom color palette
        primary: { /* blue tinten 50-900 */ },
        success: { /* green tinten */ },
        warning: { /* orange tinten */ },
        error: { /* red tinten */ },
        teal: { /* teal tinten */ },
        purple: { /* purple tinten */ },
      },
      fontFamily: {
        // Optioneel: custom font
        sans: ['Inter', 'system-ui', /* ... */],
      },
      fontSize: {
        // Optioneel: custom sizes
      },
      borderRadius: {
        // Optioneel: custom radius
      },
    },
  },
};
```

### CSS Variabelen (Optioneel)

**Voor dynamische themes (dark mode toekomstig):**

```css
/* BESCHRIJVING van CSS variabelen */

:root {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f97316;
  --color-error: #ef4444;
  /* etc */
}

/* Dark mode (toekomstig) */
[data-theme="dark"] {
  --color-primary: #60a5fa;
  /* lighter shades */
}
```

### Brand Guidelines Document

**Voor team members en stakeholders:**

1. Download color swatches
2. Export typography scale
3. Icon library links
4. Do's and Don'ts samenvatting
5. Voorbeeld componenten

**Formaat:** PDF of Figma file

---

## Gerelateerde Documentatie

- **[Visual Design Guide](./visual-design-guide.md)** - Algemene design principes
- **[Component Visual Patterns](./component-visual-patterns.md)** - Component styling
- **[Design Quick Wins](./design-quick-wins.md)** - Implementatie tips
- **[Mobile Optimization](./mobile-optimization.md)** - Responsive design

---

**Dit document definieert de visuele DNA van het Bedrijfsbeheer Dashboard. Gebruik het als leidraad voor alle design beslissingen! 🎨**
