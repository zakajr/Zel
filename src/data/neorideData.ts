export type Lang = 'fr' | 'ar';
export type ProductCategory = 'all' | 'moto' | 'scoot' | 'piece';
export type ArtKind = 'moto' | 'scoot' | 'kick' | 'helmet' | 'battery';

export interface ProductColorOption {
  id: string;
  nameFr: string;
  nameAr: string;
  hex: string;
}

export interface ProductSpec {
  value: string;
  labelFr: string;
  labelAr: string;
  type: 'range' | 'speed' | 'charge' | 'battery' | 'info';
  ratio?: number; // 0 to 100 for visual meter
}

export interface ProductItem {
  id: string;
  category: Exclude<ProductCategory, 'all'>;
  artKind: ArtKind;
  name: string;
  nameAr: string;
  subtitleFr: string;
  subtitleAr: string;
  kickerFr: string;
  kickerAr: string;
  priceFormatted: string;
  priceDh: number;
  rangeKm: number;
  speedKmh: number;
  chargeHours: number;
  batteryLabelFr: string;
  batteryLabelAr: string;
  removableBattery: boolean;
  costPer100KmDh: number;
  colors: ProductColorOption[];
  specs: ProductSpec[];
  highlightsFr: string[];
  highlightsAr: string[];
  idealForFr: string;
  idealForAr: string;
}

