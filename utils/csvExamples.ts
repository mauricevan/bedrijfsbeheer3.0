import { generateCSV, downloadCSV } from './csvParser';

const createHeaders = (keys: string[], labels: string[]) =>
  keys.map((key, i) => ({ key: key as any, label: labels[i] }));

export function downloadInventoryExampleCSV(): void {
  const data = [{
    naam: 'Staal Plaat 1000x1000mm', supplierSku: 'SP-1000', customSku: 'STAAL-001', locatie: 'Rek A1',
    hoeveelheid: '50', eenheid: 'stuk', minStock: '10', leverancier: 'Staal Groothandel BV',
    categorie: 'Metaal', verkoopprijs: '45.50', inkoopprijs: '30.00', notities: 'Standaard plaatmateriaal'
  }];
  const headers = createHeaders(
    ['naam', 'supplierSku', 'customSku', 'locatie', 'hoeveelheid', 'eenheid', 'minStock', 'leverancier', 'categorie', 'verkoopprijs', 'inkoopprijs', 'notities'],
    ['Naam', 'SKU Leverancier', 'Aangepaste SKU', 'Locatie', 'Hoeveelheid', 'Eenheid', 'Minimum Voorraad', 'Leverancier', 'Categorie', 'Verkoopprijs (€)', 'Inkoopprijs (€)', 'Notities']
  );
  downloadCSV(generateCSV(data, headers), 'voorbeeld_voorraad.csv');
}

export function downloadCustomerExampleCSV(): void {
  const data = [{
    naam: 'Jan de Vries', email: 'jan@example.com', telefoon: '0612345678', type: 'particulier',
    bedrijf: '', adres: 'Hoofdstraat 123', postcode: '1234AB', plaats: 'Amsterdam',
    herkomst: 'website', notities: 'Vaste klant sinds 2020'
  }];
  const headers = createHeaders(
    ['naam', 'email', 'telefoon', 'type', 'bedrijf', 'adres', 'postcode', 'plaats', 'herkomst', 'notities'],
    ['Naam', 'Email', 'Telefoon', 'Type (particulier/zakelijk)', 'Bedrijfsnaam', 'Adres', 'Postcode', 'Plaats', 'Herkomst', 'Notities']
  );
  downloadCSV(generateCSV(data, headers), 'voorbeeld_klanten.csv');
}

export function downloadEmployeeExampleCSV(): void {
  const data = [{
    naam: 'Peter Bakker', email: 'peter@bedrijf.nl', telefoon: '0612345678', functie: 'Lasser',
    wachtwoord: 'TempPass123!', isAdmin: 'nee', verlofdagen: '25', gebruikteVerlof: '0', beschikbaarheid: 'available'
  }];
  const headers = createHeaders(
    ['naam', 'email', 'telefoon', 'functie', 'wachtwoord', 'isAdmin', 'verlofdagen', 'gebruikteVerlof', 'beschikbaarheid'],
    ['Naam', 'Email', 'Telefoon', 'Functie', 'Wachtwoord (tijdelijk)', 'Admin (ja/nee)', 'Verlofdagen', 'Gebruikte Verlof', 'Beschikbaarheid']
  );
  downloadCSV(generateCSV(data, headers), 'voorbeeld_medewerkers.csv');
}

export function downloadWorkOrderExampleCSV(): void {
  const data = [{
    titel: 'Metalen Frame Lassen', klantNaam: 'Jan de Vries', beschrijving: 'Lassen van custom frame',
    geschatteUren: '8', prioriteit: 'normal', status: 'Planning', notes: 'Voor vrijdag klaar'
  }];
  const headers = createHeaders(
    ['titel', 'klantNaam', 'beschrijving', 'geschatteUren', 'prioriteit', 'status', 'notes'],
    ['Titel', 'Klant Naam', 'Beschrijving', 'Geschatte Uren', 'Prioriteit (low/normal/high/urgent)', 'Status', 'Notities']
  );
  downloadCSV(generateCSV(data, headers), 'voorbeeld_werkorders.csv');
}

export const CSV_EXAMPLES = {
  inventory: {
    filename: 'voorbeeld_voorraad.csv',
    description: 'Voorbeeld CSV voor bulk import van voorraad items',
    columns: ['Naam', 'SKU Leverancier', 'Aangepaste SKU', 'Locatie', 'Hoeveelheid', 'Eenheid', 'Minimum Voorraad', 'Leverancier', 'Categorie', 'Verkoopprijs', 'Inkoopprijs', 'Notities'],
  },
  customers: {
    filename: 'voorbeeld_klanten.csv',
    description: 'Voorbeeld CSV voor bulk import van klanten',
    columns: ['Naam', 'Email', 'Telefoon', 'Type', 'Bedrijfsnaam', 'Adres', 'Postcode', 'Plaats', 'Herkomst', 'Notities'],
  },
  employees: {
    filename: 'voorbeeld_medewerkers.csv',
    description: 'Voorbeeld CSV voor bulk import van medewerkers',
    columns: ['Naam', 'Email', 'Telefoon', 'Functie', 'Wachtwoord', 'Admin', 'Verlofdagen', 'Gebruikte Verlof', 'Beschikbaarheid'],
  },
  workOrders: {
    filename: 'voorbeeld_werkorders.csv',
    description: 'Voorbeeld CSV voor bulk import van werkorders',
    columns: ['Titel', 'Klant Naam', 'Beschrijving', 'Geschatte Uren', 'Prioriteit', 'Status', 'Notities'],
  },
};
