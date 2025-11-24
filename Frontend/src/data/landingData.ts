import type { Service, Testimonial, ProductDetail } from '@/types/landingTypes';

export const SERVICES: Service[] = [
  {
    id: '1',
    slug: 'autosleutels',
    title: 'Autosleutels',
    shortDescription: 'Programmeren en leveren van autosleutels.',
    fullDescription: 'Is uw autosleutel kwijt of defect? BTD BeveiligingsTechniek Dordrecht kan voor vrijwel alle automerken nieuwe sleutels leveren en programmeren. Wij beschikken over geavanceerde apparatuur om transpondersleutels en afstandsbedieningen in te leren op uw voertuig. Dit is vaak aanzienlijk voordeliger dan bij de merkdealer.',
    icon: 'Car',
    features: ['Transponder sleutels', 'Afstandsbedieningen', 'Sleutelbehuizing vervangen', 'Klaar terwijl u wacht (op afspraak)'],
    image: 'https://images.unsplash.com/photo-1626073747734-7738f6b15800?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    slug: 'sleutels',
    title: 'Sleutels',
    shortDescription: 'Meer dan 8000 soorten sleutels direct leverbaar.',
    fullDescription: 'Met meer dan 43 jaar ervaring en een voorraad van 8000+ soorten sleutels, zijn wij dé specialist in de regio. Van huissleutels en fietssleutels tot antieke sleutels en kluissleutels. Wij maken gebruik van computergestuurde sleutelmachines voor de hoogste precisie.',
    icon: 'Key',
    features: ['Huissleutels', 'Certificaatsleutels', 'Kluissleutels', 'Direct klaar service'],
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2098&auto=format&fit=crop'
  },
  {
    id: '3',
    slug: 'sloten',
    title: 'Sloten & Cilinders',
    shortDescription: 'Hoogwaardige mechanische beveiliging (SKG** / SKG***).',
    fullDescription: 'Wij leveren en monteren een breed scala aan sloten en cilinders. Van insteeksloten en oplegsloten tot meerpuntssluitingen. Wij zijn dealer van topmerken zoals Nemef, Lips, Cisa, en Dorma. Voor maximale veiligheid adviseren wij SKG3*** goedgekeurde producten met kerntrekbeveiliging.',
    icon: 'Lock',
    features: ['SKG Keurmerk', 'Kerntrekbeveiliging', 'Meerpuntssluitingen', 'Deurdrangers'],
    image: 'https://images.unsplash.com/photo-1558002038-109177381792?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '4',
    slug: 'sluitsystemen',
    title: 'Sluitsystemen',
    shortDescription: 'Complexe sluitplannen voor bedrijven en VvE\'s.',
    fullDescription: 'Beheer de toegang tot uw pand efficiënt met een sluitsysteem. Of het nu gaat om een hoofdsleutelsysteem voor een kantoorpand of een centraal systeem voor een appartementencomplex, wij ontwerpen, assembleren en beheren het volledige plan in eigen huis. Wij werken o.a. met DOM, Mul-T-Lock en Pfaffenhain.',
    icon: 'Network',
    features: ['Gelijksluitende sets', 'Hoofdsleutelsystemen', 'Certificaatbeheer', 'Snelle nalevering'],
    image: 'https://images.unsplash.com/photo-1517488970477-9c98a58f4c71?q=80&w=2069&auto=format&fit=crop'
  }
];

export const CERTIFICATIONS = [
  { name: "VEB Erkend", description: "Vereniging Erkende Beveiligingsbedrijven", icon: "ShieldCheck" },
  { name: "Politiekeurmerk", description: "Veilig Wonen Expert", icon: "Award" },
  { name: "SKG Gecertificeerd", description: "Kwaliteit & Veiligheid", icon: "Lock" },
  { name: "Erkend Leerbedrijf", description: "SBB Gecertificeerd", icon: "GraduationCap" }
];

