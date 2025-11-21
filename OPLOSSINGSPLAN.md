# Oplossingsplan: "Uitgebreid zoeken" knop niet zichtbaar

## Probleem geïdentificeerd ✅

**Kernprobleem**: De browser toont "Zoek producten..." terwijl onze code "Zoeken..." gebruikt. Dit betekent dat:
- De browser een andere/oude versie van de component gebruikt
- De dev server compileert niet de juiste bestanden
- Er is mogelijk een cache probleem

## Stappenplan om op te lossen

### ✅ STAP 1: Verificatie (VOLTOOID)
- [x] Code bevat knop op 2 plekken
- [x] Routing is correct
- [x] Er is maar 1 WebshopPage component
- [x] Test wijzigingen niet zichtbaar → bevestigt probleem

### 🔄 STAP 2: Dev Server Reset (IN UITVOERING)
- [x] Vite cache gewist
- [ ] Dev server volledig stoppen
- [ ] Dev server opnieuw starten
- [ ] Verifieer dat nieuwe code wordt geladen

### 📋 STAP 3: Browser Cache Clearing
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Browser cache volledig wissen
- [ ] Test in incognito window
- [ ] Controleer Network tab voor geladen bestanden

### 🔍 STAP 4: Verificatie Component Loading
- [x] Console.log toegevoegd aan component
- [ ] Controleer browser console voor log message
- [ ] Als log niet zichtbaar: component wordt niet geladen
- [ ] Als log wel zichtbaar: component wordt geladen maar knop niet gerenderd

### 🛠️ STAP 5: Als probleem blijft
- [ ] Check of dist folder wordt gebruikt
- [ ] Verifieer vite.config.ts
- [ ] Controleer of er een proxy configuratie is
- [ ] Check of er een andere server draait op poort 5174

## Acties die nu worden uitgevoerd:

1. ✅ Console.log toegevoegd voor debugging
2. ✅ Vite cache gewist
3. ⏳ Dev server herstarten
4. ⏳ Browser cache clearing
5. ⏳ Verificatie in browser

## Verwachte resultaten:

Na deze stappen zouden we moeten zien:
- Console log "[DEBUG] WebshopPage component loaded"
- Heading met "[TEST]" tekst
- Rode/blauwe test buttons
- "Uitgebreid zoeken" knop zichtbaar

Als dit niet werkt, is er mogelijk een fundamenteel probleem met de dev server configuratie.

