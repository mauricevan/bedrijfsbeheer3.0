---
description: WORKFLOW MANAGEMENT
---

# Workflow Management
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024

---

## 📋 Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Kernconcepten](#kernconcepten)
3. [Algoritmisch Workflow Proces](#algoritmisch-workflow-proces)
4. [Workflow Stappen](#workflow-stappen)
5. [Parallellisme & Coördinatie](#parallellisme--coördinatie)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overzicht

Dit document beschrijft het **geoptimaliseerde algoritmische workflow systeem** voor het beheren van softwareprojecten met Markdown files. Het systeem is geïnspireerd op Agile/Kanban methodologieën maar blijft eenvoudig en file-based.

### Wat is het?

Een dynamisch, collaboratief projectmanagement systeem gebaseerd op twee types MD-files:

1. **ProjectTemplate.md** - Vaste basis (READ-ONLY)
   - Algemene best practices
   - Checklists en richtlijnen
   - Senior-dev overwegingen
   - Referenties naar alle guides

2. **ProjectStatus-[ProjectNaam].md** - Levende file (READ-WRITE)
   - Project-specifieke taken
   - Voortgang tracking
   - Team coördinatie
   - Updates log

### Waarom Dit Systeem?

**Voordelen:**
- ✅ **Geen Duplicatie**: Parallellisme en claims voorkomen overlaps
- ✅ **Transparantie**: Alles in één file, Git trackt geschiedenis
- ✅ **Schaalbaar**: Werkt voor solo developers én teams
- ✅ **Algoritmisch**: Herhaalbare, self-updating workflow
- ✅ **File-Based**: Geen externe tools nodig
- ✅ **Git-Integratie**: Versiegeschiedenis en conflict resolution

---

## 🧩 Kernconcepten

### 1. Vaste Basis vs Dynamische Updates

```
ProjectTemplate.md (READ-ONLY)
    ↓ referentie
ProjectStatus-[Project].md (READ-WRITE)
    ↓ updates
Git History (versioning)
```

**Regel:** ProjectTemplate.md wordt NOOIT aangepast voor specifieke projecten.

### 2. Taak Lifecycle

```
Open → Claimed → In Progress → Done/Blocked
```

**States:**
- ⬜ **Open**: Beschikbaar om te claimen
- 🔵 **In Progress**: Werker is bezig
- ✅ **Done**: Afgerond en gereviewed
- 🚫 **Blocked**: Blokkade aanwezig
- ⏸️ **On Hold**: Tijdelijk gepauzeerd

### 3. Parallellisme Model

```markdown
Taak A (geen dependencies) ─┐
                            ├─→ Parallel mogelijk
Taak B (geen dependencies) ─┘

Taak C (depends on A) ────→ Sequentieel, wacht op A
```

**Regels:**
- Max aantal werkers per project (bijv. 3)
- Afhankelijkheden blokkeren automatisch
- Parallellisme matrix definieert wat kan

### 4. Git-Based Versioning

```bash
# Atomische updates via commits
git add ProjectStatus-MyApp.md
git commit -m "docs: claim taak 3 - implement auth"
git push

# Conflicten worden opgelost via Git merge
```

---

## 🔄 Algoritmisch Workflow Proces

### Proces Overzicht (Cyclisch)

```
┌─────────────────────────────────────────┐
│  1. PROJECT INITIATIE                   │
│     - Maak ProjectStatus-[Naam].md      │
│     - Definieer taken & dependencies    │
│     - Stel parallellisme regels in      │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  2. TAAK CLAIMEN                        │
│     - Lees ProjectTemplate.md           │
│     - Check parallellisme regels        │
│     - Claim taak in assignments         │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  3. TAAK UITVOEREN                      │
│     - Werk volgens best practices       │
│     - Log voortgang in updates          │
│     - Commit regelmatig                 │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  4. TAAK AFRONDEN                       │
│     - Review tegen template             │
│     - Update status naar Done           │
│     - Unlock afhankelijke taken         │
└────────────┬────────────────────────────┘
             ↓
        ┌────────┴─────────┐
        │                  │
        ↓                  ↓
   Project Klaar?      Terug naar stap 2
        │              (volgende taak)
        ↓
   VOLTOOIING
```

---

## 📝 Workflow Stappen (Gedetailleerd)

### Stap 1: Project Initiatie

**Door:** Projecteigenaar (mens of AI)

**Acties:**

1. **Geef project omschrijving**
   ```markdown
   Project: E-commerce Platform
   Doel: Online winkel met product catalog, shopping cart, checkout
   Tech: React 19, TypeScript, Node.js, PostgreSQL
   ```

2. **Maak ProjectStatus file**
   ```bash
   cp ProjectStatus-TEMPLATE.md ProjectStatus-EcommercePlatform.md
   ```

3. **Vul Sectie 1 in: Project Omschrijving**
   - Doel en context
   - Scope (in/out)
   - Success criteria
   - Tech stack

4. **Vul Sectie 2 in: Taak Breakdown**
   ```markdown
   | Taak # | Omschrijving | Afhankelijkheden | Status |
   |--------|--------------|------------------|--------|
   | 1 | Project setup | Geen | ⬜ Open |
   | 2 | Auth backend | Taak 1 | ⬜ Open |
   | 3 | Product catalog UI | Taak 1 | ⬜ Open |
   | 4 | Shopping cart | Taak 2, 3 | ⬜ Open |
   ```

5. **Vul Sectie 3 in: Parallellisme**
   ```markdown
   Max werkers: 3

   Parallellisme Matrix:
   - Taak 2 en 3 kunnen parallel (na taak 1)
   - Taak 4 moet wachten op 2 en 3
   ```

6. **Commit naar Git**
   ```bash
   git add ProjectStatus-EcommercePlatform.md
   git commit -m "docs: initialize EcommercePlatform project"
   git push
   ```

**Checklist:**
```markdown
- [ ] ProjectStatus-[Naam].md aangemaakt
- [ ] Sectie 1 (omschrijving) compleet
- [ ] Sectie 2 (taken) gedefinieerd met dependencies
- [ ] Sectie 3 (parallellisme) ingesteld
- [ ] Sectie 4 (assignments) klaar voor claims
- [ ] Initial commit gemaakt
```

---

### Stap 2: Taak Claimen en Uitvoeren

**Door:** Werker (mens of AI)

**Acties:**

1. **Lees eerst ProjectTemplate.md**
   ```bash
   cat ProjectTemplate.md
   # Focus op relevante secties voor je taak
   ```

2. **Lees ProjectStatus-[ProjectNaam].md**
   ```bash
   cat ProjectStatus-EcommercePlatform.md
   # Check huidige status, wat is al gedaan
   ```

3. **Check Parallellisme (Sectie 3)**
   ```markdown
   VRAAG: Mag ik deze taak claimen?

   CHECK 1: Is max werkers bereikt?
   - Huidige werkers: 2 / Max: 3 ✅ OK

   CHECK 2: Zijn dependencies klaar?
   - Taak 2 hangt af van Taak 1
   - Taak 1 status: ✅ Done ✅ OK

   CHECK 3: Kan het parallel?
   - Taak 2 kan parallel met Taak 3 ✅ OK

   CONCLUSIE: Ja, ik mag Taak 2 claimen
   ```

4. **Claim taak in Sectie 4**
   ```markdown
   | Taak # | Werker | Status | Timestamp Claim | Timestamp Start |
   |--------|--------|--------|-----------------|-----------------|
   | 2 | AI-Claude | 🔵 In Progress | 2024-11-14 10:00 | 2024-11-14 10:05 |
   ```

5. **Log start in Sectie 5**
   ```markdown
   ### 2024-11-14

   #### [10:05] - Werker: AI-Claude - Taak #2
   **Status:** Begonnen met Auth backend

   **Plan:**
   - User model met TypeScript types
   - Bcrypt voor password hashing
   - JWT voor tokens

   **Referenties:**
   - SECURITY_BEST_PRACTICES.md (bcrypt, JWT)
   - REACT_TYPESCRIPT_BEST_PRACTICES.md (types)
   ```

6. **Commit claim**
   ```bash
   git add ProjectStatus-EcommercePlatform.md
   git commit -m "docs: claim taak 2 - implement auth backend"
   git push
   ```

7. **Werk aan de taak**
   - Volg best practices uit ProjectTemplate.md
   - Implementeer volgens requirements
   - Test je code
   - Schrijf documentatie

8. **Log voortgang regelmatig**
   ```markdown
   #### [11:30] - Werker: AI-Claude - Taak #2
   **Status:** Progress update

   **Uitgevoerd:**
   - ✅ User model aangemaakt (src/features/auth/types/user.types.ts)
   - ✅ Auth service met bcrypt (src/features/auth/services/authService.ts)
   - ✅ Unit tests geschreven (coverage: 85%)

   **Bevindingen:**
   - Bcrypt rounds: 10 (volgens SECURITY_BEST_PRACTICES.md)
   - JWT expiry: 1 hour for access, 7 days for refresh

   **Volgende:**
   - JWT token generation/verification
   - Integration tests

   **Blokkades:** Geen
   ```

9. **Commit werk regelmatig**
   ```bash
   git add .
   git commit -m "feat(auth): implement user model and password hashing"
   git push
   ```

**Checklist:**
```markdown
- [ ] ProjectTemplate.md gelezen
- [ ] ProjectStatus gelezen voor context
- [ ] Parallellisme gecheckt
- [ ] Taak geclaimd in Sectie 4
- [ ] Start gelogd in Sectie 5
- [ ] Claim gecommit naar Git
- [ ] Werk uitgevoerd volgens best practices
- [ ] Voortgang regelmatig gelogd
- [ ] Code regelmatig gecommit
```

---

### Stap 3: Taak Afronden en Updaten

**Door:** Werker die taak heeft geclaimd

**Acties:**

1. **Herlees ProjectTemplate.md**
   ```markdown
   CHECK: Voldoet mijn werk aan:
   - [ ] TypeScript best practices (geen any, strict mode)
   - [ ] Security best practices (bcrypt, input validation)
   - [ ] Testing best practices (>80% coverage)
   - [ ] Component size limits
   - [ ] Documentation standards
   ```

2. **Final review**
   ```bash
   # Run all tests
   npm run test

   # Check coverage
   npm run test:coverage

   # Lint
   npm run lint

   # Type check
   npm run type-check

   # Build
   npm run build
   ```

3. **Update Sectie 4: Assignments**
   ```markdown
   | Taak # | Werker | Status | Claim | Start | Afgerond |
   |--------|--------|--------|-------|-------|----------|
   | 2 | AI-Claude | ✅ Done | 10:00 | 10:05 | 14:30 |
   ```

4. **Log completion in Sectie 5**
   ```markdown
   #### [14:30] - Werker: AI-Claude - Taak #2
   **Status:** ✅ Taak afgerond

   **Resultaat:**
   - ✅ Auth backend compleet
   - ✅ Password hashing met bcrypt (10 rounds)
   - ✅ JWT tokens (access + refresh)
   - ✅ Unit tests (coverage: 87%)
   - ✅ Integration tests passed
   - ✅ Security review passed

   **Code/Links:**
   - PR: #123 "feat(auth): implement authentication backend"
   - Commits: abc123, def456, ghi789
   - Branch: feature/auth-backend

   **Documentation:**
   - ADR-002: JWT library keuze (jsonwebtoken)
   - API docs updated: /api/auth endpoints

   **Unlock:** Taak 4 dependency opgelost (1/2)
   ```

5. **Check afhankelijkheden**
   ```markdown
   TAAK 4 afhankelijkheden:
   - Taak 2: ✅ Done
   - Taak 3: 🔵 In Progress

   STATUS: Taak 4 blijft Blocked tot Taak 3 Done is
   ```

6. **Update Progress (Sectie 6)**
   ```markdown
   **Totaal Taken:** 4
   **Afgerond:** 2 (50%)
   **In Progress:** 1 (25%)
   **Open:** 1 (25%)

   [██████████░░░░░░░░░░] 50% Complete
   ```

7. **Commit completion**
   ```bash
   git add ProjectStatus-EcommercePlatform.md
   git commit -m "docs: complete taak 2 - auth backend done"
   git push
   ```

8. **Als project niet klaar: Ga terug naar Stap 2**
   - Claim nieuwe taak
   - Herhaal workflow

9. **Als laatste taak: Ga naar Stap 4 (Voltooiing)**

**Checklist:**
```markdown
- [ ] ProjectTemplate.md hergelezen
- [ ] All tests passing
- [ ] Code linted en formatted
- [ ] Documentation updated
- [ ] Sectie 4 updated (status → Done, timestamp)
- [ ] Sectie 5 updated (completion log)
- [ ] Dependencies gechecked en unlocked
- [ ] Sectie 6 updated (progress)
- [ ] Completion gecommit naar Git
```

---

### Stap 4: Project Voltooiing

**Door:** Laatste werker / projecteigenaar

**Acties:**

1. **Verify alle taken Done**
   ```markdown
   Sectie 2 - Taak Overzicht:
   | Taak # | Status |
   |--------|--------|
   | 1 | ✅ Done |
   | 2 | ✅ Done |
   | 3 | ✅ Done |
   | 4 | ✅ Done |

   ✅ Alle taken compleet!
   ```

2. **Check Success Criteria (Sectie 1)**
   ```markdown
   - [x] Gebruikers kunnen inloggen met email/password
   - [x] Product catalog toont alle producten
   - [x] Shopping cart functionaliteit werkt
   - [x] Checkout proces compleet
   - [x] Alle tests slagen (coverage: 85%)
   - [x] Security audit passed
   - [x] Deployed naar staging
   ```

3. **Final Review Checklist (Sectie 6)**
   ```markdown
   Code Quality:
   - [x] Alle code volgt ProjectTemplate.md
   - [x] Geen TypeScript any types
   - [x] Components < 300 regels
   - [x] Barrel files overal

   Security:
   - [x] Input validation
   - [x] XSS prevention
   - [x] CSRF protection
   - [x] Password hashing (bcrypt)

   Testing:
   - [x] Unit tests (85% coverage)
   - [x] Integration tests
   - [x] E2E tests
   - [x] All tests passing

   Documentation:
   - [x] README compleet
   - [x] API docs
   - [x] Feature docs
   - [x] ADRs geschreven
   ```

4. **Update Project Status**
   ```markdown
   **Project Status:** 🟢 Completed
   **Actual voltooiing:** 2024-11-20

   [████████████████████] 100% Complete
   ```

5. **Schrijf Retrospective (Sectie 7)**
   ```markdown
   ### Wat Ging Goed
   - Parallellisme werkte goed (frontend/backend tegelijk)
   - Best practices guides zeer nuttig
   - Git workflow smooth

   ### Wat Kan Beter
   - Meer tijd voor security review
   - Early performance testing

   ### Geleerde Lessen
   - ProjectStatus updates voorkomen miscommunicatie
   - Dependency tracking essentieel
   - Regular commits = betere history

   ### Metrics
   - Geschatte tijd: 80 uren
   - Actuele tijd: 75 uren
   - Variance: -6% (sneller dan verwacht)
   - Test coverage: 85%
   - Bug count in production: 2 (minor)
   ```

6. **Final Commit & Tag**
   ```bash
   git add ProjectStatus-EcommercePlatform.md
   git commit -m "docs: project completion - 100% done"

   # Tag release
   git tag -a v1.0.0 -m "Release v1.0.0 - EcommercePlatform"
   git push
   git push --tags
   ```

7. **Archivering**
   - Move ProjectStatus to `archive/` folder
   - Update team wiki
   - Share retrospective met team

**Checklist:**
```markdown
- [ ] Alle taken ✅ Done
- [ ] Success criteria gehaald
- [ ] Final review checklist 100%
- [ ] Status updated naar 🟢 Completed
- [ ] Retrospective geschreven
- [ ] Final commit gemaakt
- [ ] Release tagged
- [ ] ProjectStatus gearchiveerd
- [ ] Team geïnformeerd
```

---

## ⚡ Parallellisme & Coördinatie

### Voorkomen van Duplicatie

**Probleem:** Twee werkers werken aan dezelfde taak

**Oplossing:**
```markdown
1. CHECK voor claimen:
   - Is taak al geclaimd? → Kies andere taak
   - Status is "In Progress"? → Wacht of kies andere taak

2. CLAIM atomisch via Git:
   git pull  # Krijg laatste status
   # Update ProjectStatus met claim
   git add ProjectStatus.md
   git commit -m "docs: claim taak X"
   git push

3. BIJ CONFLICT:
   # Iemand anders was sneller
   git pull --rebase
   # Check of taak nog beschikbaar
   # Zo nee: kies andere taak
```

### Voorkomen van Verstoring

**Probleem:** Werker negeert afhankelijkheden

**Oplossing:**
```markdown
Sectie 3: Parallellisme Matrix ALTIJD checken

VOOR elke claim:
1. Check dependencies in Taak Breakdown
2. Verify dependencies zijn Done
3. Check Parallellisme Matrix: Kan het parallel?
4. Check Max Werkers niet overschreden

AUTOMATED CHECK (optioneel):
# Git hook script dat checkt:
- Dependencies Done voor claimen?
- Max werkers niet overschreden?
- Taak status correct?
```

### Max Werkers Enforcement

**Regel:** Maximaal X werkers tegelijk

**Implementatie:**
```markdown
Sectie 4: Actieve Werkers

**Totaal actieve werkers:** 2 / 3

VOOR claimen:
if (actieve_werkers >= MAX_WERKERS) {
  WACHT of kies "On Hold" taak
} else {
  CLAIM taak
  INCREMENT actieve_werkers
}

NA afronden:
DECREMENT actieve_werkers
NOTIFY anderen dat er plek is
```

### Blokkades Escaleren

**Wanneer:** Taak >X tijd in "In Progress" zonder updates

**Proces:**
```markdown
1. DETECT blokkade:
   - Taak >1 dag "In Progress"
   - Geen updates in Sectie 5
   - Status niet gewijzigd

2. MARKEER als "Stuck":
   Update Sectie 4:
   | Taak # | Status | Notities |
   |--------|--------|----------|
   | 3 | 🚫 Blocked | Stuck >24h, no updates |

3. LOG in Sectie 5:
   **ESCALATION:** Taak 3 stuck, werker niet bereikbaar

4. NOTIFY:
   - Team lead
   - Project manager
   - Andere werkers (via commit message)

5. REASSIGN:
   - Nieuwe werker claimt
   - Original werker wordt On Hold
```

---

## 🎯 Best Practices

### Voor Solo Developers

```markdown
✅ DO:
- Gebruik ProjectStatus als persoonlijke todo list
- Update log met dagelijkse voortgang (journaling)
- Review tegen template checklists voor quality
- Commit regelmatig voor history

✅ WORKFLOW:
1. Start dag: Lees ProjectStatus
2. Claim taak voor vandaag
3. Werk 2-4 uur, log voortgang
4. Commit werk
5. Einde dag: Update status, plan volgende dag
```

### Voor Teams (2-5 Personen)

```markdown
✅ DO:
- Daily standup: Review ProjectStatus samen
- Claim taken om duplicatie te voorkomen
- Respecteer max werkers limiet
- Communiceer blokkades in updates log
- Code review voor elke taak

✅ WORKFLOW:
1. Morning: Team sync via ProjectStatus
2. Claim taken (check parallellisme)
3. Work in parallel waar mogelijk
4. Log updates voor team visibility
5. Evening: Update status, unlock dependencies
```

### Voor Grote Teams (5+ Personen)

```markdown
✅ DO:
- Split project in modules met eigen ProjectStatus
- Gebruik sub-files voor grote projecten:
  - ProjectStatus-Main.md
  - ProjectStatus-Frontend.md
  - ProjectStatus-Backend.md
- Dedicated coördinator voor dependency management
- Automated checks via Git hooks

✅ WORKFLOW:
1. Weekly: Review all ProjectStatus files
2. Module leads claim en delegeren taken
3. Daily updates in respective ProjectStatus
4. Integration: Cross-module dependencies tracked in Main
5. Weekly retrospective voor improvements
```

### Voor AI Assistenten

```markdown
✅ DO:
- ALTIJD eerst ProjectTemplate.md lezen
- Check ProjectStatus voor current state
- Claim taak VOOR je begint
- Update status EN log regelmatig (elke stap)
- Volg senior-dev overwegingen uit template
- Log bevindingen en beslissingen
- Commit atomisch met goede messages

✅ WORKFLOW:
# Pseudo-code voor AI workflow
1. READ ProjectTemplate.md
2. READ ProjectStatus-[Project].md
3. ANALYZE:
   - Wat is project doel?
   - Welke taken zijn open?
   - Welke taken kan ik doen (parallellisme)?
4. SELECT taak
5. CHECK:
   - Dependencies done?
   - Max werkers OK?
   - Relevant skills?
6. CLAIM taak in ProjectStatus
7. LOG start met plan
8. COMMIT claim
9. IMPLEMENT volgens best practices
10. LOG voortgang regelmatig
11. COMMIT werk regelmatig
12. TEST thoroughly
13. REVIEW against template
14. COMPLETE taak
15. LOG completion met resultaten
16. UPDATE dependencies (unlock)
17. COMMIT completion
18. IF project not done: GOTO 2

❌ DON'T:
- Niet ProjectTemplate.md aanpassen
- Niet taken zonder claimen
- Niet zonder logging werken
- Niet zonder testing afronden
```

---

## 🔧 Troubleshooting

### Probleem: Git Merge Conflict in ProjectStatus

**Oorzaak:** Twee werkers updaten tegelijk

**Oplossing:**
```bash
# Pull met rebase
git pull --rebase origin main

# Conflict in ProjectStatus-Project.md
# MANUALLY resolve:
# 1. Keep both updates in Sectie 5 (append-only log)
# 2. Merge assignments in Sectie 4
# 3. Update progress in Sectie 6

git add ProjectStatus-Project.md
git rebase --continue
git push
```

### Probleem: Taak Stuck in "In Progress"

**Symptomen:**
- Taak >24h in progress
- Geen updates in log
- Werker niet bereikbaar

**Oplossing:**
```markdown
1. LOG escalation:
   #### [timestamp] - ESCALATION - Taak #X
   **Issue:** No updates >24h, werker [naam] onbereikbaar
   **Action:** Reassigning to [nieuwe werker]

2. UPDATE assignment:
   | Taak # | Werker | Status | Notities |
   |--------|--------|--------|----------|
   | X | Nieuwe Werker | 🔵 In Progress | Reassigned from [oude] |

3. COMMIT:
   git commit -m "docs: escalate taak X - reassign to [nieuwe]"

4. NOTIFY team
```

### Probleem: Dependencies Niet Clear

**Symptomen:**
- Taak kan niet starten, onduidelijk waarom
- Circular dependencies

**Oplossing:**
```markdown
1. VISUALIZE dependencies:
   # Use Mermaid diagram in ProjectStatus

   ```mermaid
   graph TD
       A[Taak 1] --> B[Taak 2]
       A --> C[Taak 3]
       B --> D[Taak 4]
       C --> D
   ```

2. CHECK for cycles:
   - Taak A depends on B
   - Taak B depends on A
   → INVALID, fix breakdown

3. REFACTOR taak breakdown:
   - Split circulaire dependencies
   - Maak intermediate taken

4. UPDATE Sectie 2 met clearer dependencies
```

### Probleem: Max Werkers Te Restrictief

**Symptomen:**
- Te veel wachttijd
- Taken die parallel kunnen, moeten wachten

**Oplossing:**
```markdown
1. REVIEW Parallellisme Matrix (Sectie 3)
2. IDENTIFY taken die echt parallel kunnen
3. UPDATE max werkers:
   - Was: 2
   - Nu: 3
4. LOG rationale:
   #### [timestamp] - CONFIG CHANGE
   **Change:** Max werkers 2 → 3
   **Rationale:** Frontend, backend, docs kunnen parallel
5. COMMIT update
```

### Probleem: Too Many Open Taken

**Symptomen:**
- Overzicht verloren
- Moeilijk te prioriteren

**Oplossing:**
```markdown
1. ADD Priority column in Sectie 2:
   | Taak # | Omschrijving | Prioriteit | Status |
   |--------|--------------|------------|--------|
   | 1 | Setup | 🔴 Hoog | ✅ Done |
   | 2 | Auth | 🔴 Hoog | 🔵 In Progress |
   | 3 | UI | 🟡 Medium | ⬜ Open |
   | 4 | Docs | 🟢 Laag | ⬜ Open |

2. FOCUS op Hoog priority eerst
3. CONSIDER splitting project:
   - MVP: Hoog priority taken
   - Phase 2: Medium priority
   - Future: Laag priority
```

---

## 📊 Workflow Metrics

### Track Effectiviteit

```markdown
### In Sectie 7 (Retrospective):

**Cycle Time:**
- Gemiddelde tijd per taak: [X uren]
- Fastest: [taak #] - [tijd]
- Slowest: [taak #] - [tijd]

**Blokkades:**
- Totaal aantal: [X]
- Gemiddelde blokkade tijd: [Y uren]
- Meest voorkomende: [reden]

**Parallellisme Effectiviteit:**
- Geplande parallellisme: [% taken]
- Actuele parallellisme: [% taken]
- Efficiency: [actual/planned * 100%]

**Quality:**
- Test coverage: [%]
- Bugs in production: [#]
- Code review iterations: [gemiddeld #]

**Team Collaboration:**
- Aantal werkers: [#]
- Commits per werker: [breakdown]
- Merge conflicts: [#]
- Average resolution time: [tijd]
```

---

## 🚀 Advanced Patterns

### Pattern 1: Sub-Projects

Voor grote projecten, split in modules:

```
ProjectStatus-Main.md (orchestration)
  ├── ProjectStatus-Frontend.md
  ├── ProjectStatus-Backend.md
  └── ProjectStatus-Infrastructure.md
```

**Main links naar sub-projects:**
```markdown
## Sectie 2: Module Breakdown

| Module | Status | Assigned To | ProjectStatus Link |
|--------|--------|-------------|--------------------|
| Frontend | 🔵 In Progress | Team A | [Link](./ProjectStatus-Frontend.md) |
| Backend | ✅ Done | Team B | [Link](./ProjectStatus-Backend.md) |
| Infra | ⬜ Open | - | [Link](./ProjectStatus-Infrastructure.md) |
```

### Pattern 2: Sprints/Iterations

Voor Agile teams:

```markdown
## Sectie 2: Sprint Planning

### Sprint 1 (2024-11-14 tot 2024-11-28)
**Goal:** MVP functionaliteit

| Taak # | Story Points | Status |
|--------|--------------|--------|
| 1 | 5 | ✅ Done |
| 2 | 8 | 🔵 In Progress |
| 3 | 3 | ⬜ Open |

**Capacity:** 40 story points
**Committed:** 16 story points
**Completed:** 5 story points (31%)
```

### Pattern 3: Automated Notifications

Git hook voor notifications:

```bash
# .git/hooks/post-commit
#!/bin/bash

# Check for blocked tasks in ProjectStatus
if grep -q "🚫 Blocked" ProjectStatus-*.md; then
  echo "⚠️  WARNING: Blocked tasks detected!"
  echo "Check ProjectStatus for details"
  # Send to Slack/Discord/Email
fi

# Check for completed project
if grep -q "🟢 Completed" ProjectStatus-*.md; then
  echo "🎉 PROJECT COMPLETED!"
  # Notify team
fi
```

---

## 📚 Referenties

**Gerelateerde Documenten:**
- [ProjectTemplate.md](./ProjectTemplate.md) - Vaste basis template
- [ProjectStatus-TEMPLATE.md](./ProjectStatus-TEMPLATE.md) - Template voor nieuwe projecten
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Git best practices
- [DOCUMENTATION_PATTERNS.md](./DOCUMENTATION_PATTERNS.md) - Documentatie standaarden

**Inspiratie:**
- Agile/Scrum methodologies
- Kanban boards
- Git Flow branching strategy
- Markdown-driven development

---

## 🎓 Training & Onboarding

### Voor Nieuwe Teamleden

**Week 1:**
```markdown
Day 1: Lees ProjectTemplate.md + alle guides
Day 2: Lees WORKFLOW_MANAGEMENT.md (dit document)
Day 3: Shadow ervaren developer met ProjectStatus
Day 4: Claim eerste kleine taak (🟢 Laag priority)
Day 5: Complete taak met guidance
```

**Week 2:**
```markdown
Day 1-5: Zelfstandig werken met ProjectStatus
         Regular check-ins met mentor
         Focus op workflow adherence
```

**Week 3:**
```markdown
Day 1-5: Full autonomy
         Participate in code reviews
         Help onboard next new member
```

### Voor AI Assistenten

**Setup Prompt:**
```
Je bent een AI assistant die werkt aan softwareproject [Naam].

WORKFLOW:
1. LEES ALTIJD EERST: ProjectTemplate.md
2. LEES VOOR CONTEXT: ProjectStatus-[Project].md
3. VOLG WORKFLOW uit: WORKFLOW_MANAGEMENT.md

REGELS:
- ProjectTemplate.md is READ-ONLY
- ProjectStatus is je working file
- Claim taken voor je begint
- Log alles in Sectie 5
- Commit regelmatig
- Volg best practices

BEGIN met: Lees ProjectTemplate.md en ProjectStatus-[Project].md
```

---

## ✅ Workflow Checklist (Quick Reference)

### Project Start
```markdown
- [ ] ProjectStatus-[Naam].md aangemaakt
- [ ] Sectie 1-3 ingevuld
- [ ] Dependencies gedefinieerd
- [ ] Parallellisme regels gezet
- [ ] Initial commit
```

### Taak Start
```markdown
- [ ] ProjectTemplate.md gelezen
- [ ] ProjectStatus gelezen
- [ ] Parallellisme gecheckt
- [ ] Dependencies verified
- [ ] Taak geclaimd (Sectie 4)
- [ ] Start gelogd (Sectie 5)
- [ ] Claim gecommit
```

### Tijdens Werk
```markdown
- [ ] Best practices gevolgd
- [ ] Tests geschreven
- [ ] Voortgang gelogd
- [ ] Code gecommit
- [ ] Blokkades gemeld
```

### Taak Afronding
```markdown
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Docs updated
- [ ] Status → Done (Sectie 4)
- [ ] Completion gelogd (Sectie 5)
- [ ] Dependencies unlocked
- [ ] Progress updated (Sectie 6)
- [ ] Completion gecommit
```

### Project Afronding
```markdown
- [ ] Alle taken Done
- [ ] Success criteria gehaald
- [ ] Final review 100%
- [ ] Retrospective geschreven
- [ ] Status → Completed
- [ ] Release tagged
- [ ] Project gearchiveerd
```

---

**Happy Managing! 🚀**

*Dit workflow systeem combineert het beste van Agile, Git Flow en Markdown documentatie voor een schaalbaar, transparant en effectief projectmanagement systeem.*