export const BUSINESS_VALUES = [
  {
    title: "Continuïteit & Zekerheid",
    description: "Met 43 jaar ervaring bieden wij de operationele stabiliteit die enterprise-omgevingen vereisen.",
    icon: "Building2"
  },
  {
    title: "Gecertificeerde Kwaliteit",
    description: "Al onze installaties voldoen aan de strengste VRKI-richtlijnen en verzekeringseisen.",
    icon: "FileCheck"
  },
  {
    title: "24/7 Service Level",
    description: "Onze eigen technische dienst staat dag en nacht paraat voor calamiteiten en onderhoud.",
    icon: "Clock"
  }
];

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  tedee: {
    id: 'tedee',
    brand: 'Tedee',
    title: 'Het kleinste slimme slot ter wereld',
    subtitle: 'Strak design, geruisloze werking en ongekende prestaties.',
    description: 'Tedee PRO verandert uw smartphone in een sleutel. Dankzij het unieke aluminium ontwerp en de krachtige batterij is dit slot niet alleen het mooiste, maar ook het krachtigste in zijn klasse.',
    fullDescription: [
      "Tedee PRO is een staaltje van technologische perfectie. Het slot is volledig gemaakt van aluminium, wat zorgt voor een robuuste en premium uitstraling die op geen enkele deur misstaat.",
      "In tegenstelling tot veel andere slimme sloten is Tedee fluisterstil. U hoort nauwelijks dat de deur voor u wordt geopend. De ingebouwde accu gaat tot wel 14 maanden mee op één lading en is eenvoudig op te laden via een magnetische kabel.",
      "Met de 'Auto-Unlock' functie opent uw deur automatisch wanneer u aan komt lopen. Handig als u uw handen vol heeft met boodschappen. Via de app deelt u eenvoudig digitale sleutels met familie, vrienden of de schoonmaakster, permanent of tijdelijk."
    ],
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1035/tedee_pro.jpg',
    heroImage: 'https://tedee.com/wp-content/uploads/2020/12/tedee_lock_in_hand.jpg',
    features: [
      {
        title: 'Klein & Stijlvol',
        description: 'Met een diameter van slechts 45mm is Tedee het kleinste slimme slot op de markt.',
        icon: 'Minimize'
      },
      {
        title: 'Fluisterstil',
        description: 'Geniet van de stilte. De motor is zo ontworpen dat hij nauwelijks hoorbaar is.',
        icon: 'VolumeX'
      },
      {
        title: 'Auto-Unlock',
        description: 'De deur opent automatisch zodra u in de buurt komt met uw smartphone.',
        icon: 'Unlock'
      },
      {
        title: 'Lange Batterijduur',
        description: 'De LiPo accu gaat tot 14 maanden mee en is oplaadbaar.',
        icon: 'Battery'
      }
    ],
    specs: [
      { label: 'Materiaal', value: 'Geanodiseerd Aluminium' },
      { label: 'Diameter', value: '45 mm' },
      { label: 'Lengte', value: '55 mm' },
      { label: 'Gewicht', value: '196 g' },
      { label: 'Connectiviteit', value: 'Bluetooth 5.0' },
      { label: 'Accu', value: '3000 mAh LiPo' },
      { label: 'Compatibiliteit', value: 'Euro-profiel cilinders' }
    ],
    theme: {
      primary: '#1e293b',
      secondary: '#64748b',
      gradient: 'bg-gradient-to-br from-slate-100 via-white to-slate-200',
      accent: 'bg-slate-900 text-white hover:bg-slate-800'
    }
  },
  tapkey: {
    id: 'tapkey',
    brand: 'Tapkey',
    title: 'Mobiele toegang voor iedereen',
    subtitle: 'Eenvoudig, veilig en schaalbaar. Uw smartphone is de sleutel.',
    description: 'Het Tapkey platform maakt toegangsbeheer kinderspel. Of het nu gaat om uw voordeur, kantoor of een gedeelde ruimte; met Tapkey beheert u alles vanuit één app.',
    fullDescription: [
      "Tapkey werkt op basis van een open platform dat naadloos integreert met hoogwaardige hardware van partners zoals DOM. Dit betekent dat u de zekerheid heeft van topkwaliteit hang- en sluitwerk, gecombineerd met de flexibiliteit van moderne software.",
      "Het beheer van sleutels was nog nooit zo eenvoudig. Via de Tapkey app of het webportaal verleent u direct toegang aan gebruikers. U bepaalt wie, waar en wanneer naar binnen mag. Sleutel kwijt? Geen probleem, u trekt de rechten direct in.",
      "Het systeem werkt via NFC en Bluetooth (BLE), waardoor het ook zonder actieve internetverbinding aan de deur functioneert. Dit maakt het systeem uiterst betrouwbaar en veilig."
    ],
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1220/tapkey.png',
    heroImage: 'https://www.dom-security.com/assets/images/header/header-dom-tapkey-easymobileaccess.jpg',
    features: [
      {
        title: 'Smartphone Key',
        description: 'Open deuren met uw Android telefoon (NFC) of iPhone (Bluetooth).',
        icon: 'Smartphone'
      },
      {
        title: 'Eenvoudig Beheer',
        description: 'Verstuur digitale sleutels (Smart Keys) eenvoudig via e-mail of SMS.',
        icon: 'Users'
      },
      {
        title: 'Werkt Offline',
        description: 'Geen internetverbinding nodig bij het slot voor het openen van de deur.',
        icon: 'WifiOff'
      },
      {
        title: 'Groot Assortiment',
        description: 'Beschikbaar als cilinder, deurbeslag, hangslot en meubelslot.',
        icon: 'Grid'
      }
    ],
    specs: [
      { label: 'Technologie', value: 'NFC & Bluetooth Low Energy (BLE)' },
      { label: 'Platform', value: 'Android & iOS' },
      { label: 'Hardware', value: 'DOM Tapkey (SKG***)' },
      { label: 'Beheer', value: 'App & Webportal' },
      { label: 'Gebruikers', value: 'Ongelimiteerd' },
      { label: 'Tags', value: 'Ondersteunt Tapkey Tags & Stickers' }
    ],
    theme: {
      primary: '#dc2626', // Red 600
      secondary: '#1f2937', // Gray 800
      gradient: 'bg-gradient-to-br from-white via-red-50/30 to-white',
      accent: 'bg-black text-white hover:bg-slate-800'
    }
  },
  iseo: {
    id: 'iseo',
    brand: 'Iseo',
    title: 'Iseo Libra: Intelligente Toegang',
    subtitle: 'De veelzijdige elektronische cilinder voor zwaar gebruik en flexibel beheer.',
    description: 'De Iseo Libra Smart is een innovatief toegangscontrolesysteem, volledig geïntegreerd in een elektronische cilinder. Ideaal voor zowel woningen als commerciële gebouwen.',
    fullDescription: [
      "De Iseo Libra Smart cilinder is een toonbeeld van Italiaans design gecombineerd met robuuste beveiligingstechniek. De cilinder is modulair opgebouwd, wat betekent dat hij eenvoudig kan worden aangepast aan verschillende deurdiktes.",
      "Met de Argo App van Iseo kunt u eenvoudig rechten beheren zonder dat u software op een PC nodig heeft of een internetverbinding. U kunt deuren openen met smartphones (iOS en Android), kaarten (Mifare), en tags.",
      "Het systeem is ontworpen voor intensief gebruik en beschikt over een Heavy Duty uitvoering die vandaalbestendig en weerbestendig (IP66) is. Dit maakt de Iseo Libra uitstekend geschikt voor buitendeuren, poorten en gemeenschappelijke entrees."
    ],
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1203/iseo_libra_le60.jpg',
    heroImage: 'https://www.iseo.com/files/iseo_products/libra/libra_smart/LIBRA_Smart_ambientata_01.jpg',
    features: [
      {
        title: 'Meerdere openingswijzen',
        description: 'Smartphone, Apple Watch, Mifare Kaarten, Tags en PIN-code.',
        icon: 'Layers'
      },
      {
        title: 'Modulair Ontwerp',
        description: 'Eenvoudig aan te passen aan elke deurdikte, ook achteraf.',
        icon: 'Settings'
      },
      {
        title: 'Argo App',
        description: 'Beheer toegangsrechten direct via Bluetooth, zonder cloud abonnement.',
        icon: 'Bluetooth'
      },
      {
        title: 'Heavy Duty',
        description: 'IP66 waterbestendig en SKG*** inbraakwerendheid.',
        icon: 'Shield'
      }
    ],
    specs: [
      { label: 'Certificering', value: 'SKG***' },
      { label: 'Bescherming', value: 'IP66 (Heavy Duty versie)' },
      { label: 'Batterij', value: '1/2 AA 3.6V (c.a. 3 jaar)' },
      { label: 'Frequentie', value: '13,56 MHz (Mifare) & Bluetooth 5.0' },
      { label: 'Afwerking', value: 'RVS / Zwart / Gepolijst' },
      { label: 'Wake-up', value: 'Automatisch bij aanbieden kaart/telefoon' }
    ],
    theme: {
      primary: '#ef4444',
      secondary: '#f87171',
      gradient: 'bg-gradient-to-br from-slate-50 to-red-50/30',
      accent: 'bg-red-600 text-white hover:bg-red-700'
    }
  }
};

