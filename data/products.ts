export interface ProductData {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  nameKey: string;
  subtitleKey: string;
  ref: string;
  ean: string;
  price: number;
  oldPrice?: number;
  priceHT: number;
  stock: "in" | "order";
  stockQty: number;
  rating: number;
  reviewCount: number;
  category: string[];
  brands: string[];
  images: string[];
  has3D: boolean;
  dimensions: string;
  material: string;
  weight: string;
  compatibleModels: string[];
  installDifficulty: "Facile" | "Intermédiaire" | "Expert";
  installTime: string;
  installVideoUrl: string;
  installSteps: { num: number; title: string; desc: string }[];
}

const PRODUCTS: ProductData[] = [
  {
    id: 1,
    slug: "joint-hublot-whirlpool-c00094128",
    nameKey: "products.product1Name",
    subtitleKey: "products.product1Sub",
    name: "Joint de hublot",
    subtitle: "Lave-linge Whirlpool / Bauknecht",
    ref: "C00094128",
    ean: "8003980399369",
    price: 42.9,
    priceHT: 35.45,
    stock: "in",
    stockQty: 14,
    rating: 4.8,
    reviewCount: 124,
    category: ["Lave-linge", "Joints", "Joint de hublot"],
    brands: ["Whirlpool", "Bauknecht", "Bosch", "Indesit", "Hotpoint", "Maytag", "Ignis", "Laden", "Philips", "KIC", "Tecnik", "Polar"],
    images: ["/images/products/1-joint-hublot.jpg"],
    has3D: false,
    dimensions: "Ø ext. 520 mm · Ø int. 330 mm · Lèvre 40 mm",
    material: "EPDM (caoutchouc synthétique)",
    weight: "310 g",
    compatibleModels: [
      "WAE24364FF", "WAE20367FF", "WAF2870BY", "WFW94HEX",
      "WMYH9B26",   "WAT28400",   "WAE28462",  "WIXL126",
      "PWDE9128S",  "HWDB8614W",  "AWZ514",    "WA6252YH",
      "WTW7120HW",  "WFL2090U",   "IWT6143",   "WDPE9128S",
    ],
    installDifficulty: "Facile",
    installTime: "30 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Retirer l'ancien joint",
        desc: "Débranchez le lave-linge. Ouvrez la porte et repérez le collier de serrage qui maintient le joint. Desserrez-le avec un tournevis plat en tournant dans le sens antihoraire.",
      },
      {
        num: 2,
        title: "Poser le nouveau joint",
        desc: "Insérez le nouveau joint en commençant par le haut (repère de positionnement). Faites-le glisser progressivement tout autour de l'ouverture jusqu'à ce qu'il soit bien en place.",
      },
      {
        num: 3,
        title: "Fixer et tester",
        desc: "Resserrez le collier de serrage. Refermez la trappe et lancez un programme court à vide pour vérifier l'absence totale de fuite.",
      },
    ],
  },

  {
    id: 2,
    slug: "pompe-vidange-beko-481281729632",
    nameKey: "products.product2Name",
    subtitleKey: "products.product2Sub",
    name: "Pompe de vidange",
    subtitle: "Lave-linge Beko / Arçelik",
    ref: "481281729632",
    ean: "8690842103254",
    price: 38.5,
    oldPrice: 49.0,
    priceHT: 31.82,
    stock: "in",
    stockQty: 8,
    rating: 4.6,
    reviewCount: 87,
    category: ["Lave-linge", "Pompe & vidange", "Pompe de vidange"],
    brands: ["Beko", "Arçelik", "Grundig", "Blomberg", "Leisure"],
    images: ["/images/products/2-pompe-vidange.jpg"],
    has3D: false,
    dimensions: "Ø 80 mm · Hauteur 95 mm · Débit 16 L/min",
    material: "Polypropylène & acier inoxydable",
    weight: "185 g",
    compatibleModels: [
      "WMA510W",  "WMA712S",  "WMA820W",  "BK7102",
      "BK9102",   "WTV7744",  "WMB71021", "WMB81221",
      "D5836",    "DWF7120",  "AWT51001", "BK71031",
    ],
    installDifficulty: "Intermédiaire",
    installTime: "45 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Accéder à la pompe",
        desc: "Déposez le panneau frontal bas du lave-linge (2 vis sous la trappe de filtre). La pompe de vidange est visible en bas à droite. Placez une cuvette pour récupérer l'eau résiduelle.",
      },
      {
        num: 2,
        title: "Déconnecter l'ancienne pompe",
        desc: "Débranchez le connecteur électrique. Dévissez les colliers des tuyaux d'entrée et de sortie. Retirez la pompe défectueuse en la faisant pivoter légèrement.",
      },
      {
        num: 3,
        title: "Installer et tester",
        desc: "Positionnez la nouvelle pompe, reconnectez les tuyaux et le connecteur électrique. Revissez le panneau, rebranchez l'appareil et lancez un cycle de vidange.",
      },
    ],
  },

  {
    id: 3,
    slug: "courroie-miele-1258c-epj",
    nameKey: "products.product3Name",
    subtitleKey: "products.product3Sub",
    name: "Courroie d'entraînement",
    subtitle: "Lave-linge Miele / AEG / Electrolux",
    ref: "1258C-EPJ",
    ean: "4002516227831",
    price: 16.2,
    priceHT: 13.39,
    stock: "in",
    stockQty: 32,
    rating: 4.7,
    reviewCount: 203,
    category: ["Lave-linge", "Transmission", "Courroie"],
    brands: ["Miele", "AEG", "Electrolux", "Zanussi", "Privileg", "Rex", "Fagor"],
    images: ["/images/products/3-courroie.jpg"],
    has3D: false,
    dimensions: "L 1258 mm · Largeur 8 mm · Section C",
    material: "Néoprène renforcé fibre",
    weight: "65 g",
    compatibleModels: [
      "W3164",   "W3244",   "W3741",   "W3842",
      "L74850",  "L76475",  "L84850",  "WAL6E300",
      "EWW1474", "FWD71480", "WAGL2E200", "W3165",
      "L67480",  "EWF1498",
    ],
    installDifficulty: "Facile",
    installTime: "20 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Exposer le tambour",
        desc: "Retirez le panneau arrière (4 vis). Le tambour et la poulie moteur sont maintenant visibles. La courroie usée peut être cassée ou simplement détendue.",
      },
      {
        num: 2,
        title: "Poser la nouvelle courroie",
        desc: "Enroulez la courroie autour du tambour en premier. Maintenez-la en tension et positionnez-la sur la poulie du moteur. La courroie doit être centrée et sans vrille.",
      },
      {
        num: 3,
        title: "Vérifier la tension et refermer",
        desc: "Faites tourner le tambour à la main pour vérifier que la courroie reste en place. Remontez le panneau arrière et testez un cycle court.",
      },
    ],
  },

  {
    id: 4,
    slug: "thermostat-liebherr-ts-r59l1102",
    nameKey: "products.product4Name",
    subtitleKey: "products.product4Sub",
    name: "Thermostat de réfrigérateur",
    subtitle: "Réfrigérateur Liebherr / Siemens",
    ref: "TS-R59L1102",
    ean: "4016803065548",
    price: 28.0,
    priceHT: 23.14,
    stock: "in",
    stockQty: 19,
    rating: 4.5,
    reviewCount: 61,
    category: ["Réfrigérateur", "Régulation", "Thermostat"],
    brands: ["Liebherr", "Siemens", "Bosch", "Neff", "Constructa", "Balay"],
    images: ["/images/products/4-thermostat.jpg"],
    has3D: false,
    dimensions: "L 67 mm · l 38 mm · H 30 mm · Capillaire 900 mm",
    material: "Plastique ABS · Tube capillaire cuivre",
    weight: "95 g",
    compatibleModels: [
      "KT1444",  "KT1544",  "KTS1544", "KTS1644",
      "GNP3056", "CNP3056", "KGE3640", "KGN3655",
      "KI2223",  "KI2423",  "KI2822",  "GS3614",
    ],
    installDifficulty: "Intermédiaire",
    installTime: "40 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Localiser le thermostat",
        desc: "Débranchez le réfrigérateur. Le thermostat se trouve généralement dans le compartiment réfrigérateur, sous le boîtier de commande. Retirez les clayettes pour y accéder.",
      },
      {
        num: 2,
        title: "Déposer l'ancien thermostat",
        desc: "Retirez le bouton de réglage, puis déclipsez le boîtier. Notez la position des fils (prenez une photo) et débranchez chaque connecteur. Dégagez le tube capillaire doucement.",
      },
      {
        num: 3,
        title: "Installer et régler",
        desc: "Positionnez le nouveau thermostat, passez le tube capillaire dans son logement d'origine et reconnectez les fils. Remontez le boîtier et testez le cycle de froid.",
      },
    ],
  },

  {
    id: 5,
    slug: "resistance-four-brandt-rf-78954",
    nameKey: "products.product5Name",
    subtitleKey: "products.product5Sub",
    name: "Résistance de four",
    subtitle: "Four Brandt / De Dietrich",
    ref: "RF-78954",
    ean: "3560790120458",
    price: 45.9,
    priceHT: 37.93,
    stock: "order",
    stockQty: 0,
    rating: 4.4,
    reviewCount: 38,
    category: ["Four & Cuisinière", "Chauffe", "Résistance"],
    brands: ["Brandt", "De Dietrich", "Fagor", "Sauter", "Vedette", "Thomson"],
    images: ["/images/products/5-resistance-four.jpg"],
    has3D: false,
    dimensions: "L 420 mm · l 380 mm · Puissance 2000 W · 230 V",
    material: "Alliage Kanthal · Gaine inox",
    weight: "420 g",
    compatibleModels: [
      "FP668XE1", "FP668BE1", "FC668XE1", "FP460XE1",
      "BOP668X",  "BOX668X",  "DOP460X",  "DOP560X",
      "FOS680X",  "FOS580X",  "DOC460X",  "DOC560X",
    ],
    installDifficulty: "Intermédiaire",
    installTime: "50 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Mettre l'appareil hors tension",
        desc: "Coupez le disjoncteur dédié au four. Attendez 30 minutes que la cavité refroidisse complètement. Retirez la lèchefrite et les grilles.",
      },
      {
        num: 2,
        title: "Déposer la résistance",
        desc: "Retirez les vis de fixation de la résistance (généralement 2 vis à l'arrière de la cavité). Tirez doucement la résistance vers l'avant et débranchez les cosses électriques.",
      },
      {
        num: 3,
        title: "Poser et tester",
        desc: "Connectez les cosses sur la nouvelle résistance, repoussez-la en place et revissez. Remettez sous tension et testez en mode gril à 200 °C pendant 5 minutes.",
      },
    ],
  },

  {
    id: 6,
    slug: "electrovanne-bosch-ev-2v-bsh",
    nameKey: "products.product6Name",
    subtitleKey: "products.product6Sub",
    name: "Électrovanne d'eau",
    subtitle: "Lave-vaisselle Bosch / Siemens / Neff",
    ref: "EV-2V-BSH",
    ean: "4242002851654",
    price: 32.5,
    priceHT: 26.86,
    stock: "in",
    stockQty: 11,
    rating: 4.6,
    reviewCount: 75,
    category: ["Lave-vaisselle", "Alimentation eau", "Électrovanne"],
    brands: ["Bosch", "Siemens", "Neff", "Constructa", "Balay", "Gaggenau"],
    images: ["/images/products/6-electrovanne.jpg"],
    has3D: false,
    dimensions: "2 voies · Entrée 3/4\" · Pression 0,03–1 MPa · 230 V / 50 Hz",
    material: "Corps laiton · Joint EPDM · Bobine cuivre",
    weight: "140 g",
    compatibleModels: [
      "SMV50E10",  "SMV53L00",  "SMU53M05",  "SMU50E05",
      "SN26M280",  "SN25E212",  "SN56M591",  "SE25M851",
      "SN65E012",  "SMI50E15",  "SF25M852",  "SN45E505",
    ],
    installDifficulty: "Intermédiaire",
    installTime: "35 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Couper l'arrivée d'eau",
        desc: "Fermez le robinet d'arrêt sous l'évier. Débranchez le lave-vaisselle. Tirez l'appareil vers vous pour accéder à l'arrière.",
      },
      {
        num: 2,
        title: "Remplacer l'électrovanne",
        desc: "Localisez l'électrovanne sur l'arrivée d'eau (arrière bas de l'appareil). Dévissez le tuyau d'alimentation, débranchez la bobine électrique et dévissez les vis de fixation.",
      },
      {
        num: 3,
        title: "Raccorder et tester",
        desc: "Vissez la nouvelle électrovanne, reconnectez le tuyau et la bobine. Rouvrez le robinet, rebranchez l'appareil et vérifiez l'absence de fuite sur un cycle complet.",
      },
    ],
  },

  {
    id: 7,
    slug: "filtre-hepa-dyson-hepa-dy-r",
    nameKey: "products.product7Name",
    subtitleKey: "products.product7Sub",
    name: "Filtre HEPA",
    subtitle: "Aspirateur Dyson / Rowenta",
    ref: "HEPA-DY-R",
    ean: "5025155017463",
    price: 24.9,
    priceHT: 20.58,
    stock: "in",
    stockQty: 27,
    rating: 4.9,
    reviewCount: 312,
    category: ["Aspirateur", "Filtration", "Filtre HEPA"],
    brands: ["Dyson", "Rowenta", "Philips", "Hoover", "Bosch", "Miele"],
    images: ["/images/products/7-filtre-hepa.jpg"],
    has3D: false,
    dimensions: "Ø 120 mm · Hauteur 55 mm",
    material: "Fibre de verre HEPA H13 · Cadre polypropylène",
    weight: "80 g",
    compatibleModels: [
      "DC19",  "DC23",  "DC28",  "DC29",
      "DC32",  "DC39",  "RO4711", "RO4715",
      "RO6369", "GD80", "GS80",  "VS90",
      "BSG82480", "SBCW3200",
    ],
    installDifficulty: "Facile",
    installTime: "5 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Localiser le filtre",
        desc: "Débranchez l'aspirateur. Le filtre HEPA se trouve généralement à l'arrière de l'appareil (sortie d'air) ou sous le bac à poussière selon le modèle.",
      },
      {
        num: 2,
        title: "Retirer l'ancien filtre",
        desc: "Tournez le filtre dans le sens antihoraire ou appuyez sur le clip de déverrouillage selon le modèle. Retirez-le et jetez-le dans un sac fermé.",
      },
      {
        num: 3,
        title: "Installer le nouveau filtre",
        desc: "Insérez le nouveau filtre HEPA et verrouillez-le en le tournant dans le sens horaire jusqu'au déclic. Rebranchez et testez l'aspiration.",
      },
    ],
  },

  {
    id: 8,
    slug: "moteur-indesit-mu-ih-550w",
    nameKey: "products.product8Name",
    subtitleKey: "products.product8Sub",
    name: "Moteur de lave-linge",
    subtitle: "Lave-linge Indesit / Hotpoint",
    ref: "MU-IH-550W",
    ean: "8007842763521",
    price: 89.0,
    priceHT: 73.55,
    stock: "in",
    stockQty: 5,
    rating: 4.5,
    reviewCount: 49,
    category: ["Lave-linge", "Motorisation", "Moteur"],
    brands: ["Indesit", "Hotpoint", "Ariston", "Scholtes", "Cannon"],
    images: ["/images/products/8-moteur.jpg"],
    has3D: false,
    dimensions: "Puissance 550 W · Tension 230 V · Vitesse max 12 000 tr/min",
    material: "Carcasse aluminium · Enroulements cuivre",
    weight: "2,1 kg",
    compatibleModels: [
      "WIXXL126",  "WIXL126",   "WIXE127",   "XWA71252W",
      "WF101",     "PWDE9128S", "WML520P",   "WML720P",
      "WML920P",   "XWA81252W", "IWT61252W", "IWD71451",
    ],
    installDifficulty: "Expert",
    installTime: "90 min",
    installVideoUrl: "#",
    installSteps: [
      {
        num: 1,
        title: "Démonter la carrosserie",
        desc: "Retirez les panneaux arrière et latéraux. Déconnectez tous les connecteurs du moteur et notez leur position. Retirez la courroie d'entraînement.",
      },
      {
        num: 2,
        title: "Extraire le moteur",
        desc: "Dévissez les 3 vis de fixation du moteur sur le châssis. Faites glisser le moteur vers le bas en dégageant ses plots anti-vibration. Une deuxième paire de mains peut être utile.",
      },
      {
        num: 3,
        title: "Installer et recâbler",
        desc: "Fixez le nouveau moteur sur ses plots, revissez, remontez la courroie et reconnectez tous les fils dans l'ordre. Remontez la carrosserie et testez un cycle complet.",
      },
    ],
  },
];

export default PRODUCTS;

/** Utility: find a product by slug */
export function getProductBySlug(slug: string): ProductData | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Utility: get related products (same category, excluding current) */
export function getRelatedProducts(product: ProductData, count = 4): ProductData[] {
  const sameCategory = product.category[0];
  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category[0] === sameCategory
  );
  // pad with products from other categories if not enough
  if (related.length < count) {
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && p.category[0] !== sameCategory
    );
    return [...related, ...others].slice(0, count);
  }
  return related.slice(0, count);
}
