# Bedrijfsbeheer Dashboard - Documentatie

**Versie:** 5.8.0 (December 2024)
**Status:** Productie-ready met Email Integratie

---

## 👋 Welkom!

Dit is een volledig geïntegreerd bedrijfsbeheer systeem voor MKB in productie/assemblage. Kies jouw pad:

---

## 🎯 Kies Je Pad

### 🆕 **Ik ben nieuw hier** (5-10 min)
Start hier als je het systeem nog niet kent:

1. [📖 Quick Start](./01-getting-started/quick-start.md) (5 min)
2. [🔐 Login & Demo Accounts](./01-getting-started/demo-accounts.md) (2 min)
3. [📚 Modules Overzicht](./03-modules/README.md) (5 min)

**Next:** [Bekijk wat jouw rol kan doen →](./04-features/user-roles.md)

---

### 💻 **Ik ben een developer** (15-30 min)
Start hier als je gaat ontwikkelen:

1. [⚙️ Installatie](./01-getting-started/installation.md) (5 min)
2. [🏗️ Technical Stack](./02-architecture/technical-stack.md) (5 min) - React 19, TypeScript, Vite
3. [📝 Code Conventions](../CONVENTIONS.md) (5 min) - **VERPLICHT TE LEZEN**
4. [🤖 AI Guide](./AI_GUIDE.md) (10 min) - Voor AI-assisted development

**Next:** [Security Guide →](./02-architecture/security.md) | [State Management →](./02-architecture/state-management.md)

---

### 👤 **Ik ga het systeem gebruiken**
Kies je rol:

**Als Admin (Manager):**
1. [👥 User Roles & Rechten](./04-features/user-roles.md) - Wat kan ik allemaal?
2. [⚙️ Admin Settings](./03-modules/admin-settings.md) - Systeem configureren
3. [👨‍💼 HRM Module](./03-modules/hrm.md) - Medewerkers beheren
4. [🔧 Werkorder Workflow](./04-features/workorder-workflow.md) - Offerte → WO → Factuur

**Als User (Medewerker):**
1. [🔐 Inloggen](./01-getting-started/login-users.md)
2. [🔧 Werkorders](./03-modules/workorders.md) - Jouw taken
3. [📱 Mobile Guide](./04-features/mobile-optimization.md) - Werken op mobiel

---

## 📚 Volledige Documentatie

<details>
<summary><b>01. Getting Started</b> - Installatie & Setup</summary>

- [Installation](./01-getting-started/installation.md)
- [Quick Start](./01-getting-started/quick-start.md)
- [Demo Accounts](./01-getting-started/demo-accounts.md)
- [Login & Users](./01-getting-started/login-users.md)

</details>

<details>
<summary><b>02. Architecture</b> - Technische Architectuur</summary>

- [Technical Stack](./02-architecture/technical-stack.md) - React 19, TypeScript, Vite 6
- [File Structure](./02-architecture/file-structure.md)
- [State Management](./02-architecture/state-management.md)
- [Security](./02-architecture/security.md) ⚠️ **CRITICAL**

</details>

<details>
<summary><b>03. Modules</b> - 12 Bedrijfsmodules</summary>

- [Overview](./03-modules/README.md)
- [Dashboard](./03-modules/dashboard.md) - Email Drop Zone (V5.8)
- [Voorraadbeheer](./03-modules/inventory.md) - 3 SKU types
- [Werkorders](./03-modules/workorders.md) - Kanban workboard
- [Boekhouding](./03-modules/accounting.md) - Offertes & Facturen
- [CRM](./03-modules/crm.md) - Klantenbeheer
- [HRM](./03-modules/hrm.md) - Personeelsbeheer
- [POS](./03-modules/pos.md) - Kassasysteem
- [Planning](./03-modules/planning.md) - Agenda
- [Reports](./03-modules/reports.md) - Rapportages
- [Webshop](./03-modules/webshop.md)
- [Admin Settings](./03-modules/admin-settings.md)
- [Notifications](./03-modules/notifications.md)

</details>

<details>
<summary><b>04. Features</b> - Belangrijke Functionaliteiten</summary>

