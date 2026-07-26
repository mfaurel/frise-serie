import type { HistoricalEvent } from "@/types";

export interface TimelineEvent extends HistoricalEvent {
  eraId: string;
}

export const events: TimelineEvent[] = [
  // Antiquité / Antiquity
  {
    eraId: "antiquity",
    year: -2560,
    name: { fr: "Achèvement de la grande pyramide de Gizeh", en: "Great Pyramid of Giza completed" },
  },
  {
    eraId: "antiquity",
    year: -776,
    name: { fr: "Premiers Jeux olympiques", en: "First Olympic Games" },
  },
  {
    eraId: "antiquity",
    year: -509,
    name: { fr: "Fondation de la République romaine", en: "Founding of the Roman Republic" },
  },
  {
    eraId: "antiquity",
    year: -44,
    name: { fr: "Assassinat de Jules César", en: "Assassination of Julius Caesar" },
  },
  {
    eraId: "antiquity",
    year: 476,
    name: { fr: "Chute de l'Empire romain d'Occident", en: "Fall of the Western Roman Empire" },
  },

  // Moyen Âge / Middle Ages
  {
    eraId: "middle-ages",
    year: 800,
    name: { fr: "Couronnement de Charlemagne", en: "Charlemagne crowned Emperor" },
  },
  {
    eraId: "middle-ages",
    year: 1066,
    name: { fr: "Conquête normande de l'Angleterre", en: "Norman Conquest of England" },
  },
  {
    eraId: "middle-ages",
    year: 1206,
    name: { fr: "Gengis Khan fonde l'Empire mongol", en: "Genghis Khan founds the Mongol Empire" },
  },
  {
    eraId: "middle-ages",
    year: 1215,
    name: { fr: "Signature de la Magna Carta", en: "Magna Carta signed" },
  },
  {
    eraId: "middle-ages",
    year: 1347,
    name: { fr: "La peste noire atteint l'Europe", en: "Black Death reaches Europe" },
  },

  // Renaissance
  {
    eraId: "renaissance",
    year: 1453,
    name: { fr: "Chute de Constantinople", en: "Fall of Constantinople" },
  },
  {
    eraId: "renaissance",
    year: 1492,
    name: { fr: "Christophe Colomb atteint les Amériques", en: "Columbus reaches the Americas" },
  },
  {
    eraId: "renaissance",
    year: 1517,
    name: { fr: "Les 95 thèses de Luther", en: "Luther's Ninety-Five Theses" },
  },

  // Époque Moderne / Early Modern (Baroque)
  {
    eraId: "early-modern",
    year: 1618,
    name: { fr: "Début de la guerre de Trente Ans", en: "Start of the Thirty Years' War" },
  },
  {
    eraId: "early-modern",
    year: 1682,
    name: { fr: "Louis XIV installe la cour à Versailles", en: "Louis XIV moves the court to Versailles" },
  },
  {
    eraId: "early-modern",
    year: 1776,
    name: { fr: "Déclaration d'indépendance américaine", en: "American Declaration of Independence" },
  },

  // Révolutions / Age of Revolutions
  {
    eraId: "revolutions",
    year: 1789,
    name: { fr: "Prise de la Bastille", en: "Storming of the Bastille" },
  },
  {
    eraId: "revolutions",
    year: 1804,
    name: { fr: "Napoléon couronné empereur", en: "Napoleon crowned Emperor" },
  },
  {
    eraId: "revolutions",
    year: 1815,
    name: { fr: "Bataille de Waterloo", en: "Battle of Waterloo" },
  },

  // XIXe siècle / 19th Century
  {
    eraId: "19th-century",
    year: 1848,
    name: { fr: "Le Printemps des peuples", en: "Revolutions of 1848 sweep Europe" },
  },
  {
    eraId: "19th-century",
    year: 1861,
    name: { fr: "Début de la guerre de Sécession", en: "American Civil War begins" },
  },
  {
    eraId: "19th-century",
    year: 1885,
    name: { fr: "Ouverture de la conférence de Berlin", en: "Berlin Conference opens" },
  },

  // Guerres mondiales / World Wars
  {
    eraId: "world-wars",
    year: 1914,
    name: { fr: "Assassinat de l'archiduc François-Ferdinand", en: "Assassination of Archduke Franz Ferdinand" },
  },
  {
    eraId: "world-wars",
    year: 1917,
    name: { fr: "Révolution russe", en: "Russian Revolution" },
  },
  {
    eraId: "world-wars",
    year: 1939,
    name: { fr: "L'Allemagne envahit la Pologne", en: "Germany invades Poland" },
  },
  {
    eraId: "world-wars",
    year: 1944,
    name: { fr: "Débarquement de Normandie", en: "D-Day landings" },
  },
  {
    eraId: "world-wars",
    year: 1945,
    name: { fr: "Fin de la Seconde Guerre mondiale", en: "End of the Second World War" },
  },

  // Guerre froide / Cold War
  {
    eraId: "cold-war",
    year: 1949,
    name: { fr: "Fondation de l'OTAN", en: "NATO founded" },
  },
  {
    eraId: "cold-war",
    year: 1961,
    name: { fr: "Érection du mur de Berlin", en: "Berlin Wall erected" },
  },
  {
    eraId: "cold-war",
    year: 1969,
    name: { fr: "Alunissage d'Apollo 11", en: "Apollo 11 Moon landing" },
  },
  {
    eraId: "cold-war",
    year: 1989,
    name: { fr: "Chute du mur de Berlin", en: "Fall of the Berlin Wall" },
  },

  // Époque contemporaine / Contemporary
  {
    eraId: "contemporary",
    year: 1991,
    name: { fr: "Dissolution de l'Union soviétique", en: "Dissolution of the Soviet Union" },
  },
  {
    eraId: "contemporary",
    year: 2001,
    name: { fr: "Attentats du 11 septembre", en: "September 11 attacks" },
  },
  {
    eraId: "contemporary",
    year: 2008,
    name: { fr: "Crise financière mondiale", en: "Global financial crisis" },
  },
];
