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
    flag: '🇫🇷',
    subtitle: 'Membre UE / Schengen',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Espèces CITES (ivoire, corail…)', color: 'red' },
      { label: 'Contrefaçons', color: 'red' },
      { label: 'Médicaments contrôlés (ordonnance requise)', color: 'amber' },
      { label: 'Armes à feu (licence obligatoire)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 € à déclarer (hors UE)', color: 'blue' },
      { label: 'Hors UE : viande 1 kg max, lait 1 kg max', color: 'amber' },
      { label: 'Alcool (hors UE) : 1 L spiritueux, 2 L vin', color: 'blue' },
      { label: 'Tabac : 200 cigarettes (hors UE)', color: 'blue' },
    ],
    specificities:
      'Pas de contrôle douanier intra-UE/Schengen. Règles UE standard pour voyageurs extra-communautaires. La douane française est particulièrement vigilante sur les contrefaçons et les produits du tabac hors quota. Franchise bagages hors UE : 430 € (avion).',
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée dans tous les aéroports français.',
    coordinates: { top: '34%', left: '48.8%' },
  },
  {
    id: 'ES',
    name: 'Espagne',
    flag: '🇪🇸',
    subtitle: 'Membre UE / Schengen',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Espèces CITES', color: 'red' },
      { label: 'Médicaments contrôlés (prescription requise)', color: 'amber' },
      { label: 'Contrefaçons', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 € à déclarer (hors UE)', color: 'blue' },
      { label: 'Hors UE : viande 1 kg, produits laitiers 1 kg', color: 'amber' },
      { label: 'Alcool : 1 L spiritueux / 2 L vin (hors UE)', color: 'blue' },
    ],
    specificities:
      'Mêmes règles UE que la France. Attention : les Canaries, Ceuta et Melilla ont un statut fiscal particulier.',
    liquids:
      '100 ml / sac transparent. Aéroports de Madrid (MAD) et Barcelone (BCN) parmi les plus stricts.',
    coordinates: { top: '35%', left: '46%' },
  },
  {
    id: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    subtitle: 'Membre UE / Schengen',
    prohibited: [
      { label: 'Drogues (importation illégale)', color: 'red' },
      { label: 'Espèces CITES', color: 'red' },
      { label: 'Contrefaçons', color: 'amber' },
      { label: 'Médicaments contrôlés (prescription requise)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 € à déclarer (hors UE)', color: 'blue' },
      { label: 'Hors UE : viande 1 kg, produits laitiers 1 kg', color: 'amber' },
      { label: 'Alcool : 1 L spiritueux / 2 L vin (hors UE)', color: 'blue' },
    ],
    specificities:
      "Particularité : la dépénalisation des drogues pour usage personnel ne s'applique pas à l'importation.",
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée à Lisbonne (LIS) et Porto (OPO).',
    coordinates: { top: '36%', left: '44%' },
  },
  {
    id: 'BE',
    name: 'Belgique',
    flag: '🇧🇪',
    subtitle: 'Membre UE / Schengen',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Espèces CITES', color: 'red' },
      { label: 'Armes à feu (licence obligatoire)', color: 'red' },
      { label: 'Contrefaçons', color: 'red' },
      { label: 'Médicaments contrôlés (ordonnance requise)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 € à déclarer (hors UE)', color: 'blue' },
      { label: 'Hors UE : viande 1 kg, produits laitiers 1 kg', color: 'amber' },
      { label: 'Alcool (hors UE) : 1 L spiritueux, 2 L vin', color: 'blue' },
      { label: 'Tabac : 200 cigarettes (hors UE)', color: 'blue' },
    ],
    specificities:
      'Pas de contrôle douanier intra-Schengen. La Belgique est particulièrement vigilante sur les diamants bruts.',
    liquids:
      '100 ml / sac transparent. Règle UE standard appliquée à Brussels Airport (BRU) et Liège (LGG).',
    coordinates: { top: '28%', left: '49%' },
  },
  {
    id: 'CH',
    name: 'Suisse',
    flag: '🇨🇭',
    subtitle: 'Schengen, hors UE',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes à feu sans licence', color: 'red' },
      { label: 'Espèces CITES', color: 'red' },
      { label: "Cannabis (même légal dans le pays d'origine)", color: 'amber' },
      { label: 'Médicaments contrôlés (ordonnance + quantité limitée)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 CHF à déclarer', color: 'blue' },
      { label: 'Franchise : 300 CHF de marchandises', color: 'blue' },
      { label: "Viande : 1 kg max en provenance de l'UE", color: 'amber' },
      { label: 'Alcool : 1 L > 18° / 2 L < 18° par personne', color: 'blue' },
      { label: 'Tabac : 250 cigarettes par personne', color: 'blue' },
    ],
    specificities:
      "La Suisse est dans l'espace Schengen mais PAS dans l'union douanière UE : les contrôles douaniers existent.",
    liquids:
      '100 ml / sac transparent. Appliqué à Zurich (ZRH), Genève (GVA) et Bâle-Mulhouse (BSL).',
    coordinates: { top: '31%', left: '49%' },
  },
  {
    id: 'GB',
    name: 'Royaume-Uni',
    flag: '🇬🇧',
    subtitle: '261 M passagers',
    prohibited: [
      { label: 'Armes à feu (sauf licence)', color: 'red' },
      { label: 'Espèces CITES (ivoire, corail…)', color: 'red' },
      { label: 'Drogues de classe A/B/C', color: 'red' },
      { label: 'Viande et produits laitiers hors UE limités', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 £ à déclarer', color: 'blue' },
      { label: 'Post-Brexit : règles sur produits animaux UE renforcées', color: 'amber' },
      { label: 'Alcool : 1L spiritueux / 2L vin', color: 'blue' },
    ],
    specificities:
      "Post-Brexit, contrôles séparés de l'UE. Nouveaux postes d'inspection aux frontières pour produits animaux UE.",
    liquids: '100 ml / sac transparent. Depuis 2024, tentative de passage à 2L mais retardée.',
    coordinates: { top: '31.5%', left: '47.5%' },
  },
  {
    id: 'US',
    name: 'États-Unis',
    flag: '🇺🇸',
    subtitle: '876 M passagers',
    prohibited: [
      { label: 'Armes à feu non déclarées', color: 'red' },
      { label: 'Cubes de terre / sol étranger', color: 'red' },
      { label: 'Certains végétaux vivants', color: 'red' },
      { label: 'Produits à base de viande crue', color: 'red' },
      { label: 'Médicaments > 90 jours', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 $ à déclarer', color: 'blue' },
      { label: 'Fruits / légumes soumis inspection USDA', color: 'amber' },
      { label: 'Fromages à base de lait cru interdits (si < 60 jours)', color: 'red' },
    ],
    specificities:
      'Formulaire CBP 6059B obligatoire. Douane américaine très stricte sur les produits agricoles.',
    liquids:
      'Règle des 100 ml / sac transparent 1L. Médicaments liquides exemptés avec ordonnance.',
    coordinates: { top: '39%', left: '23%' },
  },
  {
    id: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    subtitle: '2e marché Amérique du Nord',
    prohibited: [
      { label: 'Armes à feu (déclaration obligatoire, règles strictes)', color: 'red' },
      { label: 'Drogues illicites (le cannabis légal au Canada reste interdit)', color: 'red' },
      { label: 'Espèces CITES', color: 'red' },
      { label: 'Certains végétaux et aliments sans inspection ACIA', color: 'red' },
      { label: 'Médicaments contrôlés : ordonnance + 90 jours max', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 CAD à déclarer', color: 'blue' },
      { label: 'Franchise : 800 CAD (séjour > 48h) / 200 CAD (< 48h)', color: 'blue' },
      { label: 'Produits carnés et laitiers hors Canada soumis inspection ACIA', color: 'amber' },
      { label: 'Alcool : 1,5 L vin / 1,14 L spiritueux par personne', color: 'blue' },
    ],
    specificities:
      "L'Agence des services frontaliers du Canada (ASFC) est parmi les plus rigoureuses au monde. Le cannabis est légal au Canada mais son importation depuis l'étranger est formellement interdite.",
    liquids: '100 ml / sac transparent. Appliqué à Toronto (YYZ), Montréal (YUL), Vancouver (YVR).',
    coordinates: { top: '30%', left: '21%' },
  },
  {
    id: 'MX',
    name: 'Mexique',
    flag: '🇲🇽',
    subtitle: '1er marché Amérique latine',
    prohibited: [
      { label: 'Armes à feu (strictement interdites sans autorisation militaire)', color: 'red' },
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Produits végétaux vivants sans certificat', color: 'red' },
      { label: 'Devises > 10 000 USD non déclarées', color: 'red' },
      { label: 'Médicaments contrôlés (COFEPRIS) : ordonnance requise', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', color: 'blue' },
      { label: 'Franchise : 500 USD (avion) / 75 USD (terrestre)', color: 'blue' },
      { label: 'Au-delà : taxe de 16 % + IGI', color: 'red' },
      { label: 'Viande et produits laitiers soumis à inspection', color: 'amber' },
    ],
    specificities: "Le système douanier mexicain utilise un feu tricolore aléatoire à l'arrivée.",
    liquids: '100 ml / sac transparent. Appliqué à Mexico, Cancún, Guadalajara.',
    coordinates: { top: '45%', left: '21%' },
  },
  {
    id: 'BR',
    name: 'Brésil',
    flag: '🇧🇷',
    subtitle: '1er marché Amérique du Sud',
    prohibited: [
      { label: 'Drogues illicites (peines très sévères)', color: 'red' },
      { label: 'Armes à feu non déclarées', color: 'red' },
      { label: 'Produits végétaux vivants sans certificat phytosanitaire', color: 'red' },
      { label: 'Médicaments contrôlés (ANVISA)', color: 'amber' },
      { label: 'Drones (réglementation ANAC requise)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 BRL (~1 800 €) à déclarer', color: 'blue' },
      { label: 'Produits alimentaires soumis à inspection MAPA', color: 'amber' },
      { label: 'Franchise bagages : 500 USD (avion)', color: 'blue' },
      { label: 'Au-delà : taxes douanières élevées', color: 'red' },
    ],
    specificities:
      'La douane brésilienne est réputée pour ses taxes élevées sur les produits importés au-delà de la franchise.',
    liquids: '100 ml / sac transparent. Appliqué dans les grands aéroports.',
    coordinates: { top: '65%', left: '32.5%' },
  },
  {
    id: 'AR',
    name: 'Argentine',
    flag: '🇦🇷',
    subtitle: '2e marché Amérique du Sud',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes à feu non déclarées', color: 'red' },
      { label: 'Matériel pédopornographique', color: 'red' },
      { label: 'Médicaments contrôlés (ANMAT)', color: 'amber' },
      { label: 'Drones (ANAC, autorisation requise)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', color: 'blue' },
      { label: 'Franchise : 500 USD (avion) / 300 USD (terrestre)', color: 'blue' },
      { label: 'Au-delà : taxes douanières de 50 % + 21 % TVA', color: 'red' },
      { label: 'Produits alimentaires soumis au SENASA', color: 'amber' },
    ],
    specificities:
      "L'Argentine applique des contrôles douaniers stricts sur les devises étrangères.",
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '76%', left: '31.5%' },
  },
  {
    id: 'CI',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    subtitle: "Hub Afrique de l'Ouest",
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes et munitions', color: 'red' },
      { label: 'Matériel pornographique', color: 'red' },
      { label: 'Faux billets / fausse monnaie', color: 'red' },
      { label: 'Médicaments : importation commerciale très réglementée', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 1 000 000 FCFA (~1 524 €) à déclarer', color: 'blue' },
      { label: 'Produits alimentaires soumis inspection phytosanitaire', color: 'amber' },
      { label: 'Alcool : usage personnel toléré dans des limites raisonnables', color: 'blue' },
      { label: 'Tabac : 200 cigarettes', color: 'blue' },
    ],
    specificities:
      "La Côte d'Ivoire est membre de l'UEMOA (Union Économique et Monétaire Ouest-Africaine). Les contrôles douaniers à l'aéroport d'Abidjan (ABJ) sont renforcés.",
    liquids: '100 ml / sac transparent. Règle OACI standard.',
    coordinates: { top: '59%', left: '46.2%' },
  },
  {
    id: 'ZA',
    name: 'Afrique du Sud',
    flag: '🇿🇦',
    subtitle: 'Hub Afrique Australe',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes à feu', color: 'red' },
      { label: 'Produits laitiers et carnés non certifiés', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 10 000 USD à déclarer', color: 'blue' },
      { label: 'Franchise voyageurs appliquée', color: 'blue' },
    ],
    specificities: 'Déclaration stricte des biens de valeur.',
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '76.5%', left: '53.5%' },
  },
  {
    id: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    subtitle: "Hub Afrique de l'Ouest",
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes et munitions', color: 'red' },
      { label: 'Matériel pornographique', color: 'red' },
      { label: 'Médicaments : importation commerciale très réglementée', color: 'amber' },
      { label: 'Drones (autorisation ANACIM requise)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 1 000 000 FCFA (~1 524 €) à déclarer', color: 'blue' },
      { label: 'Produits alimentaires soumis inspection', color: 'amber' },
      { label: 'Alcool : usage personnel toléré', color: 'blue' },
      { label: 'Tabac : 200 cigarettes', color: 'blue' },
    ],
    specificities:
      "Membre de l'UEMOA (zone FCFA) : libre circulation facilitée avec 7 pays voisins.",
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '50%', left: '42%' },
  },
  {
    id: 'CM',
    name: 'Cameroun',
    flag: '🇨🇲',
    subtitle: 'Hub Afrique Centrale',
    prohibited: [
      { label: 'Drogues illicites', color: 'red' },
      { label: 'Armes et munitions (licence obligatoire)', color: 'red' },
      { label: 'Matériel pornographique', color: 'red' },
      { label: 'Faux billets / fausse monnaie', color: 'red' },
      { label: "Médicaments : importation commerciale soumise à l'ACAME", color: 'amber' },
    ],
    currencyFood: [
      { label: '> 1 000 000 FCFA (~1 524 €) à déclarer', color: 'blue' },
      { label: 'Produits alimentaires et végétaux soumis à inspection', color: 'amber' },
    ],
    specificities:
      'Membre de la CEMAC. Les contrôles à Douala (DLA) et Yaoundé (NSI) sont fréquents.',
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '55%', left: '50%' },
  },
  {
    id: 'MA',
    name: 'Maroc',
    flag: '🇲🇦',
    subtitle: 'Hub Afrique du Nord',
    prohibited: [
      { label: 'Drogues (tolérance zéro, malgré production locale)', color: 'red' },
      { label: 'Matériel pornographique', color: 'red' },
      { label: 'Drones sans autorisation ANAC', color: 'red' },
      { label: 'Armes et munitions', color: 'red' },
      { label: 'Médicaments psychotropes', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 100 000 MAD (~9 000 €) à déclarer', color: 'blue' },
      { label: "Produits alimentaires d'origine animale soumis inspection", color: 'amber' },
    ],
    specificities:
      'La devise marocaine (dirham) est non convertible : il est illégal de sortir du Maroc avec plus de 1 000 MAD en espèces.',
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '40%', left: '45%' },
  },
  {
    id: 'SA',
    name: 'Arabie Saoudite',
    flag: '🇸🇦',
    subtitle: 'Route JED-RUH n°1 mondial',
    prohibited: [
      { label: 'Alcool (strictement interdit)', color: 'red' },
      { label: 'Porc et dérivés', color: 'red' },
      { label: 'Contenu religieux non islamique', color: 'red' },
      { label: 'Jeux de hasard', color: 'red' },
      { label: 'Drogues (peine de mort possible)', color: 'red' },
    ],
    currencyFood: [
      { label: '> 60 000 SAR à déclarer', color: 'blue' },
      { label: 'Produits israéliens interdits', color: 'red' },
      { label: 'Médicaments : prescription obligatoire', color: 'amber' },
    ],
    specificities:
      'Pays aux règles douanières parmi les plus restrictives au monde. Tout matériel jugé contraire aux valeurs islamiques peut être confisqué.',
    liquids: '100 ml / sac transparent standard.',
    coordinates: { top: '48.5%', left: '59.5%' },
  },
  {
    id: 'AE',
    name: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    subtitle: 'Hub mondial (DXB)',
    prohibited: [
      { label: 'Drogues / CBD (même légaux ailleurs)', color: 'red' },
      { label: 'Viande de porc', color: 'red' },
      { label: 'Contenu "offensant" (photos, œuvres)', color: 'red' },
      { label: 'Médicaments opioïdes sans autorisation', color: 'red' },
      { label: 'VoIP non autorisés (ex. certains apps)', color: 'red' },
    ],
    currencyFood: [
      { label: '> 100 000 AED à déclarer', color: 'blue' },
      { label: "Alcool : interdit à l'importation", color: 'blue' },
    ],
    specificities:
      'Tolérance zéro pour les drogues (même traces détectables). Médicaments psychotropes nécessitent une attestation du ministère de la santé.',
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '47.5%', left: '61.5%' },
  },
  {
    id: 'IN',
    name: 'Inde',
    flag: '🇮🇳',
    subtitle: '211 M passagers',
    prohibited: [
      { label: 'Or non déclaré > 50 000 ₹ (homme) / 100 000 ₹ (femme)', color: 'red' },
      { label: 'Produits du tabac > 200 cigarettes', color: 'red' },
      { label: 'Billets ₹ hors limites autorisées', color: 'red' },
      { label: 'Médicaments en grandes quantités', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 5 000 USD en devises étrangères à déclarer', color: 'blue' },
      { label: 'Produits alimentaires soumis inspection', color: 'amber' },
    ],
    specificities:
      "Franchise bagages : 50 000 ₹ de biens personnels. Règles d'import d'or très strictes.",
    liquids: '100 ml / sac transparent.',
    coordinates: { top: '43%', left: '68%' },
  },
  {
    id: 'CN',
    name: 'Chine',
    flag: '🇨🇳',
    subtitle: '741 M passagers',
    prohibited: [
      { label: 'Matériel politique / religieux', color: 'red' },
      { label: 'Drones sans licence', color: 'red' },
      { label: 'Produits du tabac > 400 cigarettes', color: 'red' },
      { label: 'VPN non autorisés', color: 'red' },
      { label: 'Médicaments en grande quantité', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 5 000 USD (ou ¥20 000) à déclarer', color: 'blue' },
      { label: 'Produits laitiers très réglementés', color: 'amber' },
      { label: 'Viande fraîche et fruits souvent interdits', color: 'red' },
    ],
    specificities:
      "Contrôle douanier très strict à l'entrée. Contenu des appareils électroniques susceptible d'être inspecté.",
    liquids: 'Règle des 100 ml strictement appliquée.',
    coordinates: { top: '34%', left: '78%' },
  },
  {
    id: 'JP',
    name: 'Japon',
    flag: '🇯🇵',
    subtitle: '205 M passagers',
    prohibited: [
      { label: 'Pseudoéphédrine (dans certains médicaments OTC)', color: 'red' },
      { label: 'Armes / certains couteaux', color: 'red' },
      { label: 'Certains produits cosmétiques', color: 'red' },
      { label: 'Pornographie', color: 'red' },
      { label: 'Certains végétaux et fruits (quarantaine)', color: 'amber' },
    ],
    currencyFood: [
      { label: '> 1 M ¥ à déclarer', color: 'blue' },
      { label: 'Viande et produits carnés soumis inspection stricte', color: 'amber' },
    ],
    specificities: 'Le Japon interdit certains médicaments courants en Europe (ex. Sudafed).',
    liquids: '100 ml / sac transparent. Strictement appliqué.',
    coordinates: { top: '35%', left: '86%' },
  },
];
