import type { Era } from "@/types";
import { events } from "./events";

function keyEventsFor(eraId: string) {
  return events.filter((event) => event.eraId === eraId);
}

export const eras: Era[] = [
  {
    id: "antiquity",
    name: { fr: "Antiquité", en: "Antiquity" },
    yearStart: -3000,
    yearEnd: 476,
    colorPalette: ["#1a0a00", "#2d1810", "#4a2a1a", "#8b6914"],
    backgroundAssetUrl: "/images/eras/era-antiquity.webp",
    description: {
      fr: "Des premières civilisations méditerranéennes à la chute de Rome : pharaons, cités-états grecques et légions romaines.",
      en: "From the earliest Mediterranean civilizations to the fall of Rome: pharaohs, Greek city-states, and Roman legions.",
    },
    keyEvents: keyEventsFor("antiquity"),
  },
  {
    id: "middle-ages",
    name: { fr: "Moyen Âge", en: "Middle Ages" },
    yearStart: 476,
    yearEnd: 1453,
    colorPalette: ["#0a0f1a", "#1a2040", "#2a1a30", "#4a3a50"],
    backgroundAssetUrl: "/images/eras/era-middle-ages.webp",
    description: {
      fr: "Châteaux forts, cathédrales gothiques et invasions vikings : mille ans d'un monde féodal en perpétuelle recomposition.",
      en: "Stone castles, gothic cathedrals, and Viking raids: a thousand years of a feudal world in constant flux.",
    },
    keyEvents: keyEventsFor("middle-ages"),
  },
  {
    id: "renaissance",
    name: { fr: "Renaissance", en: "Renaissance" },
    yearStart: 1453,
    yearEnd: 1600,
    colorPalette: ["#1a1000", "#3d2b00", "#5c4a1a", "#8b7530"],
    backgroundAssetUrl: "/images/eras/era-renaissance.webp",
    description: {
      fr: "Cours italiennes, humanisme et grandes découvertes : l'Europe se réinvente entre art, science et intrigues de pouvoir.",
      en: "Italian courts, humanism, and great discoveries: Europe reinvents itself amid art, science, and courtly intrigue.",
    },
    keyEvents: keyEventsFor("renaissance"),
  },
  {
    id: "early-modern",
    name: { fr: "Époque Moderne", en: "Early Modern (Baroque)" },
    yearStart: 1600,
    yearEnd: 1789,
    colorPalette: ["#0a1a1a", "#1a3030", "#2a1a3a", "#3a2a4a"],
    backgroundAssetUrl: "/images/eras/era-early-modern.webp",
    description: {
      fr: "Monarchies absolues, guerres de religion et empires coloniaux : le faste des cours baroques cache des équilibres fragiles.",
      en: "Absolute monarchies, religious wars, and colonial empires: the splendor of baroque courts masks fragile balances of power.",
    },
    keyEvents: keyEventsFor("early-modern"),
  },
  {
    id: "revolutions",
    name: { fr: "Révolutions", en: "Age of Revolutions" },
    yearStart: 1789,
    yearEnd: 1848,
    colorPalette: ["#1a0a0a", "#3a1010", "#4a1a1a", "#5a2020"],
    backgroundAssetUrl: "/images/eras/era-revolutions.webp",
    description: {
      fr: "De la prise de la Bastille à Waterloo : les idéaux révolutionnaires bouleversent les monarchies européennes.",
      en: "From the storming of the Bastille to Waterloo: revolutionary ideals upend Europe's monarchies.",
    },
    keyEvents: keyEventsFor("revolutions"),
  },
  {
    id: "19th-century",
    name: { fr: "XIXe siècle", en: "19th Century" },
    yearStart: 1848,
    yearEnd: 1914,
    colorPalette: ["#0f0f1a", "#1a1a2a", "#2a2530", "#3a3540"],
    backgroundAssetUrl: "/images/eras/era-19th-century.webp",
    description: {
      fr: "Révolution industrielle, expansion coloniale et conquête de l'Ouest : le monde s'industrialise à marche forcée.",
      en: "Industrial revolution, colonial expansion, and the conquest of the American West: the world industrializes at breakneck speed.",
    },
    keyEvents: keyEventsFor("19th-century"),
  },
  {
    id: "world-wars",
    name: { fr: "Guerres mondiales", en: "World Wars" },
    yearStart: 1914,
    yearEnd: 1945,
    colorPalette: ["#0a0a0a", "#1a1a1a", "#2a2020", "#3a2a2a"],
    backgroundAssetUrl: "/images/eras/era-world-wars.webp",
    description: {
      fr: "Tranchées, totalitarismes et débarquements : trois décennies qui redessinent la carte du monde dans le sang.",
      en: "Trenches, totalitarian regimes, and landings: three decades that redraw the world map in blood.",
    },
    keyEvents: keyEventsFor("world-wars"),
  },
  {
    id: "cold-war",
    name: { fr: "Guerre froide", en: "Cold War" },
    yearStart: 1945,
    yearEnd: 1991,
    colorPalette: ["#0a0a1a", "#101a2a", "#1a2a3a", "#2a3a4a"],
    backgroundAssetUrl: "/images/eras/era-cold-war.webp",
    description: {
      fr: "Rideau de fer, espionnage et course à l'espace : le monde se divise en deux blocs sous la menace nucléaire.",
      en: "Iron curtain, espionage, and the space race: the world splits into two blocs under the shadow of nuclear threat.",
    },
    keyEvents: keyEventsFor("cold-war"),
  },
  {
    id: "contemporary",
    name: { fr: "Époque contemporaine", en: "Contemporary" },
    yearStart: 1991,
    yearEnd: 2026,
    colorPalette: ["#0a0f14", "#141e28", "#1e2832", "#283842"],
    backgroundAssetUrl: "/images/eras/era-contemporary.webp",
    description: {
      fr: "Depuis la chute de l'URSS : mondialisation, révolution numérique et nouveaux conflits géopolitiques.",
      en: "Since the fall of the USSR: globalization, the digital revolution, and new geopolitical conflicts.",
    },
    keyEvents: keyEventsFor("contemporary"),
  },
];