export const WHATSAPP_NUMBER = '212600000000';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'nr1-sport',
    category: 'moto',
    artKind: 'moto',
    name: 'NeoRide NR-1 Sport',
    nameAr: 'NeoRide NR-1 Sport',
    subtitleFr: 'Moto électrique routière & périurbaine haute autonomie',
    subtitleAr: 'دراجة كهربائية رياضية للمدينة والطرق الإقليمية بمدى طويل',
    kickerFr: 'Moto Électrique · Batterie Amovible',
    kickerAr: 'دراجة كهربائية · بطارية قابلة للإزالة',
    priceFormatted: '24\u00a0900',
    priceDh: 24900,
    rangeKm: 90,
    speedKmh: 85,
    chargeHours: 5,
    batteryLabelFr: '72V · 30Ah Lithium',
    batteryLabelAr: '72V · 30Ah ليثيوم',
    removableBattery: true,
    costPer100KmDh: 4.5,
    colors: [
      { id: 'green', nameFr: 'Vert NeoRide', nameAr: 'أخضر نيوريد', hex: '#2dff6e' },
      { id: 'silver', nameFr: 'Argent Titane', nameAr: 'فضي تيتانيوم', hex: '#cbd5e1' },
      { id: 'stealth', nameFr: 'Noir Carbone', nameAr: 'أسود كربوني', hex: '#64748b' },
    ],
    specs: [
      { value: '90 km', labelFr: 'Autonomie réelle', labelAr: 'مدى السير', type: 'range', ratio: 100 },
      { value: '85 km/h', labelFr: 'Vitesse max', labelAr: 'السرعة القصوى', type: 'speed', ratio: 100 },
      { value: '5 h', labelFr: 'Charge complète', labelAr: 'مدة الشحن', type: 'charge' },
      { value: '72V 30Ah', labelFr: 'Batterie lithium', labelAr: 'بطارية ليثيوم', type: 'battery' },
    ],
    highlightsFr: [
      'Moteur Brushless 3000W en crête avec récupération d’énergie au freinage',
      'Freinage à disque hydraulique avant/arrière CBS et éclairage Full LED',
      'Batterie extractible à poignée ergonomique chargeable sur prise 220V domestique',
      'Tableau de bord numérique LCD haute visibilité avec 3 modes de conduite',
    ],
    highlightsAr: [
      'محرك بدون فحمات بقوة 3000 واط مع استرجاع الطاقة عند الفرملة',
      'فرامل قرصية هيدروليكية أمامية وخلفية مع إضاءة LED كاملة',
      'بطارية قابلة للإزالة بمقبض مريح تشحن في أي مقبس منزلي 220 فولت',
      'شاشة رقمية واضحة مع 3 أوضاع قيادة (اقتصادي، مدينة، رياضي)',
    ],
    idealForFr: 'Trajets Berkane ↔ Saïdia / Ahfir et usage intensif ou livraison rapide',
    idealForAr: 'رحلات بركان ↔ السعيدية / أحفير والاستعمال المكثف أو التوصيل السريع',
  },
  {
    id: 'urban-3000',
    category: 'moto',
    artKind: 'moto',
    name: 'NeoRide Urban 3000',
    nameAr: 'NeoRide Urban 3000',
    subtitleFr: 'Le compromis équilibré pour la ville et les trajets quotidiens',
    subtitleAr: 'التوازن المثالي للتنقل اليومي داخل المدينة والعمل',
    kickerFr: 'Moto Électrique · Usage Quotidien',
    kickerAr: 'دراجة كهربائية · تنقل يومي',
    priceFormatted: '17\u00a0500',
    priceDh: 17500,
    rangeKm: 70,
    speedKmh: 70,
    chargeHours: 6,
    batteryLabelFr: '60V · 26Ah Lithium',
    batteryLabelAr: '60V · 26Ah ليثيوم',
    removableBattery: true,
    costPer100KmDh: 3.8,
    colors: [
      { id: 'silver', nameFr: 'Argent Acier', nameAr: 'فضي معدني', hex: '#aeb8b2' },
      { id: 'green', nameFr: 'Vert NeoRide', nameAr: 'أخضر نيوريد', hex: '#2dff6e' },
      { id: 'cobalt', nameFr: 'Bleu Nuit', nameAr: 'أزرق ليلي', hex: '#60a5fa' },
    ],
    specs: [
      { value: '70 km', labelFr: 'Autonomie réelle', labelAr: 'مدى السير', type: 'range', ratio: 78 },
      { value: '70 km/h', labelFr: 'Vitesse max', labelAr: 'السرعة القصوى', type: 'speed', ratio: 82 },
      { value: '6 h', labelFr: 'Charge complète', labelAr: 'مدة الشحن', type: 'charge' },
      { value: '60V 26Ah', labelFr: 'Batterie amovible', labelAr: 'بطارية قابلة للإزالة', type: 'battery' },
    ],
    highlightsFr: [
      'Selle biplace confortable et porte-bagages renforcé compatible top-case livreur',
      'Batterie 60V 26Ah compatible avec nos batteries de rechange en stock à Berkane',
      'Alarme intégrée avec verrouillage moteur à distance et démarrage sans clé',
      'Coût de recharge inférieur à 2,5 DH pour 70 km d’autonomie',
    ],
    highlightsAr: [
      'مقعد مريح لشخصين مع حامل خلفي مقوّى مناسب لصندوق التوصيل',
      'بطارية 60V 26Ah متوافقة مع البطاريات الاحتياطية المتوفرة في معرض بركان',
      'جهاز إنذار مدمج مع قفل المحرك عن بعد وتشغيل بدون مفتاح',
      'تكلفة شحن أقل من 2.5 درهم لقطع 70 كم',
    ],
    idealForFr: 'Déplacements quotidiens Berkane / Ahfir et livreurs urbains (Glovo, coursiers)',
    idealForAr: 'التنقل اليومي في بركان / أحفير وموزّعي الطلبات داخل المدينة',
  },
  {
    id: 'eco-city',
    category: 'scoot',
    artKind: 'scoot',
    name: 'Scooter Eco City',
    nameAr: 'Scooter Eco City',
    subtitleFr: 'Scooter électrique agile, léger et ultra-économique en ville',
    subtitleAr: 'سكوتر كهربائي خفيف وعملي واقتصادي جدًا داخل المدينة',
    kickerFr: 'Mobilité Urbaine · Plancher Plat',
    kickerAr: 'تنقل حضري · أرضية مسطحة',
    priceFormatted: '9\u00a0900',
    priceDh: 9900,
    rangeKm: 55,
    speedKmh: 45,
    chargeHours: 5,
    batteryLabelFr: '48V · 20Ah',
    batteryLabelAr: '48V · 20Ah',
    removableBattery: true,
    costPer100KmDh: 2.5,
    colors: [
      { id: 'green', nameFr: 'Vert Émeraude', nameAr: 'أخضر زمردي', hex: '#2dff6e' },
      { id: 'pearl', nameFr: 'Blanc Perle', nameAr: 'أبيض لؤلؤي', hex: '#f1f5f9' },
    ],
    specs: [
      { value: '55 km', labelFr: 'Autonomie ville', labelAr: 'مدى السير', type: 'range', ratio: 61 },
      { value: '45 km/h', labelFr: 'Vitesse max', labelAr: 'السرعة القصوى', type: 'speed', ratio: 53 },
      { value: '5 h', labelFr: 'Charge complète', labelAr: 'مدة الشحن', type: 'charge' },
      { value: '48V 20Ah', labelFr: 'Batterie légère', labelAr: 'بطارية خفيفة', type: 'battery' },
    ],
    highlightsFr: [
      'Prise en main immédiate, gabarit compact idéal pour se faufiler et stationner',
      'Plancher plat pratique pour transporter un sac ou des courses quotidiennes',
      'Batterie légère facile à monter en appartement ou au bureau',
      'Entretien quasi nul : ni huile, ni courroie, ni filtre',
    ],
    highlightsAr: [
      'قيادة سهلة وفورية وحجم مدمج مثالي للتنقل والركن السريع',
      'أرضية مسطحة عملية لحمل الحقيبة أو المشتريات اليومية',
      'بطارية خفيفة يسهل حملها إلى الشقة أو المكتب',
      'صيانة شبه منعدمة: بدون زيت أو سير أو فلاتر',
    ],
    idealForFr: 'Étudiants, employés et trajets centre-ville à Berkane, Oujda ou Nador',
    idealForAr: 'الطلبة والموظفون والتنقل وسط المدينة في بركان أو وجدة أو الناظور',
  },
  {
    id: 'pro-x',
    category: 'scoot',
    artKind: 'kick',
    name: 'Trottinette Pro X',
    nameAr: 'Trottinette Pro X',
    subtitleFr: 'Trottinette pliable haute autonomie pour le dernier kilomètre',
    subtitleAr: 'تروتينيت قابلة للطي بمدى ممتاز للتنقل السريع والمرن',
    kickerFr: 'Mobilité Urbaine · Pliable en 3 sec',
    kickerAr: 'تنقل حضري · تطوى في 3 ثوانٍ',
    priceFormatted: '5\u00a0200',
    priceDh: 5200,
    rangeKm: 40,
    speedKmh: 35,
    chargeHours: 4,
    batteryLabelFr: '36V · 15Ah',
    batteryLabelAr: '36V · 15Ah',
    removableBattery: false,
    costPer100KmDh: 1.5,
    colors: [
      { id: 'green', nameFr: 'Noir & Vert', nameAr: 'أسود وأخضر', hex: '#2dff6e' },
      { id: 'silver', nameFr: 'Gris Aluminium', nameAr: 'رمادي ألمنيوم', hex: '#94a3b8' },
    ],
    specs: [
      { value: '40 km', labelFr: 'Autonomie ville', labelAr: 'مدى السير', type: 'range', ratio: 44 },
      { value: '35 km/h', labelFr: 'Vitesse max', labelAr: 'السرعة القصوى', type: 'speed', ratio: 41 },
      { value: '4 h', labelFr: 'Charge rapide', labelAr: 'مدة الشحن', type: 'charge' },
      { value: '36V 15Ah', labelFr: 'Batterie intégrée', labelAr: 'بطارية مدمجة', type: 'battery' },
    ],
    highlightsFr: [
      'Châssis en alliage d’aluminium aéronautique pliable en 3 secondes',
      'Pneus 10 pouces renforcés anti-crevaison adaptés aux chaussées urbaines',
      'Double système de freinage (disque arrière + frein moteur régénératif E-ABS)',
      'Écran LED intégré au guidon (vitesse, niveau de batterie, mode piéton/sport)',
    ],
    highlightsAr: [
      'هيكل من الألومنيوم المتين يطوى في 3 ثوانٍ لحمله في السيارة أو المكتب',
      'إطارات 10 بوصات مقوّاة ومقاومة للثقب مناسبة لطرقات المدينة',
      'نظام فرملة مزدوج (قرص خلفي + فرملة إلكترونية E-ABS)',
      'شاشة LED مدمجة في المقود لعرض السرعة ونسبة البطارية',
    ],
    idealForFr: 'Courts trajets urbains, corniche de Saïdia et rangement facile en appartement',
    idealForAr: 'المسافات القصيرة، كورنيش السعيدية، والتخزين السهل داخل الشقة',
  },
  {
    id: 'casque-neoride',
    category: 'piece',
    artKind: 'helmet',
    name: 'Casque Intégral NeoRide',
    nameAr: 'خوذة متكاملة NeoRide',
    subtitleFr: 'Protection homologuée ECE 22.06 avec ventilation et écran anti-rayures',
    subtitleAr: 'حماية معتمدة بمعيار ECE 22.06 مع تهوية وواقٍ مقاوم للخدش',
    kickerFr: 'Équipement & Sécurité · ECE 22.06',
    kickerAr: 'تجهيزات السلامة · معيار ECE 22.06',
    priceFormatted: '890',
    priceDh: 890,
    rangeKm: 0,
    speedKmh: 0,
    chargeHours: 0,
    batteryLabelFr: 'Tailles S à XL',
    batteryLabelAr: 'مقاسات S إلى XL',
    removableBattery: false,
    costPer100KmDh: 0,
    colors: [
      { id: 'green', nameFr: 'Noir & Liseré Vert', nameAr: 'أسود بخط أخضر', hex: '#2dff6e' },
      { id: 'matte', nameFr: 'Noir Mat Intégral', nameAr: 'أسود غير لامع', hex: '#94a3b8' },
    ],
    specs: [
      { value: 'ECE 22.06', labelFr: 'Homologation route', labelAr: 'معيار السلامة', type: 'info' },
      { value: 'S – XL', labelFr: 'Tailles au showroom', labelAr: 'المقاسات المتوفرة', type: 'info' },
      { value: 'Anti-UV', labelFr: 'Visière anti-rayures', labelAr: 'واقٍ مقاوم للخدش', type: 'info' },
      { value: 'Lavable', labelFr: 'Intérieur démontable', labelAr: 'بطانة قابلة للغسل', type: 'info' },
    ],
    highlightsFr: [
      'Coque thermoplastique haute résistance aux impacts homologuée ECE 22.06',
      'Mousses intérieures hypoallergéniques démontables et lavables',
      'Système d’aération mentonnière et frontal adapté au climat de l’Oriental',
      'Essayage de taille directement au showroom NeoRide à Berkane',
    ],
    highlightsAr: [
      'هيكل خارجي متين مقاوم للصدمات ومعتمد وفق معيار ECE 22.06',
      'بطانة داخلية مريحة قابلة للفك والغسل',
      'نظام تهوية أمامي وعلوي مناسب لمناخ الجهة الشرقية',
      'إمكانية قياس وتجربة الخوذة مباشرة في معرض بركان',
    ],
    idealForFr: 'Sécurité quotidienne moto & scooter électrique',
    idealForAr: 'الحماية اليومية لسائقي الدراجات والسكوترات الكهربائية',
  },
  {
    id: 'batterie-60v',
    category: 'piece',
    artKind: 'battery',
    name: 'Batterie de rechange 60V',
    nameAr: 'بطارية احتياطية 60V',
    subtitleFr: 'Doublez votre autonomie quotidienne ou remplacez votre pack existant',
    subtitleAr: 'ضاعف مدى سيرك اليومي أو استبدل بطاريتك الحالية بدون توقف',
    kickerFr: 'Pièce d’Origine · Lithium-Ion 26Ah',
    kickerAr: 'قطعة أصلية · ليثيوم-أيون 26Ah',
    priceFormatted: '4\u00a0800',
    priceDh: 4800,
    rangeKm: 70,
    speedKmh: 0,
    chargeHours: 6,
    batteryLabelFr: '60V · 26Ah BMS intégré',
    batteryLabelAr: '60V · 26Ah مع حماية BMS',
    removableBattery: true,
    costPer100KmDh: 0,
    colors: [
      { id: 'green', nameFr: 'Pack 60V 26Ah', nameAr: 'بطارية 60V 26Ah', hex: '#2dff6e' },
    ],
    specs: [
      { value: '26Ah', labelFr: 'Capacité Lithium-Ion', labelAr: 'سعة ليثيوم-أيون', type: 'battery' },
      { value: '60V', labelFr: 'Tension nominale', labelAr: 'الجهد الكهربائي', type: 'battery' },
      { value: '+70 km', labelFr: 'Autonomie ajoutée', labelAr: 'مدى إضافي', type: 'range', ratio: 78 },
      { value: 'Urban 3000', labelFr: 'Compatibilité directe', labelAr: 'متوافقة مع Urban 3000', type: 'info' },
    ],
    highlightsFr: [
      'Idéale pour les livreurs : roulez avec une batterie pendant que la seconde charge',
      'Gestion électronique BMS intégrée (protection surcharge, court-circuit et température)',
      'Connecteur haute intensité plug-and-play et indicateur LED de niveau de charge',
      'Vérification de compatibilité en atelier chez Zelloufi à Berkane',
    ],
    highlightsAr: [
      'مثالية للموزعين: اشتغل ببطارية بينما تشحن الثانية في المنزل أو المحل',
      'نظام حماية ذكي BMS ضد الشحن الزائد والحرارة والماس الكهربائي',
      'مؤشر LED مدمج لمعرفة نسبة الشحن بضغطة زر',
      'فحص التوافق والتركيب متوفر في ورشة زلّوفي ببركان',
    ],
    idealForFr: 'Livreurs professionnels et gros rouleurs souhaitant 140 km/jour sans attente',
    idealForAr: 'الموزعون المحترفون ومن يحتاجون إلى 140 كم يوميًا دون انتظار الشحن',
  },
];

