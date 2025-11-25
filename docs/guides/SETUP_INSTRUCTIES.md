# Setup Instructies - Bedrijfsbeheer 3.0

## Vereisten

Voordat je het project kunt starten, moet je het volgende geïnstalleerd hebben:

1. **Node.js** (versie 18 of hoger)
   - Download van: https://nodejs.org/
   - Controleer installatie: `node --version`
   - Controleer npm: `npm --version`

2. **Git** (als je het project nog niet hebt gekloond)
   - Download van: https://git-scm.com/

## Installatie Stappen

### 1. Clone het project (als je het nog niet hebt)

```bash
git clone git@github.com:mauricevan/bedrijfsbeheer3.0.git
cd bedrijfsbeheer3.0
```

### 2. Navigeer naar de Frontend folder

```bash
cd Frontend
```

### 3. Installeer dependencies

```bash
npm install
```

Dit kan een paar minuten duren. Dit installeert alle benodigde packages zoals React, TypeScript, Vite, Tailwind CSS, etc.

### 4. Start de development server

```bash
npm run dev
```

De applicatie start nu op `http://localhost:5173` (of een andere poort als 5173 bezet is).

### 5. Open de applicatie in je browser

Open je browser en ga naar: **http://localhost:5173**

## Login Gegevens

De applicatie heeft demo accounts:

**Admin:**
- Email: `admin@example.com`
- Wachtwoord: `admin123`

**Employee:**
- Email: `john@example.com`
- Wachtwoord: `john123`

Je kunt ook op de "Quick Login (Admin)" knop klikken op de login pagina.

## Beschikbare Commands

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview de productie build
- `npm run lint` - Run ESLint om code te controleren

## Troubleshooting

### Port 5173 is al in gebruik
Als poort 5173 al in gebruik is, zal Vite automatisch een andere poort kiezen. Check de terminal output voor de juiste URL.

### Dependencies installeren geeft errors
- Verwijder `node_modules` folder: `rm -rf node_modules` (Linux/Mac) of `rmdir /s node_modules` (Windows)
- Verwijder `package-lock.json`: `rm package-lock.json`
- Installeer opnieuw: `npm install`

### TypeScript errors
- Controleer of je de laatste versie van TypeScript hebt: `npm install -g typescript`
- Run `npm install` opnieuw om alle type definitions te installeren

## Project Structuur

```
Frontend/
├── src/
│   ├── components/      # Herbruikbare UI componenten
│   ├── features/       # Feature modules (Inventory, POS, Webshop, etc.)
│   ├── pages/          # Page componenten
│   ├── utils/          # Utility functies
│   └── main.tsx        # Entry point
├── public/             # Statische bestanden
└── package.json        # Dependencies en scripts
```

## Features

Het project bevat de volgende modules:
- 📦 Inventory Management
- 💰 POS (Point of Sale)
- 🛒 Webshop Beheer
- 📋 Work Orders
- 💼 Accounting
- 📊 Bookkeeping
- 👥 CRM
- 👔 HRM
- 📅 Planning
- 📈 Reports
- ⚙️ Settings

## Data Storage

De applicatie gebruikt **localStorage** voor data opslag. Dit betekent dat:
- Data wordt opgeslagen in je browser
- Data blijft behouden tussen sessies
- Data is lokaal op je computer (niet op een server)

## Support

Voor vragen of problemen, check de documentatie of maak een issue aan op GitHub.

