# Probleem Analyse: "Uitgebreid zoeken" knop niet zichtbaar

## Bevindingen

### ✅ Wat we weten:
1. **Code is correct**: De knop staat op 2 plekken in `WebshopPage.tsx`:
   - Regel 152-158: Boven bij header
   - Regel 251-258: Naast zoekveld

2. **Routing is correct**: `App.tsx` gebruikt `@/features/webshop/pages/WebshopPage`

3. **Test wijzigingen niet zichtbaar**: 
   - "[TEST]" tekst in heading niet zichtbaar
   - Rode/blauwe buttons niet zichtbaar
   - **CONCLUSIE**: Browser gebruikt andere versie dan onze code

### 🔍 Probleem identificatie:

**De browser toont "Zoek producten..." terwijl onze code "Zoeken..." gebruikt.**

Dit betekent:
- ❌ Dev server compileert niet de juiste bestanden, OF
- ❌ Er wordt een andere component gebruikt, OF
- ❌ Browser gebruikt oude build/cache

## Oplossingsplan

### Stap 1: Verifieer dev server status
- Check of dev server draait op poort 5174
- Controleer console voor compile errors
- Verifieer HMR (Hot Module Replacement)

### Stap 2: Zoek naar alternatieve webshop component
- Zoek naar andere bestanden met "Zoek producten"
- Check of er een andere WebshopPage variant is
- Controleer of MainLayout een andere component injecteert

### Stap 3: Force rebuild
- Stop dev server
- Verwijder node_modules/.vite cache
- Herstart dev server
- Hard refresh browser met cache clearing

### Stap 4: Als probleem blijft
- Check of dist folder wordt gebruikt i.p.v. dev server
- Verifieer vite.config.ts instellingen
- Controleer of er een proxy of andere server configuratie is

