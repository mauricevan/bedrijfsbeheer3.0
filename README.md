# Bedrijfsbeheer Dashboard

Een volledig geïntegreerd dashboard/backend-systeem waarmee de eigenaar alle bedrijfsprocessen kan overzien en regelen, en medewerkers alle tools hebben die nodig zijn om hun taken efficiënt uit te voeren.

---

## 📁 Project Structuur

```
Google_ai_test/
├── Frontend/              # Hoofdapplicatie (React + TypeScript + Vite)
│   ├── src/
│   │   ├── features/      # Feature-based modules (accounting, crm, hrm, etc.)
│   │   ├── components/    # Herbruikbare UI componenten
│   │   ├── layouts/       # Layout componenten
│   │   ├── pages/         # Page componenten
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functies
│   │   └── styles/         # CSS styles
│   ├── public/            # Statische assets
│   └── package.json       # Frontend dependencies
├── docs/                  # Documentatie
│   ├── architecture/     # Architectuur documenten
│   ├── guides/            # Handleidingen en setup instructies
│   ├── reports/           # Status rapporten en analyses
│   └── requirements/      # Product Requirements Document (PRD)
├── server/                # Mock API server voor ontwikkeling
│   └── mock-api.js        # Express mock API
├── public/                # Root-level public assets
└── README.md              # Dit bestand
```

---

## 📋 Inhoudsopgave