export const VEHICLE_PRODUCTS = PRODUCTS.filter((p) => p.category !== 'piece');

export interface RoutePreset {
  id: string;
  km: number;
  labelFr: string;
  labelAr: string;
  descFr: string;
  descAr: string;
}

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'berkane-ville',
    km: 15,
    labelFr: 'Berkane Ville (15 km)',
    labelAr: 'بركان المدينة (15 كم)',
    descFr: 'Allers-retours travail, courses et centre-ville',
    descAr: 'التنقل اليومي للعمل والتبضع وسط المدينة',
  },
  {
    id: 'berkane-ahfir',
    km: 35,
    labelFr: 'Berkane ↔ Ahfir (35 km)',
    labelAr: 'بركان ↔ أحفير (35 كم)',
    descFr: 'Liaison quotidienne inter-villes et périphérie',
    descAr: 'التنقل اليومي بين بركان وأحفير والمناطق المجاورة',
  },
  {
    id: 'berkane-saidia',
    km: 50,
    labelFr: 'Berkane ↔ Saïdia (50 km)',
    labelAr: 'بركان ↔ السعيدية (50 كم)',
    descFr: 'Trajet côtier aller-retour sur route ouverte',
    descAr: 'رحلة ذهاب وإياب نحو السعيدية على الطريق',
  },
  {
    id: 'livreur-pro',
    km: 85,
    labelFr: 'Livreur / Intensif (85 km)',
    labelAr: 'موزّع / استعمال مكثف (85 كم)',
    descFr: 'Service continu Glovo, restauration et coursiers',
    descAr: 'عمل يومي مكثف للتوصيل والمطاعم والطلبيات',
  },
];