export const FEATURED_PRODUCTS = [
  {
    id: 'plura',
    title: 'DOM Plura Platform',
    description: 'Het ideale instapmodel. Dubbele profielcilinder, uitermate geschikt voor o.a. voordeur, achterdeur en schuurdeur. Leverbaar in SKG2 en SKG3.',
    fullDescription: 'Wanneer je een profielcilinder wenst die bestand is tegen de meest voorkomende inbraaktechnieken en je geen aanvullende eisen aan de sleuteltechniek stelt, dan is het Plura platform het ideale instapmodel. De dubbele profielcilinder is uitermate geschikt voor o.a. jouw voordeur, achterdeur en schuurdeur. Leverbaar in SKG2 en SKG3 en ook onderling te combineren. Wij configureren en assembleren dit systeem in eigen huis en beschikken tevens over vele pasklare aanvullende oplossingen.',
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1088/dom_plura_skg3.350x350.jpg',
    features: ['SKG2 & SKG3', 'Instapmodel', 'Gelijksluitend leverbaar', 'Eén sleutel voor alles'],
    link: '/services/sloten'
  },
  {
    id: 'sirius',
    title: 'DOM rs Sirius Platform',
    description: 'De veiligheidscilinder met ingebouwde kopieerveiligheid. Alleen te kopiëren met certificaat.',
    fullDescription: 'De rs Sirius is de veiligheidscilinder voor iedereen die op zoek is naar hoogwaardige beveiliging tegen een betaalbare prijs. De sleutel is ontworpen met een ingebouwde kopieerveiligheid om ervoor te zorgen dat hij alleen na overleg van bijgeleverd sleutelcertificaat kan worden gekopieerd. Ontworpen als hoofdsleutelsysteem met een extra lange sleutelhals is de cilinder zeer geschikt voor gebruik met veiligheidsbeslag.',
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1090/dom_sirius_skg3.350x350.jpg',
    features: ['Kopieerveiligheid', 'Met Certificaat', 'Extra lange sleutelhals', 'Modulair systeem'],
    link: '/services/sluitsystemen'
  },
  {
    id: 'teco',
    title: 'DOM ix Teco Platform',
    description: 'Keersleutelsysteem met gepatenteerde rib. Maximale beveiliging tegen ongeoorloofd kopiëren.',
    fullDescription: 'De sleutel van het keersleutelsysteem ix Teco® is bijzonder goed beveiligd tegen kopiëren. Dit komt allereerst door een gepatenteerde opliggende rib in het sleutelprofiel. Daarnaast zorgt de speciale uitfrezing in deze rib voor extra veiligheid bij de profielcontrole en maakt het de sleutel bovendien sterker. Nasleutels worden uitsluitend op vertoon van het bijgeleverde eigendoms sleutelcertificaat gedupliceerd.',
    image: 'https://www.btdbeveiliging.nl/site/assets/files/1089/dom_ix_teco_skg3.350x350.jpg',
    features: ['Keersleutel', 'Gepatenteerde techniek', 'Hoge slijtvastheid', 'Complex sluitplan mogelijk'],
    link: '/services/sluitsystemen'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Marco de Vries",
    company: "Facilitair Manager, Rivas Zorggroep",
    text: "Voor onze zorglocaties is toegangscontrole cruciaal. BTD denkt proactief mee en de overstap naar het DOM Tapkey systeem verliep vlekkeloos."
  },
  {
    id: 2,
    name: "Jeroen van Dam",
    company: "VvE Beheer Drechtsteden",
    text: "Wij beheren tientallen complexen. De sleutelplannen van BTD zijn altijd punctueel en het nabestellen van gecertificeerde sleutels gaat zeer efficiënt."
  },
  {
    id: 3,
    name: "Familie Meijer",
    company: "Particulier",
    text: "Na een inbraakpoging heeft BTD ons hele huis voorzien van SKG*** sloten. De monteur was er binnen een uur en heeft alles keurig achtergelaten."
  }
];

export const STATS = [
  { label: 'Soorten sleutels', value: '8000+', icon: 'Key' },
  { label: 'Erkende Partners', value: '30+', icon: 'ShieldCheck' },
  { label: 'Klanttevredenheid', value: '4.9/5', icon: 'Star' },
  { label: 'Jaren Expertise', value: '43', icon: 'Store' },
];

export const BRANDS = [
  "Mul-T-Lock", "Tedee", "DOM", "Tapkey", "Lips", "Iseo", "Nemef", "Abus", 
  "Ami", "Burg Wachter", "Secu", "Heras", "Assa", "Euro-Locks", "Dieckmann", 
  "Mauer", "Cisa", "Silca", "Interflon", "Dorma", "Dictator", "Wilka", "Sobinco",
  "HMB", "Locinox", "Ankerslot", "WSS", "Evva", "Junie", "Eff Eff", "Pfaffenhain",
  "KFV", "Fuhr"
];

export const CONTACT_INFO = {
  address: "Merwedestraat 261, 3313 GT Dordrecht",
  phone: "078-614 81 48",
  email: "info@btdbeveiliging.nl",
  hours: "Di t/m Vr: 08:00 - 17:00",
  mapLat: 51.817162,
  mapLon: 4.701662
};