#### Functionaliteit
- [User Roles](./04-features/user-roles.md) - Admin vs User rechten
- [Email Integration](./04-features/email-integration.md) - Drag & drop (V5.8)
- [Workorder Workflow](./04-features/workorder-workflow.md) - End-to-end
- [Mobile Optimization](./04-features/mobile-optimization.md)
- [Notifications](./04-features/notifications.md)

#### Visual Design 🎨 **NIEUW**
- [Visual Design Guide](./04-features/visual-design-guide.md) - Design filosofie & principes
- [Brand Identity](./04-features/brand-identity.md) - Kleuren, typography, iconografie
- [Component Visual Patterns](./04-features/component-visual-patterns.md) - Styling per component
- [Design Quick Wins](./04-features/design-quick-wins.md) - 5 snelle verbeteringen (1-2 uur)
- [Design Implementation Checklist](./04-features/design-implementation-checklist.md) - QA checklist

</details>

<details>
<summary><b>05. API</b> - Backend Integratie (Toekomstig)</summary>

- [API Overview](./05-api/README.md)
- [Mock Server](./05-api/mock-server.md)

</details>

<details>
<summary><b>06. Changelog</b> - Versiegeschiedenis</summary>

- [Overview](./06-changelog/README.md)
- [Version 5.x](./06-changelog/v5.x.md) - Email, Categorieën
- [Version 4.x](./06-changelog/v4.x.md) - Werkorder Integratie
- [Older Versions](./06-changelog/README.md)

</details>

---

## 🗺️ Visual Roadmap

```
START HERE
    │
    ├─ 🆕 NEW USER ────→ Quick Start ─→ Demo Login ─→ Modules Overview
    │
    ├─ 💻 DEVELOPER ───→ Install ─→ Conventions ─→ AI Guide ─→ Security
    │                     │
    │                     └─→ Multi-Agent? ─→ Workflow Docs
    │
    └─ 👤 END USER ────→ Login ─→ User Roles ─→ Module Training
                          │
                          ├─ Admin Path ──→ Admin Settings ─→ HRM
                          │
                          └─ User Path ───→ Werkorders ─→ Mobile Guide
```

---

## 🎯 Quick Links

| Category | Link | Beschrijving |
|----------|------|--------------|
| 🚀 **Start** | [Quick Start](./01-getting-started/quick-start.md) | Begin binnen 5 minuten |
| 📝 **Code** | [Conventions](../CONVENTIONS.md) | Code style & patterns |
| 🤖 **AI** | [AI Guide](./AI_GUIDE.md) | Voor AI assistents |
| 🔒 **Security** | [Security](./02-architecture/security.md) | Security best practices |
| 👥 **Roles** | [User Roles](./04-features/user-roles.md) | Rechten matrix |
| 📱 **Mobile** | [Mobile Guide](./04-features/mobile-optimization.md) | Touch-optimized |
| 🔄 **Changelog** | [Version History](./06-changelog/README.md) | Alle releases |

---

## 💡 Veelgestelde Vragen

**Q: Waar begin ik als nieuwe developer?**
A: [Installation](./01-getting-started/installation.md) → [CONVENTIONS.md](../CONVENTIONS.md) → [AI_GUIDE.md](./AI_GUIDE.md)

**Q: Wat zijn de security risico's?**
A: Check [Security](./02-architecture/security.md) voor alle beveiligingsmaatregelen

**Q: Welke rechten heeft mijn rol?**
A: Zie [User Roles](./04-features/user-roles.md) voor complete matrix

**Q: Hoe gebruik ik dit op mobiel?**
A: Bekijk [Mobile Optimization](./04-features/mobile-optimization.md)

---

## 📞 Support

- 🐛 **Bug?** → Open een issue in repository
- ❓ **Vraag?** → Check docs of contacteer team
- 💡 **Feature request?** → Open een feature issue

---

## 📄 Project Info

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4
**State Management:** React Hooks, Centralized state
**Modules:** 12 bedrijfsmodules
**Rollen:** Admin (volledige rechten) & User (beperkte rechten)

---

**Laatste update:** Januari 2025
**Documentatie versie:** 2.0.0
**Systeem versie:** 5.8.0

**Veel succes! 🚀**