export const ORIENTAL_CITIES = [
  {
    id: 'berkane',
    nameFr: 'Berkane',
    nameAr: 'بركان',
    tagFr: 'Showroom & Atelier sur place',
    tagAr: 'المعرض والورشة بعين المكان',
    msgFr: 'Bonjour NeoRide, je suis à Berkane et je souhaite des informations sur vos motos électriques.',
    msgAr: 'السلام عليكم NeoRide، أنا فبركان وبغيت معلومات على الدراجات الكهربائية المتوفرة.',
  },
  {
    id: 'oujda',
    nameFr: 'Oujda',
    nameAr: 'وجدة',
    tagFr: 'Livraison directe (~60 km)',
    tagAr: 'توصيل مباشر (~60 كم)',
    msgFr: 'Bonjour NeoRide, je suis à Oujda. Quelles sont les options et délais de livraison chez moi ?',
    msgAr: 'السلام عليكم NeoRide، أنا فوجدة. شنو هي شروط ومدة التوصيل لعندي؟',
  },
  {
    id: 'nador',
    nameFr: 'Nador',
    nameAr: 'الناظور',
    tagFr: 'Livraison directe (~75 km)',
    tagAr: 'توصيل مباشر (~75 كم)',
    msgFr: 'Bonjour NeoRide, je suis à Nador. Livrez-vous chez moi et comment fonctionne le suivi ?',
    msgAr: 'السلام عليكم NeoRide، أنا فالناظور. واش كتوصلو لعندي وكيفاش كيدوز الضمان؟',
  },
  {
    id: 'saidia',
    nameFr: 'Saïdia',
    nameAr: 'السعيدية',
    tagFr: 'Livraison rapide (~25 km)',
    tagAr: 'توصيل سريع (~25 كم)',
    msgFr: 'Bonjour NeoRide, je suis à Saïdia. Livrez-vous chez moi ?',
    msgAr: 'السلام عليكم NeoRide، أنا فالسعيدية. واش كتوصلو للدار؟',
  },
  {
    id: 'taourirt',
    nameFr: 'Taourirt',
    nameAr: 'تاوريرت',
    tagFr: 'Expédition régionale',
    tagAr: 'شحن جهوي',
    msgFr: 'Bonjour NeoRide, je suis à Taourirt. Livrez-vous chez moi ?',
    msgAr: 'السلام عليكم NeoRide، أنا فتاوريرت. واش كتوصلو لعندي؟',
  },
  {
    id: 'ahfir',
    nameFr: 'Ahfir',
    nameAr: 'أحفير',
    tagFr: 'À 20 min du showroom',
    tagAr: 'على بعد 20 دقيقة من المعرض',
    msgFr: 'Bonjour NeoRide, je suis à Ahfir. Livrez-vous chez moi ou puis-je passer essayer aujourd’hui ?',
    msgAr: 'السلام عليكم NeoRide، أنا فأحفير. واش كتوصلو ولا نقدر نجي نجرّب فالمعرض؟',
  },
];

