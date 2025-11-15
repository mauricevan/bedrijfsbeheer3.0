# Design Implementatie Checklist

**Versie:** 1.0
**Laatst bijgewerkt:** November 2025
**Doel:** Checklist voor consistente, mooie component implementatie

---

## 📋 Inhoudsopgave

1. [Voor Elke Nieuwe Component](#voor-elke-nieuwe-component)
2. [Voor Design Updates](#voor-design-updates-aan-bestaande-components)
3. [Module-Specifieke Checklists](#module-specifieke-checklists)
4. [Quarterly Design Review](#quarterly-design-review)
5. [Design Debt Tracking](#design-debt-tracking)

---

## Voor Elke Nieuwe Component

### Planning Fase

**Voor je begint met coderen:**

- [ ] **Bekijk design documentatie**
  - [ ] Lees [Visual Design Guide](./visual-design-guide.md) voor filosofie
  - [ ] Check [Brand Identity](./brand-identity.md) voor kleuren/typography
  - [ ] Review [Component Visual Patterns](./component-visual-patterns.md) voor stijl
  - [ ] Zoek vergelijkbare bestaande componenten als referentie

- [ ] **Bedenk alle states**
  - [ ] Normal/rust state
  - [ ] Hover state
  - [ ] Active/pressed state
  - [ ] Focus state (keyboard navigation)
  - [ ] Disabled state
  - [ ] Loading state
  - [ ] Error state
  - [ ] Success state
  - [ ] Empty state

- [ ] **Schets layout**
  - [ ] Mobile layout (< 640px)
  - [ ] Tablet layout (640-1024px)
  - [ ] Desktop layout (> 1024px)
  - [ ] Edge cases (lange tekst, veel items, weinig items)

### Design Tokens

**Gebruik consistente styling:**

- [ ] **Kleuren uit brand palette**
  - [ ] Primary: `primary-500`, `primary-600`, `primary-700`
  - [ ] Success: `success-500` voor positieve feedback
  - [ ] Warning: `warning-500` voor aandacht
  - [ ] Error: `error-500` voor fouten
  - [ ] Gray: `gray-50` tot `gray-900` voor neutrals
  - [ ] GEEN custom hex colors buiten palette

- [ ] **Typography scale**
  - [ ] Headers: `text-xl` tot `text-4xl`
  - [ ] Body: `text-base` (16px - belangrijk voor mobile!)
  - [ ] Small: `text-sm` (14px)
  - [ ] Tiny: `text-xs` (12px)
  - [ ] Weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

- [ ] **Spacing consistentie**
  - [ ] Padding: `p-3`, `p-4`, `p-6` (12px, 16px, 24px)
  - [ ] Gap: `gap-2`, `gap-4`, `gap-6` (8px, 16px, 24px)
  - [ ] Margin: gebruik spacing scale (4px increments)

- [ ] **Border radius**
  - [ ] Buttons/inputs: `rounded-md` of `rounded-lg`
  - [ ] Cards: `rounded-lg` of `rounded-xl`
  - [ ] Badges: `rounded` of `rounded-full`

- [ ] **Shadows**
  - [ ] Cards rust: `shadow` of `shadow-md`
  - [ ] Cards hover: `shadow-lg`
  - [ ] Modals: `shadow-xl` of `shadow-2xl`
  - [ ] Dropdowns: `shadow-lg`

### Interactiviteit

**Zorg voor goede feedback:**

- [ ] **Hover state gedefinieerd**
  - [ ] Buttons: `hover:bg-{color}-700`, `hover:scale-105`
  - [ ] Cards: `hover:shadow-lg`, `hover:-translate-y-1`
  - [ ] Links: `hover:underline` of `hover:text-{color}-600`
  - [ ] Icons: `hover:scale-110`

- [ ] **Active/pressed state**
  - [ ] Buttons: `active:scale-95`, `active:bg-{color}-800`
  - [ ] Cards: `active:bg-gray-50`
  - [ ] Checkboxes/radios: smooth transition naar checked

- [ ] **Focus state (keyboard navigation)**
  - [ ] Focus ring: `focus:ring-2 focus:ring-primary-500`
  - [ ] Focus offset: `focus:ring-offset-2`
  - [ ] Outline: `focus:outline-none` (vervangen door ring)
  - [ ] Zichtbaar zonder hover

- [ ] **Disabled state**
  - [ ] Opacity: `opacity-60` of `opacity-50`
  - [ ] Cursor: `cursor-not-allowed`
  - [ ] Colors: gray palette
  - [ ] Tooltip met reden (optioneel)

- [ ] **Loading state**
  - [ ] Spinner of skeleton loader
  - [ ] Disabled tijdens loading
  - [ ] Loading text of icon
  - [ ] `cursor-wait`

### Responsiveness

**Mobile-first approach:**

- [ ] **Mobile layout (< 640px)**
  - [ ] Full width components waar logisch
  - [ ] Stack: `flex-col` voor forms
  - [ ] Touch targets min 44x44px
  - [ ] Font size min 16px in inputs (iOS!)
  - [ ] Spacing aangepast (meer padding)

- [ ] **Tablet layout (640-1024px)**
  - [ ] Grid: `sm:grid-cols-2` waar passend
  - [ ] Sidebar: conditionally shown
  - [ ] Spacing: medium (`sm:p-6`)

- [ ] **Desktop layout (> 1024px)**
  - [ ] Grid: `lg:grid-cols-3` of `lg:grid-cols-4`
  - [ ] Sidebar: always visible
  - [ ] Max widths: `max-w-7xl` voor containers
  - [ ] Spacing: ruim (`lg:p-8`)

- [ ] **Touch targets (mobile)**
  - [ ] Buttons: `min-h-[44px]`, `min-w-[44px]`
  - [ ] Links: `py-3` voor voldoende height
  - [ ] Icon buttons: `p-2` of `p-3` voor 44px+
  - [ ] Checkboxes: `w-5 h-5` (20px) met padding label

- [ ] **Text readability**
  - [ ] Line height: `leading-normal` (1.5) of `leading-relaxed` (1.625)
  - [ ] Paragraph max width: `max-w-prose` (65ch)
  - [ ] Responsive font sizes: `text-sm sm:text-base`

### Accessibility

**WCAG AA compliance:**

- [ ] **Kleur contrast**
  - [ ] Normal text: minimum 4.5:1 ratio
  - [ ] Large text (18px+): minimum 3:1 ratio
  - [ ] UI components: minimum 3:1 ratio
  - [ ] Check met WebAIM Contrast Checker

- [ ] **Focus indicators**
  - [ ] Altijd zichtbaar bij keyboard navigation
  - [ ] `focus:ring-2` met primary color
  - [ ] Nooit `outline: none` zonder ring replacement

- [ ] **ARIA labels**
  - [ ] Icon buttons: `aria-label="Beschrijving"`
  - [ ] Form inputs: `aria-label` of `<label>` element
  - [ ] Error states: `aria-invalid="true"`, `aria-describedby`
  - [ ] Loading states: `aria-busy="true"`

- [ ] **Keyboard navigeerbaar**
  - [ ] Tab order logisch
  - [ ] Enter submit forms
  - [ ] Escape sluit modals
  - [ ] Arrow keys in lists (optioneel)

- [ ] **Screen reader friendly**
  - [ ] Alt text op images
  - [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
  - [ ] Hidden decorative content: `aria-hidden="true"`
  - [ ] Status messages: `role="status"` of `role="alert"`

### Performance

**Optimalisaties:**

- [ ] **Animaties GPU-accelerated**
  - [ ] Gebruik: `transform`, `opacity`
  - [ ] Vermijd: `width`, `height`, `top`, `left`, `margin`
  - [ ] Waarom: GPU vs CPU performance

- [ ] **Reduced motion support**
  - [ ] Check in `index.css`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```

- [ ] **Lazy loading**
  - [ ] Images: `loading="lazy"`
  - [ ] Heavy components: `React.lazy()`
  - [ ] Below fold content: lazy load

- [ ] **Geen layout shifts**
  - [ ] Reserveer ruimte voor dynamische content
  - [ ] Skeleton loaders in plaats van spinners
  - [ ] `min-h-[...]` voor containers

### Testing

**Test voordat je commit:**

- [ ] **Getest op iPhone**
  - [ ] Safari mobile
  - [ ] Portrait en landscape
  - [ ] Touch interactions werken

- [ ] **Getest op Android**
  - [ ] Chrome mobile
  - [ ] Portrait en landscape
  - [ ] Touch interactions werken

- [ ] **Getest op desktop**
  - [ ] Chrome
  - [ ] Firefox (optioneel)
  - [ ] Safari (optioneel)
  - [ ] Different screen sizes (DevTools)

- [ ] **Getest met keyboard only**
  - [ ] Tab door alle focusable elementen
  - [ ] Focus indicators zichtbaar
  - [ ] Enter/Space activeren buttons
  - [ ] Escape sluit modals

- [ ] **Getest met screen reader**
  - [ ] VoiceOver (Mac/iOS) of NVDA (Windows)
  - [ ] Alle content wordt voorgelezen
  - [ ] Button labels duidelijk
  - [ ] Form errors worden aangekondigd

---

## Voor Design Updates aan Bestaande Components

### Inventory Check

**Voor je begint:**

- [ ] **Screenshot oude design**
  - [ ] Maak screenshots van huidige state
  - [ ] Voor/na vergelijking later

- [ ] **Lijst breaking changes**
  - [ ] Welke props veranderen?
  - [ ] Welke classes worden vervangen?
  - [ ] Impact op parent components?

- [ ] **Impact assessment**
  - [ ] Hoeveel componenten worden geraakt?
  - [ ] Hoeveel modules gebruiken dit?
  - [ ] Kunnen we gefaseerd updaten?

### Implementation

**Volgorde van updates:**

- [ ] **Update design tokens eerst**
  - [ ] Tailwind config (indien nodig)
  - [ ] CSS variabelen (indien gebruikt)
  - [ ] Rebuild: `npm run build`

- [ ] **Test op één component**
  - [ ] Implementeer op pilot component
  - [ ] Test alle states
  - [ ] Feedback van team

- [ ] **Roll out naar vergelijkbare componenten**
  - [ ] Zoek alle instances (grep/search)
  - [ ] Update systematisch
  - [ ] Test na elke update

- [ ] **Update documentatie**
  - [ ] Component docs in code (comments)
  - [ ] Storybook (indien gebruikt)
  - [ ] Design system docs

### Validation

**Quality assurance:**

- [ ] **User testing met admin**
  - [ ] 5-10 minuten walkthrough
  - [ ] "Ziet het er goed uit?"
  - [ ] "Is alles duidelijk?"
  - [ ] Feedback notities

- [ ] **User testing met medewerker**
  - [ ] Zelfde vragen
  - [ ] Focus op dagelijks gebruik
  - [ ] Performance op eigen device

- [ ] **Performance benchmark**
  - [ ] Lighthouse score (voor/na)
  - [ ] Bundle size impact
  - [ ] Animation FPS (Chrome DevTools)
  - [ ] Page load times

- [ ] **Accessibility audit**
  - [ ] Lighthouse accessibility score
  - [ ] Keyboard navigation test
  - [ ] Screen reader test
  - [ ] Contrast checker

---

## Module-Specifieke Checklists

### Dashboard Module

- [ ] **KPI cards visueel aantrekkelijk**
  - [ ] Gradient backgrounds (subtiel)
  - [ ] Icon rechts boven (32px, primary color)
  - [ ] Hover lift effect
  - [ ] Cijfers prominent (text-3xl font-bold)

- [ ] **Chart colors uit brand palette**
  - [ ] Serie 1: primary-500
  - [ ] Serie 2: teal-500
  - [ ] Serie 3: purple-500
  - [ ] Serie 4: warning-500
  - [ ] Serie 5: success-500

- [ ] **Email drop zone visueel uitnodigend**
  - [ ] Dashed border (border-dashed)
  - [ ] Hover state (border-primary-500)
  - [ ] Icon prominent (48-64px)
  - [ ] Duidelijke instructie tekst

- [ ] **Empty state per widget**
  - [ ] Geen data? Toon friendly message
  - [ ] Icon of emoji
  - [ ] Suggest action (filter aanpassen, data toevoegen)

### Werkorders Module

- [ ] **Kanban cards met hover effects**
  - [ ] Rust: shadow-sm
  - [ ] Hover: shadow-md + lift
  - [ ] Smooth transition (200ms)

- [ ] **Status badges consistent**
  - [ ] To Do: primary-100/800
  - [ ] Pending: warning-100/800
  - [ ] In Progress: orange-100/800
  - [ ] Completed: success-100/800

- [ ] **Compacte view optimaal leesbaar**
  - [ ] Index nummer zichtbaar (#3)
  - [ ] Titel niet truncated (of ellipsis)
  - [ ] Minimale padding maar niet te krap

- [ ] **Uitgebreide view niet overweldigend**
  - [ ] Goede spacing tussen elementen
  - [ ] Visuele hierarchy (titel > beschrijving > meta)
  - [ ] Actions duidelijk gescheiden

- [ ] **History viewer timeline mooi**
  - [ ] Icons per event type
  - [ ] Timestamps relatief ("2 uur geleden")
  - [ ] Scroll bij lange history (max-h-[260px])

- [ ] **Empty state per status kolom**
  - [ ] "Geen taken in To Do" → positief bericht
  - [ ] "Alles voltooid!" voor Completed kolom
  - [ ] Uitnodigend voor admins om taken toe te wijzen

### Inventory Module

- [ ] **Category badges consistent**
  - [ ] Zelfde style overal
  - [ ] Kleur per categorie (purple default)
  - [ ] Rounded, small padding

- [ ] **Stock status kleuren duidelijk**
  - [ ] In stock (>10): text-success-600
  - [ ] Low stock (≤10): text-warning-600
  - [ ] Out of stock (0): text-error-600

- [ ] **Search dropdown smooth**
  - [ ] Fade in animatie (200ms)
  - [ ] Max height met scroll
  - [ ] Hover highlight op items
  - [ ] Keyboard navigeerbaar

- [ ] **Product cards aantrekkelijk**
  - [ ] Afbeelding prominent (indien beschikbaar)
  - [ ] Prijs bold en groot
  - [ ] Category badge zichtbaar
  - [ ] Hover effect (lift)

- [ ] **Empty state helpend**
  - [ ] "Geen producten" → "Voeg je eerste product toe"
  - [ ] CTA button (Nieuw Product)
  - [ ] Link naar import functie (CSV)

### Accounting Module

- [ ] **Invoice cards professioneel**
  - [ ] Bedrag prominent
  - [ ] Status badge rechts boven
  - [ ] Klant naam bold
  - [ ] Datum subtiel maar zichtbaar

- [ ] **Status workflow visueel helder**
  - [ ] Draft → Sent → Paid
  - [ ] Kleuren: gray → primary → success
  - [ ] Icons per status

- [ ] **Totalen prominent**
  - [ ] Subtotal, BTW, Totaal duidelijk
  - [ ] Font sizes: sm, base, xl (hierarchy)
  - [ ] Totaal bold en groter

- [ ] **BTW informatie leesbaar**
  - [ ] Percentage duidelijk (21%)
  - [ ] Bedrag berekening zichtbaar
  - [ ] Consistent formatting (€ 1.234,56)

### CRM Module

- [ ] **Contact cards persoonlijk**
  - [ ] Avatar (indien beschikbaar) of initials
  - [ ] Naam prominent
  - [ ] Email en telefoon klein maar leesbaar
  - [ ] Last contact timestamp

- [ ] **Lead pipeline visueel**
  - [ ] 7 fases duidelijk gescheiden
  - [ ] Kleuren per fase (gradient progression)
  - [ ] Drag-and-drop hint (cursor)

- [ ] **Email integratie duidelijk**
  - [ ] Email icon zichtbaar
  - [ ] Laatste email datum
  - [ ] Unread badge (indien van toepassing)

- [ ] **Taken overzichtelijk**
  - [ ] Prioriteit indicator (kleur/icon)
  - [ ] Due date prominent
  - [ ] Checkboxes voor afvinken
  - [ ] Overdue in rood

---

## Quarterly Design Review

### Q1: Foundation Check

**Elk kwartaal reviewen:**

- [ ] **Color palette nog passend?**
  - [ ] Voelt het nog fris?
  - [ ] Matcht het de brand?
  - [ ] Zijn er nieuwe brand guidelines?

- [ ] **Typography nog leesbaar?**
  - [ ] Font sizes werken op nieuwe devices?
  - [ ] Line heights nog prettig?
  - [ ] Weights goed gedifferentieerd?

- [ ] **Spacing consistent?**
  - [ ] Geen rare gaps opgemerkt?
  - [ ] Mobile spacing nog goed?
  - [ ] Padding/margin scale nog logisch?

- [ ] **Shadows niet gedateerd?**
  - [ ] Nog modern genoeg?
  - [ ] Performance impact acceptabel?
  - [ ] Browser support nog goed?

### Q2: Interactions Review

**Interactie patronen:**

- [ ] **Animaties niet vervelend geworden?**
  - [ ] User feedback: te veel beweging?
  - [ ] Performance nog 60fps?
  - [ ] Duur nog goed (niet te traag)?

- [ ] **Feedback tijdig en duidelijk?**
  - [ ] Hover states instant?
  - [ ] Loading states informatief?
  - [ ] Error messages helpful?

- [ ] **Loading states informatief?**
  - [ ] Spinners vs skeletons?
  - [ ] Progress indicators waar nodig?
  - [ ] Timeouts gepast?

- [ ] **Error states helpend?**
  - [ ] Messages duidelijk?
  - [ ] Suggest solutions?
  - [ ] Niet beschuldigend?

### Q3: Mobile Experience

**Mobile check:**

- [ ] **Touch targets nog groot genoeg?**
  - [ ] Nieuwe features 44x44px?
  - [ ] Feedback van users?
  - [ ] Test op kleinste device

- [ ] **Nieuwe features mobile-optimized?**
  - [ ] Mobile-first ontwikkeld?
  - [ ] Responsive getest?
  - [ ] Touch interactions smooth?

- [ ] **Performance nog snel?**
  - [ ] 3G test (Chrome DevTools)
  - [ ] Bundle size gegroeid?
  - [ ] Images geoptimaliseerd?

- [ ] **Hamburger menu nog smooth?**
  - [ ] Slide animatie geen janky?
  - [ ] Close op navigation?
  - [ ] ESC werkt?

### Q4: Innovation

**Vernieuwing overwegen:**

- [ ] **Nieuwe design trends?**
  - [ ] Wat doen concurrenten?
  - [ ] Nieuwe CSS features beschikbaar?
  - [ ] User verwachtingen veranderd?

- [ ] **User feedback verzameld?**
  - [ ] Surveys gestuurd?
  - [ ] Interviews gedaan?
  - [ ] Analytics bekeken?

- [ ] **Concurrentie geanalyseerd?**
  - [ ] Vergelijkbare tools bekeken?
  - [ ] Wat doen zij beter?
  - [ ] Wat kunnen wij anders/beter?

- [ ] **Refresh nodig?**
  - [ ] Voelt het gedateerd?
  - [ ] Budget voor redesign?
  - [ ] Gefaseerde update mogelijk?

---

## Design Debt Tracking

### Hoge Prioriteit (Doet Pijn aan UX)

**Must-fix items:**

| Issue | Impact | Effort | Deadline | Status |
|-------|--------|--------|----------|--------|
| *Voorbeeld: Buttons te klein op mobile* | Hoog | 1u | Week 1 | ❌ Todo |
| *Voorbeeld: Low contrast in status badges* | Hoog | 2u | Week 1 | ❌ Todo |

**Template:**
```markdown
## [Issue Naam]

**Probleem:**
Beschrijving van het probleem

**Impact:**
- User pain point
- Accessibility issue?
- Performance problem?

**Oplossing:**
Hoe te fixen

**Effort:**
Geschatte tijd

**Deadline:**
Wanneer moet het af?
```

### Middel Prioriteit (Kan Beter)

**Nice-to-have verbeteringen:**

| Issue | Impact | Effort | Planned | Status |
|-------|--------|--------|---------|--------|
| *Voorbeeld: Hover effects op cards* | Medium | 30min | Sprint 2 | ⏳ Backlog |
| *Voorbeeld: Empty states verbeteren* | Medium | 2u | Sprint 3 | ⏳ Backlog |

### Lage Prioriteit (Wishlist)

**Toekomstige innovaties:**

- **Dark mode support**
  - Impact: User preference
  - Effort: 2-3 dagen
  - Status: Wishlist

- **Animations library (Framer Motion)**
  - Impact: Richer interactions
  - Effort: 1 week
  - Status: Research phase

- **Custom illustrations voor empty states**
  - Impact: Brand personality
  - Effort: Design time + implementation
  - Status: Budget needed

---

## Checklist Shortcuts

### ⚡ Super Quick Check (1 min)

**Voor small changes:**

- [ ] Gebruikt brand colors? ✅
- [ ] Responsive? ✅
- [ ] Accessible? ✅
- [ ] Getest op mobile? ✅

### 🚀 Standard Check (5 min)

**Voor normal features:**

- [ ] All states covered? ✅
- [ ] Design tokens gebruikt? ✅
- [ ] Interactivity feedback? ✅
- [ ] Performance OK? ✅
- [ ] Tested on 2+ devices? ✅

### 🎯 Full Audit (30 min)

**Voor major features:**

- [ ] Complete checklist hierboven ✅
- [ ] User testing gedaan ✅
- [ ] Performance benchmark ✅
- [ ] Accessibility audit ✅
- [ ] Cross-browser test ✅
- [ ] Documentation updated ✅

---

## Gerelateerde Documentatie

- **[Visual Design Guide](./visual-design-guide.md)** - Design filosofie
- **[Brand Identity](./brand-identity.md)** - Kleuren en typography
- **[Component Visual Patterns](./component-visual-patterns.md)** - Component styling
- **[Design Quick Wins](./design-quick-wins.md)** - Snelle verbeteringen
- **[Mobile Optimization](./mobile-optimization.md)** - Mobile patterns

---

**Deze checklist zorgt voor consistente, mooie en toegankelijke componenten! ✅**

*Print deze checklist en hang hem bij je desk, of bookmark deze pagina!*
