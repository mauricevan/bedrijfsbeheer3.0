# Plan: Isoleren en Oplossen Probleem "Uitgebreid zoeken" Knop

## Probleem
De knop "Uitgebreid zoeken" staat in de code maar is niet zichtbaar in de browser. De browser toont "Zoek producten..." terwijl de code "Zoeken..." gebruikt.

## Stappenplan

### Stap 1: Verifieer welke component wordt gebruikt ✅
- [x] Controleer App.tsx routing - gebruikt `@/features/webshop/pages/WebshopPage`
- [x] Controleer of er meerdere WebshopPage bestanden zijn
- [x] Verifieer imports zijn correct

### Stap 2: Voeg unieke testwijziging toe om te verifiëren dat wijzigingen worden geladen
- [ ] Voeg een zeer zichtbare wijziging toe (bijv. "TEST BUTTON" tekst)
- [ ] Controleer of deze wijziging zichtbaar is in browser
- [ ] Als niet zichtbaar: probleem is met dev server/build
- [ ] Als wel zichtbaar: probleem is specifiek met deze knop

### Stap 3: Controleer dev server status
- [ ] Verifieer dat dev server draait op poort 5174
- [ ] Controleer console output voor compile errors
- [ ] Controleer of HMR (Hot Module Replacement) werkt
- [ ] Test of wijzigingen automatisch worden geladen

### Stap 4: Controleer browser cache
- [ ] Hard refresh: Ctrl+Shift+R / Cmd+Shift+R
- [ ] Clear browser cache volledig
- [ ] Test in incognito/private window
- [ ] Controleer Network tab voor welke bestanden worden geladen

### Stap 5: Verifieer build output
- [ ] Controleer of dist folder wordt gebruikt i.p.v. dev server
- [ ] Check vite.config.ts voor build instellingen
- [ ] Verifieer dat dev server de juiste poort gebruikt

### Stap 6: Controleer component rendering
- [ ] Voeg console.log toe in WebshopPage component
- [ ] Controleer browser console voor deze logs
- [ ] Verifieer dat component daadwerkelijk wordt gerenderd
- [ ] Check of er conditional rendering is die knop verbergt

### Stap 7: Controleer CSS/styling
- [ ] Check of knop mogelijk verborgen is door CSS (display: none, visibility: hidden)
- [ ] Controleer of knop buiten viewport valt
- [ ] Verifieer z-index en positioning

### Stap 8: Als alles faalt: Debug met React DevTools
- [ ] Installeer React DevTools extensie
- [ ] Inspecteer component tree
- [ ] Controleer props en state
- [ ] Verifieer of knop component wordt gerenderd maar niet zichtbaar is

## Actieplan voor nu

1. **Eerst**: Voeg een zeer zichtbare testwijziging toe
2. **Dan**: Controleer dev server status en console
3. **Vervolgens**: Test in browser met cache clearing
4. **Als nodig**: Debug met React DevTools

