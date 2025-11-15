# Component Visual Design Patterns

**Versie:** 1.0
**Laatst bijgewerkt:** November 2025
**Doel:** Gedetailleerde styling richtlijnen per component type

---

## 📋 Inhoudsopgave

1. [Cards](#cards)
2. [Buttons](#buttons)
3. [Badges & Tags](#badges--tags)
4. [Inputs & Forms](#inputs--forms)
5. [Modals & Overlays](#modals--overlays)
6. [Tables & Lists](#tables--lists)
7. [Charts & Data Visualization](#charts--data-visualization)
8. [Empty States](#empty-states)
9. [Loading States](#loading-states)
10. [Micro-Interactions](#micro-interactions)
11. [Transitions & Animations](#transitions--animations)

---

## Cards

### Basic Card (Huidig Design)

**Gebruik voor:**
- Dashboard KPI cards
- Module overzichten
- List items (producten, klanten)
- Container voor gerelateerde content

**Huidige Styling:**
```css
Beschrijving:
- Background: wit (bg-white)
- Border radius: 8px (rounded-lg)
- Shadow: medium (shadow-md)
- Padding: 24px (p-6)
- Hover: geen effect
```

**Waar gebruikt:**
- Dashboard: KPI cards (omzet, werkorders, etc.)
- Inventory: Product cards
- CRM: Klant cards
- Werkorders: Taak cards in kanban

### Enhanced Card (Verbetering Voorstel)

**Visuele Verbeteringen:**

**1. Subtle Gradient Background**
```css
Beschrijving:
- Van: white
- Naar: blue-50 (zeer subtiel)
- Richting: bottom-right (diagonal)
- Opacity: 50% gradient

Effect: Geeft diepte en moderniteit
Wanneer: Dashboard KPI cards, feature cards
Wanneer NIET: Elke card (te druk)
```

**2. Hover Lift Effect**
```css
Beschrijving:
Rust state:
- Shadow: shadow-md
- Transform: none

Hover state:
- Shadow: shadow-lg
- Transform: translateY(-4px)
- Transition: 200ms ease-out

Effect: Card "lift" bij hover, voelt interactief
```

**3. Border Accent (Optioneel)**
```css
Beschrijving:
- Border top: 4px solid primary-500
- Voor status cards of categorieën
- Kleur variëert op basis van status/categorie

Voorbeelden:
- Completed card: border-top green-500
- Pending card: border-top warning-500
- Error card: border-top error-500
```

### Glassmorphism Card (Speciaal)

**Wanneer gebruiken:**
- Overlays (boven afbeelding)
- Floating panels
- Modals met achtergrond content zichtbaar

**Styling:**
```css
Beschrijving:
- Background: white met opacity (bg-white/80)
- Backdrop blur: medium (backdrop-blur-md)
- Border: subtiel wit (border border-white/20)
- Shadow: groot voor depth (shadow-xl)

Effect: Moderne "doorkijk" effect
Browser support: Moderne browsers, fallback naar solid
```

**Vermijd:**
- Op body tekst (moeilijk leesbaar)
- Overal (te overweldigend)
- Zonder achtergrond (geen effect)

### Card Variants per Module

#### Dashboard KPI Cards
```css
Beschrijving:
- Groot aantal zichtbaar
- Gradient background (subtiel)
- Icon rechts boven (32px)
- Hover: lift effect
- Mobile: volle breedte
- Desktop: 4 kolommen grid
```

#### Werkorder Kanban Cards

**Compacte Weergave:**
```css
Beschrijving:
- Minimale padding (p-3)
- Geen shadow (shadow-sm)
- Hover: shadow-md + scale(1.02)
- Index nummer prominent (#3)
- Titel één regel (truncate)
```

**Uitgebreide Weergave:**
```css
Beschrijving:
- Normale padding (p-4)
- Medium shadow (shadow-md)
- Hover: shadow-lg + lift
- Alle details zichtbaar
- Status badge rechts boven
- Avatar medewerker onderaan
```

#### Product/Inventory Cards
```css
Beschrijving:
- Afbeelding bovenaan (indien beschikbaar)
- Product naam bold
- SKU ID en categorie badge
- Prijs prominent (text-lg font-bold)
- Stock status met kleur
- Hover: border accent (primary-500)
```

---

## Buttons

### Primary Button (Hoofdacties)

**Gebruik voor:**
- Belangrijkste actie op pagina
- Submit forms
- Create nieuwe items
- Voltooien van workflows

**Huidige Styling:**
```css
Beschrijving:
- Background: primary-600
- Text: white
- Padding: px-4 py-2
- Border radius: rounded-lg
- Hover: darker background (primary-700)
```

**Enhanced Styling:**
```css
Beschrijving:
Rust state:
- Background: primary-600
- Shadow: shadow-md
- Transform: scale(1)

Hover state:
- Background: primary-700
- Shadow: shadow-lg
- Transform: scale(1.05)
- Transition: all 200ms ease-out

Active/Pressed state:
- Background: primary-800
- Shadow: shadow-sm
- Transform: scale(0.98)
- Transition: all 100ms ease-in

Focus state (keyboard):
- Outline ring: ring-2 ring-primary-500
- Outline offset: 2px

Disabled state:
- Background: gray-300
- Text: gray-500
- Cursor: not-allowed
- Shadow: none
- Opacity: 0.6
```

### Gradient Button (Premium Look)

**Wanneer gebruiken:**
- Hero sections
- Marketing/landing pages (toekomstig)
- Zeer belangrijke primaire acties
- "Upgrade" of premium features

**Styling:**
```css
Beschrijving:
- Background: gradient from primary-600 to purple-600
- Richting: left to right
- Text: white
- Shadow: shadow-lg (colored shadow optioneel)

Hover:
- Gradient: lichter (primary-500 to purple-500)
- Of: hue rotate effect
- Scale: 1.05
- Shadow: shadow-xl

Effect: Aantrekkelijk, modern, premium gevoel
Vermijd: Overal (te veel van het goede)
```

### Secondary Button

**Gebruik voor:**
- Annuleren acties
- Alternatieve acties
- Less belangrijke keuzes

**Styling:**
```css
Beschrijving:
Rust:
- Background: white
- Border: border-2 border-gray-300
- Text: gray-700
- Shadow: shadow-sm

Hover:
- Background: gray-50
- Border: border-gray-400
- Shadow: shadow-md
- Transform: scale(1.02)

Active:
- Background: gray-100
- Transform: scale(0.98)
```

### Destructive Button (Danger)

**Gebruik voor:**
- Verwijderen
- Definitieve acties
- Waarschuwingen

**Styling:**
```css
Beschrijving:
- Background: error-600 (rood)
- Text: white
- Hover: error-700 + scale(1.05)
- Icon: trash of X icon (20px)

Belangrijke regel:
Altijd confirmation dialog tonen!
Nooit direct verwijderen zonder bevestiging.
```

### Icon Button

**Gebruik voor:**
- Compacte acties (edit, delete, view)
- Toolbar buttons
- Table row actions

**Styling:**
```css
Beschrijving:
- Min width/height: 44x44px (touch target)
- Padding: p-2 of p-3
- Border radius: rounded-lg of rounded-full
- Icon size: 20px (size-5)

Hover:
- Background: gray-100
- Transform: scale(1.1)

Active:
- Background: gray-200
- Transform: scale(0.95)

ARIA label verplicht!
```

### Button Sizes

**Small:**
```css
- Padding: px-3 py-1.5
- Text: text-sm
- Icon: 16px (size-4)
- Use: Compacte UI, inline acties
```

**Medium (Default):**
```css
- Padding: px-4 py-2
- Text: text-base
- Icon: 20px (size-5)
- Use: Standaard buttons
```

**Large:**
```css
- Padding: px-6 py-3
- Text: text-lg
- Icon: 24px (size-6)
- Use: Hero CTA's, belangrijke acties
```

### Button Loading State

**Styling:**
```css
Beschrijving:
- Disabled: true
- Opacity: 0.7
- Cursor: wait
- Text: "Laden..." of spinner icon
- Spinner: animate-spin naast tekst

User experience:
- Directe feedback dat actie bezig is
- Voorkomt dubbele clicks
- Duidelijk wanneer weer beschikbaar
```

---

## Badges & Tags

### Status Badges

**Gebruik voor:**
- Werkorder status (To Do, In Progress, Completed)
- Factuur status (Draft, Sent, Paid)
- Voorraad status (In Stock, Low Stock, Out of Stock)
- User status (Active, Inactive)

**Styling per Status:**

**Success/Completed:**
```css
Beschrijving:
- Background: success-100 (licht groen)
- Text: success-800 (donker groen)
- Border: none of border success-200
- Padding: px-2 py-1
- Border radius: rounded-full
- Font: text-xs font-medium
```

**Warning/Pending:**
```css
Beschrijving:
- Background: warning-100 (licht oranje)
- Text: warning-800 (donker oranje)
- Icon optioneel: clock icon (16px)
```

**Error/Critical:**
```css
Beschrijving:
- Background: error-100 (licht rood)
- Text: error-800 (donker rood)
- Icon optioneel: alert icon (16px)
```

**Info/Default:**
```css
Beschrijving:
- Background: primary-100 (licht blauw)
- Text: primary-800 (donker blauw)
```

**Neutral:**
```css
Beschrijving:
- Background: gray-100
- Text: gray-800
```

### Category Tags

**Gebruik voor:**
- Inventaris categorieën
- Product types
- Labels en filters
- Multi-select indicatoren

**Styling:**
```css
Beschrijving:
- Background: purple-100 (of andere accent kleur)
- Text: purple-800
- Padding: px-2 py-0.5
- Border radius: rounded
- Font: text-xs font-medium

Removable variant (met X):
- X button rechts (16x16px touch target)
- Hover op X: background darkens
- Click: verwijder tag
```

### Enhanced Badges (Verbetering)

**Gradient Badge:**
```css
Beschrijving:
- Background: gradient (bijv. blue to purple)
- Text: white
- Shadow: optioneel colored shadow

Wanneer: Premium features, nieuwe items, highlights
```

**Pulsing Badge (Urgent):**
```css
Beschrijving:
- Animation: pulse (scale 1 to 1.05)
- Duration: 2s infinite
- Background: warning of error kleur

Wanneer: Kritieke waarschuwingen, nieuwe notificaties
Vermijd: Overal (afleidend)
```

**Badge met Icon:**
```css
Beschrijving:
- Icon links (14px)
- Text rechts
- Gap: 4px (gap-1)

Voorbeelden:
- Clock icon + "In Wacht"
- Check icon + "Voltooid"
- Alert icon + "Kritiek"
```

---

## Inputs & Forms

### Text Input

**Basic Styling:**
```css
Beschrijving:
Rust state:
- Border: border border-gray-300
- Background: white
- Padding: px-4 py-2 (of py-3 voor mobile)
- Border radius: rounded-md
- Font size: 16px (BELANGRIJK voor iOS!)
- Text: text-gray-900

Placeholder:
- Text: text-gray-400
- Italic: optioneel

Focus state:
- Border: border-primary-500 (2px)
- Ring: ring-2 ring-primary-500/20
- Outline: none (replaced by ring)

Error state:
- Border: border-error-500
- Ring: ring-2 ring-error-500/20
- Background: error-50 (zeer subtiel)
```

**Enhanced Input:**
```css
Beschrijving:
Icon support:
- Icon links of rechts in input (20px)
- Padding aangepast (pl-10 of pr-10)
- Icon kleur: text-gray-400

Loading state:
- Spinner rechts in input
- Opacity: 0.7
- Cursor: wait

Success state (na validation):
- Border: border-success-500
- Checkmark icon rechts
- Transition: smooth (200ms)
```

### Select Dropdown

**Native Select (Mobile):**
```css
Beschrijving:
- Gebruik native <select> op mobile
- Betere UX (OS keyboard)
- Styling: zelfde als text input
- Arrow icon: rechts

Mobile detection:
Toon native select op < 768px
```

**Custom Select (Desktop):**
```css
Beschrijving:
- Dropdown trigger: styled button
- Icon: chevron down (20px)
- Dropdown menu: absolute positioned
- Background: white
- Border: border rounded-lg
- Shadow: shadow-lg
- Max height: max-h-60 (scroll bij veel items)

Dropdown items:
- Padding: px-4 py-3
- Hover: bg-gray-100
- Active: bg-primary-100
- Selected: checkmark icon rechts
- Min height: 44px (touch)
```

### Checkbox & Radio

**Checkbox Styling:**
```css
Beschrijving:
Unchecked:
- Border: border-2 border-gray-300
- Background: white
- Size: w-5 h-5 (20px)
- Border radius: rounded

Checked:
- Background: primary-600
- Border: border-primary-600
- Checkmark: white icon (14px)
- Transition: all 200ms

Hover (unchecked):
- Border: border-gray-400
- Background: gray-50

Disabled:
- Background: gray-100
- Border: border-gray-200
- Opacity: 0.6
- Cursor: not-allowed
```

**Radio Styling:**
```css
Beschrijving:
Unchecked:
- Border: border-2 border-gray-300
- Border radius: rounded-full
- Size: w-5 h-5

Checked:
- Border: border-primary-600
- Inner dot: bg-primary-600 (12px)
- Centered dot

Styling verder zelfde als checkbox
```

### Form Layout

**Stacked (Mobile-First):**
```css
Beschrijving:
- Fields: flex flex-col gap-4
- Label boven input
- Full width inputs
- Submit button: full width op mobile

Responsive:
- sm: 2 kolommen waar logisch (bijv. naam splits)
- md: side-by-side labels (optioneel)
```

**Inline Labels (Desktop):**
```css
Beschrijving:
- Label: w-1/4 (25% width)
- Input: w-3/4 (75% width)
- Alignment: items-center

Wanneer: Admin forms, settings
Wanneer NIET: Mobile, korte forms
```

### Validation Feedback

**Error Message:**
```css
Beschrijving:
- Text: text-error-600
- Font: text-sm
- Icon: alert icon (16px) links
- Margin top: mt-1
- Animation: shake (bij tonen)

Voorbeeld tekst:
"Dit veld is verplicht"
"Ongeldig email adres"
"Wachtwoord te kort (min 8 tekens)"
```

**Success Message:**
```css
Beschrijving:
- Text: text-success-600
- Icon: checkmark (16px)

Voorbeeld tekst:
"Email beschikbaar"
"Wachtwoord sterk genoeg"
```

**Helper Text (Neutral):**
```css
Beschrijving:
- Text: text-gray-600
- Font: text-sm
- Margin top: mt-1

Voorbeeld tekst:
"Minimaal 8 tekens"
"Voorbeeld: gebruiker@bedrijf.nl"
```

---

## Modals & Overlays

### Standard Modal

**Overlay:**
```css
Beschrijving:
- Position: fixed inset-0
- Background: black/50 (50% opacity)
- Z-index: z-40
- Backdrop blur: optioneel (backdrop-blur-sm)
- Click: closes modal

Animation:
- Fade in: 200ms
- Fade out: 150ms
```

**Modal Container:**
```css
Beschrijving:
Desktop (lg):
- Position: centered (top-1/2 left-1/2 transform)
- Max width: max-w-lg (32rem) of max-w-2xl
- Max height: max-h-[90vh]
- Background: white
- Border radius: rounded-xl
- Shadow: shadow-2xl
- Z-index: z-50

Mobile (< lg):
- Position: fixed inset-0
- Full screen: w-full h-full
- Border radius: rounded-none
- Padding: p-4

Animation:
- Desktop: scale in (0.95 to 1)
- Mobile: slide up from bottom
- Duration: 300ms ease-out
```

**Modal Header:**
```css
Beschrijving:
- Padding: p-6 pb-4
- Border bottom: border-b border-gray-200
- Title: text-xl font-semibold
- Close button: absolute top-4 right-4

Close button:
- Size: 40x40px (44x44 touch target)
- Icon: X (20px)
- Hover: bg-gray-100 rounded-full
```

**Modal Body:**
```css
Beschrijving:
- Padding: p-6
- Overflow: overflow-y-auto
- Max height: max-h-[60vh]
```

**Modal Footer:**
```css
Beschrijving:
- Padding: p-6 pt-4
- Border top: border-t border-gray-200
- Flex: flex justify-end gap-3
- Buttons: secondary (Annuleren) + primary (Opslaan)

Mobile:
- Buttons: full width stacked
```

### Glassmorphism Modal (Enhanced)

**Styling:**
```css
Beschrijving:
- Background: white/80 (semi-transparent)
- Backdrop blur: backdrop-blur-md
- Border: border border-white/20
- Shadow: shadow-2xl

Overlay:
- Backdrop blur: backdrop-blur-sm
- Darkening: black/40 (minder donker)

Effect: Modern, elegant, content achter blijft subtiel zichtbaar
Wanneer: Overlay boven content, niet voor data-heavy modals
```

### Toast Notifications

**Position:**
```css
Beschrijving:
Desktop:
- Top-right: top-4 right-4
- Of top-center: top-4 left-1/2 transform

Mobile:
- Top-center: top-4 left-4 right-4 (full width met margin)
- Of bottom: bottom-4 (bij mobile keyboards)
```

**Toast Styling:**
```css
Beschrijving:
Success:
- Background: white
- Border left: border-l-4 border-success-500
- Shadow: shadow-lg
- Icon: checkmark (20px) groen
- Padding: p-4
- Border radius: rounded-lg

Error:
- Border left: border-error-500
- Icon: X circle (20px) rood

Warning:
- Border left: border-warning-500
- Icon: alert (20px) oranje

Info:
- Border left: border-primary-500
- Icon: info (20px) blauw

Auto-dismiss:
- Progress bar onderaan (optional)
- Duration: 5 seconden
- Pause on hover

Close button:
- Icon button rechts boven (40x40px)
```

**Animation:**
```css
Beschrijving:
Enter:
- Slide in from right (desktop)
- Slide in from top (mobile)
- Duration: 300ms ease-out

Exit:
- Slide out to right
- Fade out
- Duration: 200ms ease-in

Stack:
- Multiple toasts: stack met gap-2
- Max: 3 zichtbaar tegelijk
- Oudste verdwijnt eerst
```

---

## Tables & Lists

### Desktop Table

**Table Container:**
```css
Beschrijving:
- Overflow: overflow-x-auto (horizontal scroll)
- Border: border rounded-lg
- Background: white
- Shadow: shadow-sm
```

**Table Header:**
```css
Beschrijving:
- Background: gray-50
- Border bottom: border-b border-gray-200
- Padding: px-4 py-3
- Text: text-xs font-medium uppercase text-gray-500
- Letter spacing: tracking-wide

Sortable columns:
- Cursor: cursor-pointer
- Hover: bg-gray-100
- Icon: chevron up/down (16px) rechts
```

**Table Row:**
```css
Beschrijving:
Rust:
- Background: white
- Border bottom: border-b border-gray-200

Hover:
- Background: gray-50
- Transition: 150ms

Selected:
- Background: primary-50
- Border left: border-l-4 border-primary-500

Zebra striping (optional):
- Even rows: bg-gray-50
- Odd rows: white
```

**Table Cell:**
```css
Beschrijving:
- Padding: px-4 py-3
- Text: text-sm text-gray-900
- Vertical align: align-middle

First cell:
- Font: font-medium (primary info)

Actions cell:
- Text align: right
- Buttons: icon buttons (edit, delete)
- Gap: gap-2
```

### Mobile Card List

**Wanneer gebruiken:**
- Tabellen met veel kolommen op mobile
- < 768px breakpoint
- Betere leesbaarheid dan horizontale scroll

**Card Styling:**
```css
Beschrijving:
- Background: white
- Border: border rounded-lg
- Shadow: shadow-sm
- Padding: p-4
- Margin bottom: mb-3

Hover (mobile):
- Shadow: shadow-md
- Active feedback: bg-gray-50

Layout:
- Stack: flex flex-col gap-2
- Primary info: font-semibold text-base
- Secondary info: text-sm text-gray-600
- Actions: flex justify-end gap-2 mt-3
```

**Example Mobile Card:**
```
Card structure:
├── Naam (bold, large)
├── Email (small, gray)
├── Telefoon (small, gray)
├── Status badge
└── Actions (edit, delete buttons)
```

### List Items (Clickable)

**Styling:**
```css
Beschrijving:
- Padding: p-4
- Border bottom: border-b
- Cursor: pointer

Hover:
- Background: gray-50
- Chevron right: visible

Active:
- Background: gray-100

Selected:
- Background: primary-50
- Border left: border-l-4 border-primary-500
```

---

## Charts & Data Visualization

### Chart Color Palette

**Gebruik brand kleuren:**
```
Series 1: primary-500 (blue)
Series 2: teal-500
Series 3: purple-500
Series 4: warning-500 (orange)
Series 5: success-500 (green)
Series 6: gray-500
```

**Vermijd:**
- Random kleuren buiten brand palette
- Te veel series (> 6 wordt chaotisch)
- Rood tenzij voor negatieve data

### KPI Cards Enhanced

**Styling:**
```css
Beschrijving:
Layout:
- Gradient background (white to primary-50)
- Icon rechts boven (32px, primary-600)
- Label: text-sm text-gray-600
- Value: text-3xl font-bold text-gray-900
- Change indicator: text-sm met ▲ of ▼

Change indicator:
Positive:
- Text: text-success-600
- Icon: ▲ (arrow up)

Negative:
- Text: text-error-600
- Icon: ▼ (arrow down)

Neutral:
- Text: text-gray-600
- Icon: ▬ (dash)
```

**Sparkline (Optional):**
```css
Beschrijving:
- Mini chart onderaan card
- Hoogte: 40px
- Lijn kleur: primary-500
- Geen axes of labels (alleen trend)
```

### Chart Container

**Styling:**
```css
Beschrijving:
- Background: white
- Border: border rounded-lg
- Shadow: shadow-sm
- Padding: p-6

Header:
- Title: text-lg font-semibold
- Subtitle: text-sm text-gray-600
- Actions: rechts (export, filter)

Chart area:
- Height: h-64 sm:h-80 lg:h-96 (responsive)
- Padding: p-4
```

**Tooltips:**
```css
Beschrijving:
- Background: gray-900
- Text: white text-sm
- Padding: px-3 py-2
- Border radius: rounded
- Shadow: shadow-lg
- Arrow: pointing to data point
```

---

## Empty States

### Basic Empty State (Current)

```css
Beschrijving:
- Text: "Geen items"
- Centered: text-center
- Padding: py-12
```

**Probleem:** Saai, niet helpend, niet uitnodigend

### Enhanced Empty State (Verbetering)

**Structure:**
```
Empty state bevat:
├── Visual (emoji of illustratie, 48-64px)
├── Heading (text-lg font-semibold)
├── Description (text-sm text-gray-600)
├── CTA button (primary button)
└── Help link (optional, secondary link)
```

**Styling:**
```css
Beschrijving:
Container:
- Padding: py-16 px-4
- Text align: center
- Max width: max-w-md mx-auto

Visual:
- Size: 64px (emoji of icon)
- Margin bottom: mb-4
- Color: primary-600 (icon) of emoji

Heading:
- Font: text-xl font-semibold
- Color: gray-900
- Margin bottom: mb-2

Description:
- Font: text-sm sm:text-base
- Color: gray-600
- Line height: leading-relaxed
- Margin bottom: mb-6

CTA:
- Primary button styling
- Width: w-auto (niet full width)
- Centered: mx-auto

Help link:
- Text: text-sm text-primary-600
- Hover: underline
- Margin top: mt-3
```

### Empty State per Context

**Geen Werkorders:**
```
Visual: 🎯 of checklist icon
Heading: "Alles klaar voor vandaag!"
Text: "Je hebt geen openstaande werkorders. Goed bezig! 🎉"
CTA (admin): "Nieuwe taak aanmaken"
CTA (user): "Bekijk voltooide taken"
```

**Geen Voorraad:**
```
Visual: 📦 of lege doos illustratie
Heading: "Tijd om je voorraad op te bouwen"
Text: "Voeg je eerste product toe om met voorraad beheer te beginnen"
CTA: "Eerste product toevoegen"
Help: "Hoe werkt voorraad beheer?"
```

**Zoekresultaten Niet Gevonden:**
```
Visual: 🔍 of search icon
Heading: "Geen resultaten gevonden"
Text: "Probeer andere zoektermen of pas je filters aan"
CTA: "Filters wissen"
```

**Geen Klanten:**
```
Visual: 👥 of mensen illustratie
Heading: "Groei je klantenbestand"
Text: "Begin met het toevoegen van je eerste klant om relaties bij te houden"
CTA: "Eerste klant toevoegen"
```

**Permissions (Geen Toegang):**
```
Visual: 🔒 of lock icon
Heading: "Geen toegang"
Text: "Je hebt geen rechten om deze module te bekijken. Neem contact op met je manager."
CTA: "Terug naar dashboard"
```

### Tone of Voice

**Do's ✅**
- Positief en bemoedigend
- Helpend en uitnodigend
- Duidelijk wat gebruiker kan doen
- Menselijk en vriendelijk

**Don'ts ❌**
- Beschuldigend ("Je hebt niks gedaan!")
- Technisch ("No records found in database")
- Negatief ("Er is niets")
- Grappig-proberen maar niet grappig

---

## Loading States

### Spinners

**Small Spinner (Inline):**
```css
Beschrijving:
- Size: w-4 h-4 (16px)
- Border: border-2
- Border color: border-gray-300
- Border top: border-t-primary-600
- Border radius: rounded-full
- Animation: animate-spin

Wanneer: Inline met tekst, kleine buttons
```

**Medium Spinner (Default):**
```css
Beschrijving:
- Size: w-8 h-8 (32px)
- Border: border-4
- Zelfde styling als small

Wanneer: Loading in modals, cards
```

**Large Spinner (Page Level):**
```css
Beschrijving:
- Size: w-12 h-12 (48px)
- Centered: absolute top-1/2 left-1/2 transform
- Background overlay: optional gray-50

Wanneer: Hele pagina laadt, belangrijke operations
```

### Skeleton Loaders

**Wanneer gebruiken:**
- Betere UX dan spinners voor content
- Geeft vorm van komende content
- Lijsten, cards, tabellen

**Card Skeleton:**
```css
Beschrijving:
- Background: gray-200
- Border radius: zelfde als finale card
- Animation: pulse (fade in/out)
- Duration: 2s infinite

Structure:
├── Avatar circle (w-12 h-12 rounded-full)
├── Title bar (h-4 w-3/4 rounded)
├── Subtitle bar (h-3 w-1/2 rounded)
└── Body lines (3x h-3 w-full rounded, gap-2)
```

**Table Skeleton:**
```css
Beschrijving:
- Rows: 5-10 skeleton rows
- Cells: gray-200 rounded bars
- Animation: pulse
- Heights: variërend (4-6px) voor realism
```

### Progress Indicators

**Linear Progress Bar:**
```css
Beschrijving:
Container:
- Background: gray-200
- Height: h-2
- Border radius: rounded-full
- Width: full

Progress:
- Background: primary-600
- Height: h-2
- Border radius: rounded-full
- Width: dynamic (0-100%)
- Transition: width 300ms

Indeterminate (unknown progress):
- Animation: slide left to right
- Duration: 1.5s infinite
```

**Circular Progress:**
```css
Beschrijving:
- SVG circle
- Stroke: primary-600
- Stroke width: 4
- Size: 48px
- Animation: stroke-dashoffset
- Percentage: text center (optional)
```

**Step Indicator (Wizard):**
```css
Beschrijving:
Steps:
Completed:
- Circle: bg-primary-600 (checkmark white)
- Line: bg-primary-600

Current:
- Circle: border-2 border-primary-600 (number inside)
- Line: bg-gray-300

Upcoming:
- Circle: border-2 border-gray-300 (number gray)
- Line: bg-gray-300
```

---

## Micro-Interactions

### Hover Effects

**Scale Up (Lift):**
```css
Beschrijving:
- Transform: scale(1.05)
- Transition: 200ms ease-out
- Cursor: pointer

Wanneer: Cards, buttons, clickable items
```

**Shadow Enhancement:**
```css
Beschrijving:
Rust: shadow-md
Hover: shadow-lg
Transition: 200ms

Wanneer: Cards, modals, floating elements
```

**Color Transitions:**
```css
Beschrijving:
- Background color shift
- Border color shift
- Text color shift
- Transition: 150-200ms

Wanneer: Buttons, links, interactive elements
```

**Underline Grow:**
```css
Beschrijving:
Rust:
- Border bottom: 2px transparent

Hover:
- Border bottom: 2px primary-500
- Transition: 200ms

Wanneer: Links in text, nav items
```

### Click/Tap Feedback

**Scale Down (Press):**
```css
Beschrijving:
Active:
- Transform: scale(0.95) of scale(0.98)
- Transition: 100ms ease-in

Effect: Fysieke "druk" gevoel

Wanneer: Buttons, cards, clickable items
```

**Ripple Effect (Material Design Style):**
```css
Beschrijving:
- Radial gradient circle
- Start: click position
- Expand: 0 to 100% size
- Fade out tijdens expand
- Duration: 600ms

Implementatie: Vereist JavaScript
Wanneer: Buttons (optional enhancement)
```

**Color Flash:**
```css
Beschrijving:
Active:
- Background: primary-700 (donkerder)
- Duration: 100ms
- Transition back: 200ms

Wanneer: Buttons, toggle switches
```

### Success Animations

**Checkmark Draw:**
```css
Beschrijving:
- SVG checkmark
- Stroke dasharray animation
- Duration: 400ms
- Easing: ease-in-out

Wanneer: Form success, task completed
```

**Confetti (Big Wins):**
```css
Beschrijving:
- Animated colored shapes
- Falling from top
- Duration: 3s
- Quantity: 50-100 pieces

Wanneer: Grote successen (order voltooid, milestone)
Vermijd: Kleine successen (te overweldigend)
```

**Bounce:**
```css
Beschrijving:
- Scale: 1 → 1.1 → 0.9 → 1
- Duration: 400ms
- Easing: cubic-bezier

Wanneer: Items added to cart, favorites
```

**Color Pulse:**
```css
Beschrijving:
- Background: success-500
- Opacity: 1 → 0.7 → 1
- Duration: 800ms

Wanneer: Updated items, notifications
```

### Error Feedback

**Shake Animation:**
```css
Beschrijving:
- Transform: translateX
- Keyframes: 0 → -10px → 10px → -10px → 0
- Duration: 400ms

Wanneer: Form validation error, incorrect input
```

**Red Flash:**
```css
Beschrijving:
- Border color: error-500
- Background: error-50
- Duration: 200ms
- Flash 2x

Wanneer: Validation errors
```

**Error Icon Appear:**
```css
Beschrijving:
- Icon: alert circle
- Animation: scale in (0 → 1)
- Duration: 200ms
- Bounce: optional

Wanneer: Form errors, alerts
```

---

## Transitions & Animations

### Page Transitions

**Fade In/Out:**
```css
Beschrijving:
Enter:
- Opacity: 0 → 1
- Duration: 200ms

Exit:
- Opacity: 1 → 0
- Duration: 150ms

Wanneer: Page changes, content swaps
```

**Slide Transitions:**
```css
Beschrijving:
Enter from right:
- Transform: translateX(100%) → translateX(0)
- Duration: 300ms
- Easing: ease-out

Exit to left:
- Transform: translateX(0) → translateX(-100%)
- Duration: 250ms

Wanneer: Multi-step flows, mobile navigation
```

### Element Animations

**Stagger (List Items):**
```css
Beschrijving:
- Items verschijnen één voor één
- Delay: 50ms per item
- Animation: fade in + slide up
- Max items: 10 (daarna instant)

Wanneer: Lists loading, search results
```

**Parallax (Subtle):**
```css
Beschrijving:
- Background moves slower dan foreground
- Scroll ratio: 0.5x
- Only op desktop (performance)

Wanneer: Hero sections, decoratieve backgrounds
Vermijd: Mobile (performance), main content
```

**Scroll-Triggered:**
```css
Beschrijving:
- Elements fade/slide in bij scroll
- Trigger: element enters viewport
- Animation: once (niet bij terug scrollen)

Wanneer: Landing pages, marketing sections
Vermijd: Admin UI, data-heavy pages
```

### Animation Guidelines

**Performance:**
```
✅ Animeer: transform, opacity
❌ Vermijd: width, height, top, left, margin
Waarom: GPU vs CPU (transform sneller)
```

**Duration:**
```
Zeer snel: 100-150ms (feedback)
Snel:      150-250ms (buttons, hovers)
Normaal:   250-400ms (modals, transitions)
Langzaam:  400-600ms (big reveals)

Nooit > 600ms (voelt traag)
```

**Easing:**
```
ease-out:    Start snel, eind langzaam (enter animations)
ease-in:     Start langzaam, eind snel (exit animations)
ease-in-out: S-curve (smooth transitions)
linear:      Constant (spinners, progress bars)
```

**Reduced Motion:**
```css
/* ALTIJD respecteren! */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Gerelateerde Documentatie

- **[Visual Design Guide](./visual-design-guide.md)** - Design filosofie
- **[Brand Identity](./brand-identity.md)** - Kleuren en typography
- **[Design Quick Wins](./design-quick-wins.md)** - Implementatie tips
- **[Mobile Optimization](./mobile-optimization.md)** - Responsive patterns

---

**Dit document bevat alle visuele patterns voor consistente, mooie components! 🎨✨**

*Bij twijfel over styling: check dit document eerst!*