- [Algemeen](#algemeen)
- [Installatie](#installatie)
- [Login & Gebruikers](#login--gebruikers)
- [Modules & Functionaliteiten](#modules--functionaliteiten)
- [Gebruikersrollen](#gebruikersrollen)
- [Belangrijke Features](#belangrijke-features)
- [Technische Stack](#technische-stack)
- [Documentatie](#documentatie)
- [Toekomstige Ontwikkelingen](#toekomstige-ontwikkelingen)

---

## 🎯 Algemeen

### Projectdoel

Een dashboard/backend-systeem waarmee de eigenaar alle bedrijfsprocessen kan overzien en regelen, en medewerkers alle tools hebben die nodig zijn om hun taken efficiënt uit te voeren.

### Gebruikerstypes / Rollen

- **Admin** (Manager Productie): Volledige toegang, modules in- en uitschakelen, rechten beheren, alle werkorders overzien
- **User / Medewerker**: Toegang afhankelijk van rol, persoonlijk workboard met eigen taken, kan taken van collega's bekijken

---

## 🚀 Installatie

### Vereisten

- Node.js (v18 of hoger)
- npm of yarn

### Stappen

1. **Clone of download het project**

   ```bash
   cd "D:\code projects\Google_ai_test"
   ```

2. **Installeer dependencies**

   ```bash
   cd Frontend
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Applicatie draait op: `http://localhost:5173`
   - Login met één van de demo accounts (zie hieronder)

### Build voor productie

```bash
cd Frontend
npm run build
npm run preview
```

### Mock API Server (Optioneel)

Voor ontwikkeling met mock API:

```bash
node server/mock-api.js
```

De server draait op `http://localhost:3001`

---

## 🔐 Login & Gebruikers

### Demo Accounts

Het systeem heeft een volledig werkend login systeem met 4 test accounts:

| Naam           | Email             | Rol                 | Admin  | Wachtwoord |
| -------------- | ----------------- | ------------------- | ------ | ---------- |
| Sophie van Dam | sophie@bedrijf.nl | Manager Productie   | ✅ Ja  | 1234       |
| Jan de Vries   | jan@bedrijf.nl    | Productiemedewerker | ❌ Nee | 1234       |
| Maria Jansen   | maria@bedrijf.nl  | Lasser              | ❌ Nee | 1234       |
| Peter Bakker   | peter@bedrijf.nl  | Spuiter             | ❌ Nee | 1234       |

### Login Features

- ✅ Email + wachtwoord authenticatie
- ✅ Quick login knoppen voor snelle demo toegang
- ✅ Modern login scherm met gradient achtergrond
- ✅ Automatische rol detectie (admin/user)
- ✅ Veilige logout functionaliteit
- ✅ Gebruiker info in header met avatar

---

## 🔧 Modules & Functionaliteiten

### 1. **Dashboard / Overzicht**

- Real-time overzicht van alle belangrijke metrics
- Email integratie met drag-and-drop support
- Snelle acties en shortcuts
- Personalisatie opties

### 2. **Accounting (Facturering)**

- Quote-to-Invoice workflow
- Automatische factuurnummer generatie
- BTW berekeningen
- Payment tracking

### 3. **CRM (Customer Relationship Management)**

- Klantbeheer
- Lead management
- Interactie tracking
- Task management

### 4. **HRM (Human Resource Management)**

- Medewerkerbeheer
- Disciplinair dossier systeem
- Salaris administratie
- Rechtenbeheer

### 5. **Inventory (Voorraad)**

- Productbeheer
- Categorieën
- BTW overzicht
- Voorraad tracking

### 6. **Work Orders (Werkorders)**

- Kanban board view
- Workboard (persoonlijk dashboard)
- Status tracking
- Material tracking

### 7. **POS (Point of Sale)**

- Snelle verkoop interface
- Winkelwagen functionaliteit
- Betalingsmethoden
- Receipt generatie

### 8. **Webshop**

- Product catalogus
- Categorieën
- Varianten beheer
- Order management

### 9. **Planning**

- Kalender view
- Event management
- Resource planning

### 10. **Bookkeeping (Boekhouding)**

- Journal entries
- Ledger accounts
- Financial reporting

### 11. **Reports**

- Uitgebreide rapportage
- Export functionaliteit
- Custom filters

---

## 👥 Gebruikersrollen

### Admin (Manager Productie)

- Volledige toegang tot alle modules
- Module in-/uitschakelen
- Rechten beheren
- Alle werkorders overzien
- Analytics dashboard

### User / Medewerker

- Toegang afhankelijk van rol
- Persoonlijk workboard
- Eigen taken beheren
- Collega's taken bekijken (read-only)

---

## ⭐ Belangrijke Features

- ✅ **Feature-based architectuur** - Modulaire code organisatie
- ✅ **TypeScript** - Type-safe development
- ✅ **React 19** - Moderne React features
- ✅ **Vite** - Snelle build tooling
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Responsive design** - Mobile-first approach
- ✅ **Email integratie** - Drag-and-drop email parsing
- ✅ **Workflow validatie** - Quote-to-Invoice-to-WorkOrder
- ✅ **Analytics tracking** - Gebruikersactiviteit tracking
- ✅ **Mock API** - Development server

---

## 🛠 Technische Stack

### Frontend

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4
- **React Router** 7.9.6
- **Tailwind CSS** 4.1.17
- **Recharts** 3.4.1 (voor grafieken)
- **Lucide React** (iconen)

### Development Tools

- **ESLint** - Code linting
- **Vitest** - Testing framework
- **TypeScript** - Type checking

### Backend (Mock)

- **Express** - Mock API server
- **CORS** - Cross-origin support

---

## 📚 Documentatie

Alle documentatie is georganiseerd in de `docs/` folder:

- **Architecture** (`docs/architecture/`) - Architectuur documenten en workflow analyses
- **Guides** (`docs/guides/`) - Handleidingen, setup instructies en implementatie guides
- **Reports** (`docs/reports/`) - Status rapporten, feedback en analyses
- **Requirements** (`docs/requirements/`) - Product Requirements Document (PRD)

### Belangrijke Documenten

- [PRD](docs/requirements/prd.md) - Product Requirements Document
- [Workflow Analysis](docs/architecture/WORKFLOW_ANALYSIS.md) - Uitgebreide workflow analyse
- [Quick Start Guide](docs/guides/QUICK_START_GUIDE.md) - Snelle start handleiding
- [Setup Instructies](docs/guides/SETUP_INSTRUCTIES.md) - Installatie instructies

---

## 🔮 Toekomstige Ontwikkelingen

- [ ] Echte backend integratie (vervanging van mock API)
- [ ] Database integratie (PostgreSQL/SQLite)
- [ ] Real-time updates (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Export functionaliteit (PDF, Excel)
- [ ] Multi-tenant support
- [ ] API documentatie (OpenAPI/Swagger)

---

## 📝 Licentie

Dit project is privé en niet openbaar beschikbaar.

---

## 👨‍💻 Ontwikkeling

### Development Workflow

1. Maak een nieuwe feature branch
2. Werk aan de feature in `Frontend/src/features/[feature-name]/`
3. Test lokaal met `npm run dev`
4. Commit en push changes

### Code Structuur

- **Features** zijn georganiseerd in `Frontend/src/features/[feature-name]/`
- Elke feature heeft zijn eigen `components/`, `hooks/`, `services/`, `types/`, en `utils/`
- Herbruikbare componenten staan in `Frontend/src/components/common/`
- Layouts staan in `Frontend/src/layouts/`

---

**Laatste update:** Januari 2025
