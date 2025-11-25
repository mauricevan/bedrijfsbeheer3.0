# Disciplinair Dossier Module

## Overzicht

De Disciplinair Dossier module is een uitgebreide oplossing voor het beheren van medewerker incidenten, waarschuwingen en verbeterplannen binnen het HRM-systeem. Deze module biedt een gestructureerde manier om disciplinaire zaken te documenteren, te volgen en te rapporteren.

## Functionaliteit

### 1. Incidenten Beheer
- **Incident Registratie**: Volledige documentatie van incidenten met datum, tijd, type, ernst en beschrijving
- **Getuigen**: Mogelijkheid om meerdere getuigen aan een incident te koppelen
- **Bijlagen**: Upload van documenten, foto's en andere bewijsmateriaal
- **Status Tracking**: Volg de status van incidenten (Open, In behandeling, Afgerond)
- **Incident Types**:
  - Te laat komen
  - Niet komen opdagen
  - Ongepast gedrag
  - Niet nakomen afspraken
  - Veiligheidsovertreding
  - Beleidsovertreding
  - Prestatie probleem
  - Overig

### 2. Waarschuwingen
- **Formele Waarschuwingen**: Mondeling, Schriftelijk, of Laatste waarschuwing
- **Geldigheidsperiode**: Optionele einddatum voor waarschuwingen
- **Koppeling aan Incidenten**: Link waarschuwingen aan specifieke incidenten
- **Digitale Ondertekening**: Registratie van medewerker ondertekening met datum en opmerkingen
- **Bijlagen**: Upload van ondertekende documenten

### 3. Verbeterplannen
- **Doelstellingen**: Definieer specifieke verbeterdoelen
- **Voortgang Tracking**: Monitor voortgang met percentage indicator
- **Tijdlijn**: Start- en einddatum voor verbeterplannen
- **Status**: Actief, Afgerond, of Geannuleerd

### 4. Tijdlijn Weergave
- Chronologische weergave van alle gebeurtenissen
- Visuele indicatoren voor verschillende event types
- Volledige details per gebeurtenis
- Download functionaliteit voor bijlagen

### 5. Zoeken en Filteren
- Zoeken in incident beschrijvingen
- Filteren op type, ernst en status
- Chronologische sortering (nieuwste eerst)

### 6. Export Functionaliteit
- PDF export van volledige dossier (placeholder voor backend implementatie)
- Inclusief logo en datum

## Technische Implementatie

### Bestanden Structuur

```
features/hrm/
├── types/
│   └── hrm.types.ts              # Type definities voor Incident, Warning, ImprovementPlan
├── utils/
│   ├── disciplinaryUtils.ts      # Labels, kleuren, formattering
│   └── disciplinaryValidation.ts # Validatie functies
├── hooks/
│   └── useDisciplinaryDossier.ts # CRUD operaties en state management
├── components/
│   ├── IncidentForm.tsx          # Formulier voor incident registratie
│   ├── WarningForm.tsx           # Formulier voor waarschuwingen
│   ├── DisciplinaryTimeline.tsx  # Tijdlijn weergave
│   ├── DisciplinaryDossierTab.tsx # Hoofd component met tabs en filters
│   └── EmployeeDossier.tsx       # Integratie in bestaand dossier
└── pages/
    └── HRMPage.tsx               # Integratie in HRM module
```

### Data Opslag

De module gebruikt `localStorage` voor data persistentie met de volgende keys:
- `hrm_incidents`: Array van alle incidenten
- `hrm_warnings`: Array van alle waarschuwingen
- `hrm_improvement_plans`: Array van alle verbeterplannen

### Type Definities

#### Incident
```typescript
interface Incident {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  witnesses: string[];
  attachments: IncidentAttachment[];
  createdBy: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}
```

#### Warning
```typescript
interface Warning {
  id: string;
  employeeId: string;
  incidentId?: string;
  type: WarningType;
  date: string;
  validUntil?: string;
  reason: string;
  fullText: string;
  signedByEmployee: boolean;
  employeeSignatureDate?: string;
  employeeComments?: string;
  attachments: IncidentAttachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## Gebruik

### Incident Toevoegen

1. Navigeer naar HRM module
2. Open een medewerker dossier
3. Selecteer "Disciplinair Dossier" tab
4. Klik op "Incident Toevoegen"
5. Vul het formulier in met alle relevante informatie
6. Upload eventuele bijlagen
7. Selecteer getuigen indien van toepassing
8. Sla op

### Waarschuwing Toevoegen

1. Open het disciplinair dossier van een medewerker
2. Klik op "Waarschuwing Toevoegen"
3. Selecteer type waarschuwing
4. Koppel optioneel aan een bestaand incident
5. Vul reden en volledige tekst in
6. Registreer ondertekening indien van toepassing
7. Upload ondertekend document
8. Sla op

### Dossier Bekijken

Het disciplinair dossier biedt drie weergaven:
- **Tijdlijn**: Chronologische weergave van alle gebeurtenissen
- **Incidenten**: Gefilterde lijst van incidenten
- **Waarschuwingen**: Lijst van alle waarschuwingen

## Rechten en Beveiliging

**Belangrijk**: In de huidige implementatie is er nog geen volledige rechten controle geïmplementeerd. Voor productie gebruik moet dit worden uitgebreid met:

- Alleen HR en directe leidinggevenden mogen incidenten en waarschuwingen toevoegen/bekijken
- Medewerkers kunnen optioneel alleen hun eigen waarschuwingen zien
- Audit trail voor alle wijzigingen
- Encryptie van gevoelige informatie

## Toekomstige Uitbreidingen

### Backend Integratie
- Database opslag in plaats van localStorage
- API endpoints voor CRUD operaties
- File upload naar server
- PDF generatie op server

### Notificaties
- E-mail notificaties naar HR en leidinggevende bij nieuwe incidenten
- Herinneringen voor vervaldatums van waarschuwingen
- Notificaties bij voortgang van verbeterplannen

### Rapportage
- Dashboard met statistieken
- Trend analyse
- Export naar Excel
- Automatische rapporten

### Verbeterplannen
- Volledige implementatie van verbeterplan functionaliteit
- Mijlpalen en checkpoints
- Automatische voortgang tracking
- Integratie met performance reviews

## Validatie

De module bevat uitgebreide validatie:
- Verplichte velden worden gecontroleerd
- Datums worden gevalideerd (bijv. geldig tot moet na datum zijn)
- Bestandsgrootte max 10MB
- Toegestane bestandstypes: PDF, afbeeldingen, Word documenten
- Minimum lengte voor beschrijvingen en teksten

## Styling

De module volgt het bestaande design system:
- Dark mode support
- Responsive design
- Consistente kleuren voor ernst niveaus:
  - Laag: Blauw
  - Middel: Amber
  - Hoog: Oranje
  - Zeer ernstig: Rood
- Visuele indicatoren voor status

## Performance

De module is geoptimaliseerd voor performance:
- `useMemo` voor gefilterde lijsten
- `useCallback` voor event handlers
- Lazy loading van bijlagen
- Efficiënte re-render preventie

## Toegankelijkheid

- Semantische HTML
- ARIA labels waar nodig
- Keyboard navigatie support
- Screen reader vriendelijk
- Hoog contrast kleuren

## Browser Compatibiliteit

Getest en ondersteund in:
- Chrome (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Edge (laatste 2 versies)

## Licentie

Dit is onderdeel van het Bedrijfsbeheer Dashboard 2.0 project.