export interface FaqItem {
  id: string;
  category: 'delivery' | 'range' | 'service';
  qFr: string;
  qAr: string;
  aFr: string;
  aAr: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-oriental',
    category: 'delivery',
    qFr: 'Livrez-vous à Oujda, Nador, Saïdia et dans le reste de l’Oriental ?',
    qAr: 'هل توصلون إلى وجدة والناظور والسعيدية وباقي جهة الشرق؟',
    aFr: 'Notre showroom et notre atelier sont situés à Berkane, et nous servons les clients de toute la région de l’Oriental. Pour une expédition vers Oujda, Nador, Saïdia, Taourirt ou Ahfir, écrivez-nous sur WhatsApp : nous vous confirmons immédiatement les modalités et le délai.',
    aAr: 'يقع معرضنا وورشتنا في بركان، ونستقبل طلبات الزبناء من مختلف مدن الجهة الشرقية. للتوصيل إلى وجدة أو الناظور أو السعيدية أو تاوريرت أو أحفير، راسلنا عبر واتساب وسنؤكد لك الشروط والمدة فورًا.',
  },
  {
    id: 'faq-pieces',
    category: 'service',
    qFr: 'Est-ce que les pièces de rechange sont disponibles chez Zelloufi ?',
    qAr: 'هل قطع الغيار متوفرة لدى زلّوفي في بركان؟',
    aFr: 'Batteries, chargeurs, plaquettes de frein, pneus, contrôleurs et casques : nous suivons les pièces compatibles avec nos modèles. Envoyez une photo de la pièce ou le modèle de votre moto sur WhatsApp pour vérifier le stock avant de vous déplacer.',
    aAr: 'البطاريات، الشواحن، صفائح الفرامل، الإطارات والخوذات: نوفر قطع الغيار المتوافقة مع موديلاتنا. أرسل صورة القطعة أو اسم الموديل عبر واتساب للتأكد من التوفر قبل التنقل.',
  },
  {
    id: 'faq-autonomie',
    category: 'range',
    qFr: 'Quelle est l’autonomie réelle d’une moto électrique NeoRide ?',
    qAr: 'ما هو مدى السير الحقيقي للدراجة الكهربائية؟',
    aFr: 'Selon le modèle choisi, l’autonomie varie de 40 km (Trottinette Pro X) à 90 km (NR-1 Sport) par charge. Elle dépend du poids transporté, du vent, du relief et du mode de vitesse utilisé. Notre calculateur et notre équipe vous orientent vers le modèle qui couvre vos trajets avec une marge de sécurité.',
    aAr: 'حسب الطراز المختار، يتراوح المدى بين 40 كم (Pro X) و90 كم (NR-1 Sport) في الشحنة الواحدة. ويتأثر بالوزن، المرتفعات، والسرعة. يساعدك فريقنا وحاسبة الموقع على اختيار الموديل الذي يغطي مسافتك اليومية بأمان.',
  },
  {
    id: 'faq-recharge',
    category: 'range',
    qFr: 'Combien coûte une recharge complète à la maison ?',
    qAr: 'كم تكلف الشحنة الكاملة في المنزل؟',
    aFr: 'Une recharge complète sur une prise domestique normale de 220V coûte environ 2 à 3,5 DH d’électricité selon la capacité de la batterie — soit 10 à 15 fois moins cher qu’un plein d’essence pour la même distance.',
    aAr: 'تكلف الشحنة الكاملة في مقبس منزلي عادي (220V) ما بين 2 و3.5 دراهم فقط من الكهرباء حسب سعة البطارية، أي أقل بـ 10 إلى 15 مرة من تكلفة البنزين لنفس المسافة.',
  },
  {
    id: 'faq-appartement',
    category: 'range',
    qFr: 'J’habite en appartement sans garage avec prise : comment recharger ?',
    qAr: 'أسكن في شقة ولا يوجد مقبس كهربائي في المرآب، كيف أشحن الدراجة؟',
    aFr: 'Nos motos et scooters principaux disposent d’une batterie lithium amovible à poignée. Vous la déclipsez en 10 secondes, vous la montez chez vous ou au bureau comme un sac, et vous la branchez sur n’importe quelle prise 220V.',
    aAr: 'تتوفر دراجاتنا الرئيسية على بطارية ليثيوم قابلة للإزالة بمقبض مريح. يمكنك فكها في 10 ثوانٍ، والصعود بها إلى شقتك أو مكتبك وشحنها في أي مقبس عادي 220 فولت مثل الهاتف.',
  },
  {
    id: 'faq-essai',
    category: 'service',
    qFr: 'Puis-je essayer une moto avant d’acheter à Berkane ?',
    qAr: 'هل يمكنني تجربة الدراجة قبل الشراء في معرض بركان؟',
    aFr: 'Oui. Utilisez le module « Réserver un essai » sur cette page pour choisir le modèle, le jour et l’heure qui vous arrangent. Notre équipe confirme votre créneau sur WhatsApp pour que le véhicule soit prêt à votre arrivée.',
    aAr: 'نعم بكل تأكيد. استعمل قسم « احجز تجربة » في هذه الصفحة لاختيار الطراز واليوم والساعة المناسبة لك، وسيؤكد فريقنا موعدك عبر واتساب لتكون الدراجة جاهزة عند وصولك.',
  },
  {
    id: 'faq-garantie',
    category: 'service',
    qFr: 'Y a-t-il une garantie et un service après-vente local ?',
    qAr: 'هل يوجد ضمان وخدمة ما بعد البيع محليًا في بركان؟',
    aFr: 'Oui, chaque véhicule bénéficie d’une garantie constructeur (cadre, moteur, batterie selon les conditions propres à chaque modèle) et d’un suivi dans notre atelier à Berkane. Nous vous remettons les conditions détaillées par écrit avant l’achat.',
    aAr: 'نعم، يستفيد كل طراز من ضمان الشركة المصنّعة ومتابعة مباشرة في ورشتنا ببركان. نقدم لك كافة تفاصيل وشروط الضمان مكتوبة بوضوح قبل الشراء.',
  },
];

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getShowroomStatus(now = new Date()): {
  isOpen: boolean;
  localTimeStr: string;
} {
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Casablanca',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
        .formatToParts(now)
        .map((p) => [p.type, p.value])
    );
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    const isOpen = parts.weekday !== 'Sun' && minutes >= 9 * 60 && minutes < 19 * 60 + 30;
    return {
      isOpen,
      localTimeStr: `${parts.hour}:${parts.minute}`,
    };
  } catch {
    return { isOpen: true, localTimeStr: '10:00' };
  }
}
