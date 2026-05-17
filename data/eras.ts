import type { HistoricalEra } from '@/types';

export const ERAS: HistoricalEra[] = [
  {
    id: 'antiquity',
    name: { fr: 'Antiquité', en: 'Antiquity' },
    yearStart: -3000,
    yearEnd: 476,
    pixelsPerYear: 1.0,
    gradient: ['#c9a84c', '#e8d5a3'],
    textColor: '#3d2b00',
    description: {
      fr: 'Grèce, Rome, Égypte — les fondements de la civilisation occidentale.',
      en: 'Greece, Rome, Egypt — the foundations of Western civilisation.',
    },
    keyEvents: [
      { year: -44, name: { fr: 'Assassinat de César', en: 'Assassination of Caesar' }, emoji: '🗡️' },
      { year: -31, name: { fr: 'Bataille d\'Actium', en: 'Battle of Actium' }, emoji: '⚔️' },
      { year: 79, name: { fr: 'Éruption du Vésuve', en: 'Eruption of Vesuvius' }, emoji: '🌋' },
      { year: 476, name: { fr: 'Chute de Rome', en: 'Fall of Rome' }, emoji: '🏛️' },
    ],
  },
  {
    id: 'early_middle_ages',
    name: { fr: 'Haut Moyen Âge', en: 'Early Middle Ages' },
    yearStart: 476,
    yearEnd: 1000,
    pixelsPerYear: 2.5,
    gradient: ['#4a3728', '#7a5c45'],
    textColor: '#f5e6d0',
    description: {
      fr: 'Invasions barbares, royaumes francs, vikings — l\'Europe se réinvente.',
      en: 'Barbarian invasions, Frankish kingdoms, Vikings — Europe reinvents itself.',
    },
    keyEvents: [
      { year: 793, name: { fr: 'Raid de Lindisfarne', en: 'Lindisfarne Raid' }, emoji: '🪓' },
      { year: 800, name: { fr: 'Couronnement de Charlemagne', en: 'Charlemagne crowned' }, emoji: '👑' },
    ],
  },
  {
    id: 'middle_ages',
    name: { fr: 'Moyen Âge', en: 'Middle Ages' },
    yearStart: 1000,
    yearEnd: 1400,
    pixelsPerYear: 3.0,
    gradient: ['#2c3e50', '#4a6741'],
    textColor: '#e8dcc8',
    description: {
      fr: 'Croisades, chevalerie, cathédrales — l\'Europe féodale à son apogée.',
      en: 'Crusades, chivalry, cathedrals — feudal Europe at its height.',
    },
    keyEvents: [
      { year: 1066, name: { fr: 'Conquête normande', en: 'Norman Conquest' }, emoji: '🏰' },
      { year: 1215, name: { fr: 'Magna Carta', en: 'Magna Carta' }, emoji: '📜' },
      { year: 1347, name: { fr: 'Peste Noire', en: 'Black Death' }, emoji: '💀' },
    ],
  },
  {
    id: 'renaissance',
    name: { fr: 'Renaissance', en: 'Renaissance' },
    yearStart: 1400,
    yearEnd: 1600,
    pixelsPerYear: 5.0,
    gradient: ['#8b4513', '#d4a843'],
    textColor: '#faf0e0',
    description: {
      fr: 'Art, science, exploration — l\'humanisme transforme l\'Europe.',
      en: 'Art, science, exploration — humanism transforms Europe.',
    },
    keyEvents: [
      { year: 1453, name: { fr: 'Chute de Constantinople', en: 'Fall of Constantinople' }, emoji: '🕌' },
      { year: 1492, name: { fr: 'Découverte des Amériques', en: 'Discovery of Americas' }, emoji: '⛵' },
      { year: 1517, name: { fr: 'Réforme protestante', en: 'Protestant Reformation' }, emoji: '✝️' },
    ],
  },
  {
    id: 'early_modern',
    name: { fr: 'Époque moderne', en: 'Early Modern' },
    yearStart: 1600,
    yearEnd: 1789,
    pixelsPerYear: 4.0,
    gradient: ['#1a3a5c', '#4a7c9e'],
    textColor: '#f0e8d8',
    description: {
      fr: 'Absolutisme, Lumières, guerres coloniales — le monde se globalise.',
      en: 'Absolutism, Enlightenment, colonial wars — the world globalises.',
    },
    keyEvents: [
      { year: 1618, name: { fr: 'Guerre de Trente Ans', en: 'Thirty Years War' }, emoji: '💣' },
      { year: 1687, name: { fr: 'Principia de Newton', en: 'Newton\'s Principia' }, emoji: '🍎' },
      { year: 1776, name: { fr: 'Indépendance américaine', en: 'American Independence' }, emoji: '🗽' },
    ],
  },
  {
    id: 'revolution_empire',
    name: { fr: 'Révolution & Empire', en: 'Revolution & Empire' },
    yearStart: 1789,
    yearEnd: 1815,
    pixelsPerYear: 8.0,
    gradient: ['#8b0000', '#c0392b'],
    textColor: '#fdf5e6',
    description: {
      fr: 'Révolution française, Terreur, Napoléon — l\'ordre européen bouleversé.',
      en: 'French Revolution, Terror, Napoleon — the European order overturned.',
    },
    keyEvents: [
      { year: 1789, name: { fr: 'Révolution française', en: 'French Revolution' }, emoji: '🔴' },
      { year: 1804, name: { fr: 'Napoléon Empereur', en: 'Napoleon Emperor' }, emoji: '👑' },
      { year: 1815, name: { fr: 'Waterloo', en: 'Waterloo' }, emoji: '⚔️' },
    ],
  },
  {
    id: '19th_century',
    name: { fr: 'XIXe siècle', en: '19th Century' },
    yearStart: 1815,
    yearEnd: 1900,
    pixelsPerYear: 5.0,
    gradient: ['#2d4a2d', '#6b8f6b'],
    textColor: '#f5f0e8',
    description: {
      fr: 'Industrialisation, colonisation, guerres civiles — le monde moderne émerge.',
      en: 'Industrialisation, colonisation, civil wars — the modern world emerges.',
    },
    keyEvents: [
      { year: 1848, name: { fr: 'Printemps des peuples', en: 'Spring of Nations' }, emoji: '🌱' },
      { year: 1861, name: { fr: 'Guerre de Sécession', en: 'American Civil War' }, emoji: '🔫' },
      { year: 1871, name: { fr: 'Commune de Paris', en: 'Paris Commune' }, emoji: '🏴' },
    ],
  },
  {
    id: '20th_century_early',
    name: { fr: 'XXe siècle (1900–1945)', en: '20th Century (1900–1945)' },
    yearStart: 1900,
    yearEnd: 1945,
    pixelsPerYear: 8.0,
    gradient: ['#3a3a3a', '#6e6e6e'],
    textColor: '#f0f0f0',
    description: {
      fr: 'Deux guerres mondiales, révolutions, jazz — un siècle de violence et d\'innovation.',
      en: 'Two world wars, revolutions, jazz — a century of violence and innovation.',
    },
    keyEvents: [
      { year: 1914, name: { fr: 'Première Guerre mondiale', en: 'WWI begins' }, emoji: '💥' },
      { year: 1917, name: { fr: 'Révolution russe', en: 'Russian Revolution' }, emoji: '☭' },
      { year: 1939, name: { fr: 'Deuxième Guerre mondiale', en: 'WWII begins' }, emoji: '💣' },
    ],
  },
  {
    id: '20th_century_late',
    name: { fr: 'Guerre Froide', en: 'Cold War' },
    yearStart: 1945,
    yearEnd: 2025,
    pixelsPerYear: 5.0,
    gradient: ['#1a1a2e', '#16213e'],
    textColor: '#e0e0f0',
    description: {
      fr: 'Deux blocs, décolonisation, course à l\'espace — l\'équilibre de la terreur.',
      en: 'Two blocs, decolonisation, space race — the balance of terror.',
    },
    keyEvents: [
      { year: 1947, name: { fr: 'Début de la Guerre froide', en: 'Cold War begins' }, emoji: '☢️' },
      { year: 1969, name: { fr: 'Alunissage', en: 'Moon landing' }, emoji: '🌕' },
      { year: 1989, name: { fr: 'Chute du Mur de Berlin', en: 'Berlin Wall falls' }, emoji: '🧱' },
    ],
  },
];

export function getEraForYear(year: number): HistoricalEra | undefined {
  return ERAS.find((e) => year >= e.yearStart && year <= e.yearEnd);
}

