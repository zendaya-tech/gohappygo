export type TagColor = 'red' | 'amber' | 'blue';

export interface RestrictionTag {
  label: string; // Fallback string extracted from HTML
  translationKey?: string; // Opt-in key for useTranslation hook
  color: TagColor;
}

export interface CountryRestriction {
  id: string; // ISO Code
  name: string; // Country name
  nameKey?: string;
  flag: string; // Emoji flag
  subtitle: string;
  subtitleKey?: string;
  prohibited: RestrictionTag[];
  currencyFood: RestrictionTag[];
  specificities: string;
  specificitiesKey?: string;
  liquids: string;
  liquidsKey?: string;
  coordinates: {
    top: string;
    left: string;
  };
}

export const customsData: CountryRestriction[] = [
  {
    id: 'FR',
    name: 'France',
    nameKey: 'customs.countries.FR.name',
    flag: '🇫🇷',
    subtitle: 'Membre UE / Schengen',
    subtitleKey: 'customs.countries.FR.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      {
        label: 'Espèces CITES (ivoire, corail…)',
        translationKey: 'customs.tags.cites',
        color: 'red',
      },
      { label: 'Contrefaçons', translationKey: 'customs.tags.counterfeits', color: 'red' },
      {
        label: 'Médicaments contrôlés (ordonnance requise)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
      {
        label: 'Armes à feu (licence obligatoire)',
        translationKey: 'customs.tags.firearms',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 10 000 € à déclarer (hors UE)',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Hors UE : viande 1 kg max, lait 1 kg max',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool (hors UE) : 1 L spiritueux, 2 L vin',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
      {
        label: 'Tabac : 200 cigarettes (hors UE)',
        translationKey: 'customs.tags.tobacco',
        color: 'blue',
      },
    ],
    specificities:
      'Pas de contrôle douanier intra-UE/Schengen. Règles UE standard pour voyageurs extra-communautaires. La douane française est particulièrement vigilante sur les contrefaçons et les produits du tabac hors quota. Franchise bagages hors UE : 430 € (avion).',
    specificitiesKey: 'customs.countries.FR.specificities',
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée dans tous les aéroports français.',
    liquidsKey: 'customs.countries.FR.liquids',
    coordinates: { top: '34%', left: '48.8%' },
  },
  {
    id: 'ES',
    name: 'Espagne',
    nameKey: 'customs.countries.ES.name',
    flag: '🇪🇸',
    subtitle: 'Membre UE / Schengen',
    subtitleKey: 'customs.countries.ES.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Espèces CITES', translationKey: 'customs.tags.cites', color: 'red' },
      {
        label: 'Médicaments contrôlés (prescription requise)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
      { label: 'Contrefaçons', translationKey: 'customs.tags.counterfeits', color: 'amber' },
    ],
    currencyFood: [
      {
        label: '> 10 000 € à déclarer (hors UE)',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Hors UE : viande 1 kg, produits laitiers 1 kg',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : 1 L spiritueux / 2 L vin (hors UE)',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
    ],
    specificities:
      'Mêmes règles UE que la France. Attention : les Canaries, Ceuta et Melilla ont un statut fiscal particulier.',
    specificitiesKey: 'customs.countries.ES.specificities',
    liquids:
      '100 ml / sac transparent. Aéroports de Madrid (MAD) et Barcelone (BCN) parmi les plus stricts.',
    liquidsKey: 'customs.countries.ES.liquids',
    coordinates: { top: '35%', left: '46%' },
  },
  {
    id: 'PT',
    name: 'Portugal',
    nameKey: 'customs.countries.PT.name',
    flag: '🇵🇹',
    subtitle: 'Membre UE / Schengen',
    subtitleKey: 'customs.countries.PT.subtitle',
    prohibited: [
      {
        label: 'Drogues (importation illégale)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      { label: 'Espèces CITES', translationKey: 'customs.tags.cites', color: 'red' },
      { label: 'Contrefaçons', translationKey: 'customs.tags.counterfeits', color: 'amber' },
      {
        label: 'Médicaments contrôlés (prescription requise)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 10 000 € à déclarer (hors UE)',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Hors UE : viande 1 kg, produits laitiers 1 kg',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : 1 L spiritueux / 2 L vin (hors UE)',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
    ],
    specificities:
      "Particularité : la dépénalisation des drogues pour usage personnel ne s'applique pas à l'importation.",
    specificitiesKey: 'customs.countries.PT.specificities',
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée à Lisbonne (LIS) et Porto (OPO).',
    liquidsKey: 'customs.countries.PT.liquids',
    coordinates: { top: '36%', left: '44%' },
  },
  {
    id: 'BE',
    name: 'Belgique',
    nameKey: 'customs.countries.BE.name',
    flag: '🇧🇪',
    subtitle: 'Membre UE / Schengen',
    subtitleKey: 'customs.countries.BE.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Espèces CITES', translationKey: 'customs.tags.cites', color: 'red' },
      {
        label: 'Armes à feu (licence obligatoire)',
        translationKey: 'customs.tags.firearms',
        color: 'red',
      },
      { label: 'Contrefaçons', translationKey: 'customs.tags.counterfeits', color: 'red' },
      {
        label: 'Médicaments contrôlés (ordonnance requise)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 10 000 € à déclarer (hors UE)',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Hors UE : viande 1 kg, produits laitiers 1 kg',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool (hors UE) : 1 L spiritueux, 2 L vin',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
      {
        label: 'Tabac : 200 cigarettes (hors UE)',
        translationKey: 'customs.tags.tobacco',
        color: 'blue',
      },
    ],
    specificities:
      'Pas de contrôle douanier intra-Schengen. La Belgique est particulièrement vigilante sur les diamants bruts.',
    specificitiesKey: 'customs.countries.BE.specificities',
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée à Brussels Airport (BRU) et Liège (LGG).',
    liquidsKey: 'customs.countries.BE.liquids',
    coordinates: { top: '28%', left: '49%' },
  },
  {
    id: 'CH',
    name: 'Suisse',
    nameKey: 'customs.countries.CH.name',
    flag: '🇨🇭',
    subtitle: 'Schengen, hors UE',
    subtitleKey: 'customs.countries.CH.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Armes à feu sans licence', translationKey: 'customs.tags.firearms', color: 'red' },
      { label: 'Espèces CITES', translationKey: 'customs.tags.cites', color: 'red' },
      {
        label: "Cannabis (même légal dans le pays d'origine)",
        translationKey: 'customs.tags.illicitDrugs',
        color: 'amber',
      },
      {
        label: 'Médicaments contrôlés (ordonnance + quantité limitée)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 CHF à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Franchise : 300 CHF de marchandises', color: 'blue' },
      {
        label: "Viande : 1 kg max en provenance de l'UE",
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : 1 L > 18° / 2 L < 18° par personne',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
      {
        label: 'Tabac : 250 cigarettes par personne',
        translationKey: 'customs.tags.tobacco',
        color: 'blue',
      },
    ],
    specificities:
      "La Suisse est dans l'espace Schengen mais PAS dans l'union douanière UE : les contrôles douaniers existent.",
    specificitiesKey: 'customs.countries.CH.specificities',
    liquids:
      '100 ml / sac transparent. Appliqué à Zurich (ZRH), Genève (GVA) et Bâle-Mulhouse (BSL).',
    liquidsKey: 'customs.countries.CH.liquids',
    coordinates: { top: '31%', left: '49%' },
  },
  {
    id: 'GB',
    name: 'Royaume-Uni',
    nameKey: 'customs.countries.GB.name',
    flag: '🇬🇧',
    subtitle: '261 M passagers',
    subtitleKey: 'customs.countries.GB.subtitle',
    prohibited: [
      {
        label: 'Armes à feu (sauf licence)',
        translationKey: 'customs.tags.firearms',
        color: 'red',
      },
      {
        label: 'Espèces CITES (ivoire, corail…)',
        translationKey: 'customs.tags.cites',
        color: 'red',
      },
      {
        label: 'Drogues de classe A/B/C',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      {
        label: 'Viande et produits laitiers hors UE limités',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 £ à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      {
        label: 'Post-Brexit : règles sur produits animaux UE renforcées',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : 1L spiritueux / 2L vin',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
    ],
    specificities:
      "Post-Brexit, contrôles séparés de l'UE. Nouveaux postes d'inspection aux frontières pour produits animaux UE.",
    specificitiesKey: 'customs.countries.GB.specificities',
    liquids: '100 ml / sac transparent. Depuis 2024, tentative de passage à 2L mais retardée.',
    liquidsKey: 'customs.countries.GB.liquids',
    coordinates: { top: '31.5%', left: '47.5%' },
  },
  {
    id: 'US',
    name: 'États-Unis',
    nameKey: 'customs.countries.US.name',
    flag: '🇺🇸',
    subtitle: '876 M passagers',
    subtitleKey: 'customs.countries.US.subtitle',
    prohibited: [
      { label: 'Armes à feu non déclarées', translationKey: 'customs.tags.firearms', color: 'red' },
      { label: 'Cubes de terre / sol étranger', color: 'red' },
      { label: 'Certains végétaux vivants', color: 'red' },
      {
        label: 'Produits à base de viande crue',
        translationKey: 'customs.tags.meatDairy',
        color: 'red',
      },
      {
        label: 'Médicaments > 90 jours',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 $ à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Fruits / légumes soumis inspection USDA', color: 'amber' },
      { label: 'Fromages à base de lait cru interdits (si < 60 jours)', color: 'red' },
    ],
    specificities:
      'Formulaire CBP 6059B obligatoire. Douane américaine très stricte sur les produits agricoles.',
    specificitiesKey: 'customs.countries.US.specificities',
    liquids:
      'Règle des 100 ml / sac transparent 1L. Médicaments liquides exemptés avec ordonnance.',
    liquidsKey: 'customs.countries.US.liquids',
    coordinates: { top: '39%', left: '23%' },
  },
  {
    id: 'CA',
    name: 'Canada',
    nameKey: 'customs.countries.CA.name',
    flag: '🇨🇦',
    subtitle: '2e marché Amérique du Nord',
    subtitleKey: 'customs.countries.CA.subtitle',
    prohibited: [
      {
        label: 'Armes à feu (déclaration obligatoire, règles strictes)',
        translationKey: 'customs.tags.firearms',
        color: 'red',
      },
      {
        label: 'Drogues illicites (le cannabis légal au Canada reste interdit)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      { label: 'Espèces CITES', translationKey: 'customs.tags.cites', color: 'red' },
      { label: 'Certains végétaux et aliments sans inspection ACIA', color: 'red' },
      {
        label: 'Médicaments contrôlés : ordonnance + 90 jours max',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 CAD à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Franchise : 800 CAD (séjour > 48h) / 200 CAD (< 48h)', color: 'blue' },
      {
        label: 'Produits carnés et laitiers hors Canada soumis inspection ACIA',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : 1,5 L vin / 1,14 L spiritueux par personne',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
    ],
    specificities:
      "L'Agence des services frontaliers du Canada (ASFC) est parmi les plus rigoureuses au monde. Le cannabis est légal au Canada mais son importation depuis l'étranger est formellement interdite.",
    specificitiesKey: 'customs.countries.CA.specificities',
    liquids: '100 ml / sac transparent. Appliqué à Toronto (YYZ), Montréal (YUL), Vancouver (YVR).',
    liquidsKey: 'customs.countries.CA.liquids',
    coordinates: { top: '30%', left: '21%' },
  },
  {
    id: 'MX',
    name: 'Mexique',
    nameKey: 'customs.countries.MX.name',
    flag: '🇲🇽',
    subtitle: '1er marché Amérique latine',
    subtitleKey: 'customs.countries.MX.subtitle',
    prohibited: [
      {
        label: 'Armes à feu (strictement interdites sans autorisation militaire)',
        translationKey: 'customs.tags.firearms',
        color: 'red',
      },
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Produits végétaux vivants sans certificat', color: 'red' },
      {
        label: 'Devises > 10 000 USD non déclarées',
        translationKey: 'customs.tags.currency',
        color: 'red',
      },
      {
        label: 'Médicaments contrôlés (COFEPRIS) : ordonnance requise',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Franchise : 500 USD (avion) / 75 USD (terrestre)', color: 'blue' },
      { label: 'Au-delà : taxe de 16 % + IGI', color: 'red' },
      {
        label: 'Viande et produits laitiers soumis à inspection',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities: "Le système douanier mexicain utilise un feu tricolore aléatoire à l'arrivée.",
    specificitiesKey: 'customs.countries.MX.specificities',
    liquids: '100 ml / sac transparent. Appliqué à Mexico, Cancún, Guadalajara.',
    liquidsKey: 'customs.countries.MX.liquids',
    coordinates: { top: '45%', left: '21%' },
  },
  {
    id: 'BR',
    name: 'Brésil',
    nameKey: 'customs.countries.BR.name',
    flag: '🇧🇷',
    subtitle: '1er marché Amérique du Sud',
    subtitleKey: 'customs.countries.BR.subtitle',
    prohibited: [
      {
        label: 'Drogues illicites (peines très sévères)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      { label: 'Armes à feu non déclarées', translationKey: 'customs.tags.firearms', color: 'red' },
      { label: 'Produits végétaux vivants sans certificat phytosanitaire', color: 'red' },
      {
        label: 'Médicaments contrôlés (ANVISA)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
      {
        label: 'Drones (réglementation ANAC requise)',
        translationKey: 'customs.tags.drones',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 10 000 BRL (~1 800 €) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits alimentaires soumis à inspection MAPA',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      { label: 'Franchise bagages : 500 USD (avion)', color: 'blue' },
      { label: 'Au-delà : taxes douanières élevées', color: 'red' },
    ],
    specificities:
      'La douane brésilienne est réputée pour ses taxes élevées sur les produits importés au-delà de la franchise.',
    specificitiesKey: 'customs.countries.BR.specificities',
    liquids: '100 ml / sac transparent. Appliqué dans les grands aéroports.',
    liquidsKey: 'customs.countries.BR.liquids',
    coordinates: { top: '65%', left: '32.5%' },
  },
  {
    id: 'AR',
    name: 'Argentine',
    nameKey: 'customs.countries.AR.name',
    flag: '🇦🇷',
    subtitle: '2e marché Amérique du Sud',
    subtitleKey: 'customs.countries.AR.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Armes à feu non déclarées', translationKey: 'customs.tags.firearms', color: 'red' },
      { label: 'Matériel pédopornographique', color: 'red' },
      {
        label: 'Médicaments contrôlés (ANMAT)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
      {
        label: 'Drones (ANAC, autorisation requise)',
        translationKey: 'customs.tags.drones',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Franchise : 500 USD (avion) / 300 USD (terrestre)', color: 'blue' },
      { label: 'Au-delà : taxes douanières de 50 % + 21 % TVA', color: 'red' },
      {
        label: 'Produits alimentaires soumis au SENASA',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities:
      "L'Argentine applique des contrôles douaniers stricts sur les devises étrangères.",
    specificitiesKey: 'customs.countries.AR.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.AR.liquids',
    coordinates: { top: '76%', left: '31.5%' },
  },
  {
    id: 'CI',
    name: "Côte d'Ivoire",
    nameKey: 'customs.countries.CI.name',
    flag: '🇨🇮',
    subtitle: "Hub Afrique de l'Ouest",
    subtitleKey: 'customs.countries.CI.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Armes et munitions', translationKey: 'customs.tags.firearms', color: 'red' },
      {
        label: 'Matériel pornographique',
        translationKey: 'customs.tags.pornography',
        color: 'red',
      },
      { label: 'Faux billets / fausse monnaie', color: 'red' },
      {
        label: 'Médicaments : importation commerciale très réglementée',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 1 000 000 FCFA (~1 524 €) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits alimentaires soumis inspection phytosanitaire',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : usage personnel toléré dans des limites raisonnables',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
      { label: 'Tabac : 200 cigarettes', translationKey: 'customs.tags.tobacco', color: 'blue' },
    ],
    specificities:
      "La Côte d'Ivoire est membre de l'UEMOA (Union Économique et Monétaire Ouest-Africaine). Les contrôles douaniers à l'aéroport d'Abidjan (ABJ) sont renforcés.",
    specificitiesKey: 'customs.countries.CI.specificities',
    liquids: '100 ml / sac transparent. Règle OACI standard.',
    liquidsKey: 'customs.countries.CI.liquids',
    coordinates: { top: '59%', left: '46.2%' },
  },
  {
    id: 'ZA',
    name: 'Afrique du Sud',
    nameKey: 'customs.countries.ZA.name',
    flag: '🇿🇦',
    subtitle: 'Hub Afrique Australe',
    subtitleKey: 'customs.countries.ZA.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Armes à feu', translationKey: 'customs.tags.firearms', color: 'red' },
      {
        label: 'Produits laitiers et carnés non certifiés',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Franchise voyageurs appliquée', color: 'blue' },
    ],
    specificities: 'Déclaration stricte des biens de valeur.',
    specificitiesKey: 'customs.countries.ZA.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.ZA.liquids',
    coordinates: { top: '76.5%', left: '53.5%' },
  },
  {
    id: 'SN',
    name: 'Sénégal',
    nameKey: 'customs.countries.SN.name',
    flag: '🇸🇳',
    subtitle: "Hub Afrique de l'Ouest",
    subtitleKey: 'customs.countries.SN.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      { label: 'Armes et munitions', translationKey: 'customs.tags.firearms', color: 'red' },
      {
        label: 'Matériel pornographique',
        translationKey: 'customs.tags.pornography',
        color: 'red',
      },
      {
        label: 'Médicaments : importation commerciale très réglementée',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
      {
        label: 'Drones (autorisation ANACIM requise)',
        translationKey: 'customs.tags.drones',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 1 000 000 FCFA (~1 524 €) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits alimentaires soumis inspection',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Alcool : usage personnel toléré',
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
      { label: 'Tabac : 200 cigarettes', translationKey: 'customs.tags.tobacco', color: 'blue' },
    ],
    specificities:
      "Membre de l'UEMOA (zone FCFA) : libre circulation facilitée avec 7 pays voisins.",
    specificitiesKey: 'customs.countries.SN.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.SN.liquids',
    coordinates: { top: '50%', left: '42%' },
  },
  {
    id: 'CM',
    name: 'Cameroun',
    nameKey: 'customs.countries.CM.name',
    flag: '🇨🇲',
    subtitle: 'Hub Afrique Centrale',
    subtitleKey: 'customs.countries.CM.subtitle',
    prohibited: [
      { label: 'Drogues illicites', translationKey: 'customs.tags.illicitDrugs', color: 'red' },
      {
        label: 'Armes et munitions (licence obligatoire)',
        translationKey: 'customs.tags.firearms',
        color: 'red',
      },
      {
        label: 'Matériel pornographique',
        translationKey: 'customs.tags.pornography',
        color: 'red',
      },
      { label: 'Faux billets / fausse monnaie', color: 'red' },
      {
        label: "Médicaments : importation commerciale soumise à l'ACAME",
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 1 000 000 FCFA (~1 524 €) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits alimentaires et végétaux soumis à inspection',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities:
      'Membre de la CEMAC. Les contrôles à Douala (DLA) et Yaoundé (NSI) sont fréquents.',
    specificitiesKey: 'customs.countries.CM.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.CM.liquids',
    coordinates: { top: '55%', left: '50%' },
  },
  {
    id: 'MA',
    name: 'Maroc',
    nameKey: 'customs.countries.MA.name',
    flag: '🇲🇦',
    subtitle: 'Hub Afrique du Nord',
    subtitleKey: 'customs.countries.MA.subtitle',
    prohibited: [
      {
        label: 'Drogues (tolérance zéro, malgré production locale)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      {
        label: 'Matériel pornographique',
        translationKey: 'customs.tags.pornography',
        color: 'red',
      },
      {
        label: 'Drones sans autorisation ANAC',
        translationKey: 'customs.tags.drones',
        color: 'red',
      },
      { label: 'Armes et munitions', translationKey: 'customs.tags.firearms', color: 'red' },
      {
        label: 'Médicaments psychotropes',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 100 000 MAD (~9 000 €) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: "Produits alimentaires d'origine animale soumis inspection",
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities:
      'La devise marocaine (dirham) est non convertible : il est illégal de sortir du Maroc avec plus de 1 000 MAD en espèces.',
    specificitiesKey: 'customs.countries.MA.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.MA.liquids',
    coordinates: { top: '40%', left: '45%' },
  },
  {
    id: 'SA',
    name: 'Arabie Saoudite',
    nameKey: 'customs.countries.SA.name',
    flag: '🇸🇦',
    subtitle: 'Route JED-RUH n°1 mondial',
    subtitleKey: 'customs.countries.SA.subtitle',
    prohibited: [
      {
        label: 'Alcool (strictement interdit)',
        translationKey: 'customs.tags.alcohol',
        color: 'red',
      },
      { label: 'Porc et dérivés', translationKey: 'customs.tags.meatDairy', color: 'red' },
      { label: 'Contenu religieux non islamique', color: 'red' },
      { label: 'Jeux de hasard', color: 'red' },
      {
        label: 'Drogues (peine de mort possible)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
    ],
    currencyFood: [
      { label: '> 60 000 SAR à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      { label: 'Produits israéliens interdits', color: 'red' },
      {
        label: 'Médicaments : prescription obligatoire',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    specificities:
      'Pays aux règles douanières parmi les plus restrictives au monde. Tout matériel jugé contraire aux valeurs islamiques peut être confisqué.',
    specificitiesKey: 'customs.countries.SA.specificities',
    liquids: '100 ml / sac transparent standard.',
    liquidsKey: 'customs.countries.SA.liquids',
    coordinates: { top: '48.5%', left: '59.5%' },
  },
  {
    id: 'AE',
    name: 'Émirats Arabes Unis',
    nameKey: 'customs.countries.AE.name',
    flag: '🇦🇪',
    subtitle: 'Hub mondial (DXB)',
    subtitleKey: 'customs.countries.AE.subtitle',
    prohibited: [
      {
        label: 'Drogues / CBD (même légaux ailleurs)',
        translationKey: 'customs.tags.illicitDrugs',
        color: 'red',
      },
      { label: 'Viande de porc', translationKey: 'customs.tags.meatDairy', color: 'red' },
      { label: 'Contenu "offensant" (photos, œuvres)', color: 'red' },
      {
        label: 'Médicaments opioïdes sans autorisation',
        translationKey: 'customs.tags.controlledMeds',
        color: 'red',
      },
      { label: 'VoIP non autorisés (ex. certains apps)', color: 'red' },
    ],
    currencyFood: [
      { label: '> 100 000 AED à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      {
        label: "Alcool : interdit à l'importation",
        translationKey: 'customs.tags.alcohol',
        color: 'blue',
      },
    ],
    specificities:
      'Tolérance zéro pour les drogues (même traces détectables). Médicaments psychotropes nécessitent une attestation du ministère de la santé.',
    specificitiesKey: 'customs.countries.AE.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.AE.liquids',
    coordinates: { top: '47.5%', left: '61.5%' },
  },
  {
    id: 'IN',
    name: 'Inde',
    nameKey: 'customs.countries.IN.name',
    flag: '🇮🇳',
    subtitle: '211 M passagers',
    subtitleKey: 'customs.countries.IN.subtitle',
    prohibited: [
      { label: 'Or non déclaré > 50 000 ₹ (homme) / 100 000 ₹ (femme)', color: 'red' },
      {
        label: 'Produits du tabac > 200 cigarettes',
        translationKey: 'customs.tags.tobacco',
        color: 'red',
      },
      { label: 'Billets ₹ hors limites autorisées', color: 'red' },
      {
        label: 'Médicaments en grandes quantités',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 5 000 USD en devises étrangères à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits alimentaires soumis inspection',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities:
      "Franchise bagages : 50 000 ₹ de biens personnels. Règles d'import d'or très strictes.",
    specificitiesKey: 'customs.countries.IN.specificities',
    liquids: '100 ml / sac transparent.',
    liquidsKey: 'customs.countries.IN.liquids',
    coordinates: { top: '43%', left: '68%' },
  },
  {
    id: 'CN',
    name: 'Chine',
    nameKey: 'customs.countries.CN.name',
    flag: '🇨🇳',
    subtitle: '741 M passagers',
    subtitleKey: 'customs.countries.CN.subtitle',
    prohibited: [
      { label: 'Matériel politique / religieux', color: 'red' },
      { label: 'Drones sans licence', translationKey: 'customs.tags.drones', color: 'red' },
      {
        label: 'Produits du tabac > 400 cigarettes',
        translationKey: 'customs.tags.tobacco',
        color: 'red',
      },
      { label: 'VPN non autorisés', color: 'red' },
      {
        label: 'Médicaments en grande quantité',
        translationKey: 'customs.tags.controlledMeds',
        color: 'amber',
      },
    ],
    currencyFood: [
      {
        label: '> 5 000 USD (ou ¥20 000) à déclarer',
        translationKey: 'customs.tags.currency',
        color: 'blue',
      },
      {
        label: 'Produits laitiers très réglementés',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
      {
        label: 'Viande fraîche et fruits souvent interdits',
        translationKey: 'customs.tags.meatDairy',
        color: 'red',
      },
    ],
    specificities:
      "Contrôle douanier très strict à l'entrée. Contenu des appareils électroniques susceptible d'être inspecté.",
    specificitiesKey: 'customs.countries.CN.specificities',
    liquids: 'Règle des 100 ml strictement appliquée.',
    liquidsKey: 'customs.countries.CN.liquids',
    coordinates: { top: '34%', left: '78%' },
  },
  {
    id: 'JP',
    name: 'Japon',
    nameKey: 'customs.countries.JP.name',
    flag: '🇯🇵',
    subtitle: '205 M passagers',
    subtitleKey: 'customs.countries.JP.subtitle',
    prohibited: [
      {
        label: 'Pseudoéphédrine (dans certains médicaments OTC)',
        translationKey: 'customs.tags.controlledMeds',
        color: 'red',
      },
      { label: 'Armes / certains couteaux', translationKey: 'customs.tags.firearms', color: 'red' },
      { label: 'Certains produits cosmétiques', color: 'red' },
      { label: 'Pornographie', translationKey: 'customs.tags.pornography', color: 'red' },
      {
        label: 'Certains végétaux et fruits (quarantaine)',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    currencyFood: [
      { label: '> 1 M ¥ à déclarer', translationKey: 'customs.tags.currency', color: 'blue' },
      {
        label: 'Viande et produits carnés soumis inspection stricte',
        translationKey: 'customs.tags.meatDairy',
        color: 'amber',
      },
    ],
    specificities: 'Le Japon interdit certains médicaments courants en Europe (ex. Sudafed).',
    specificitiesKey: 'customs.countries.JP.specificities',
    liquids: '100 ml / sac transparent. Strictement appliqué.',
    liquidsKey: 'customs.countries.JP.liquids',
    coordinates: { top: '35%', left: '86%' },
  },
];
