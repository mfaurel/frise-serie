import type { Platform, Genre, Region } from '@/types';

export const PLATFORM_COLORS: Record<Platform, string> = {
  netflix: '#E50914',
  prime_video: '#00A8E0',
  disney_plus: '#113CCF',
  apple_tv: '#555',
  max: '#002BE7',
  canal_plus: '#000',
  arte: '#d63429',
  other: '#4b5563',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  netflix: 'Netflix',
  prime_video: 'Prime',
  disney_plus: 'Disney+',
  apple_tv: 'Apple TV+',
  max: 'Max',
  canal_plus: 'Canal+',
  arte: 'Arte',
  other: 'Autre',
};

export const GENRE_LABELS: Record<Genre, { fr: string; en: string }> = {
  peplum: { fr: 'Péplum', en: 'Peplum' },
  medieval: { fr: 'Médiéval', en: 'Medieval' },
  renaissance: { fr: 'Renaissance', en: 'Renaissance' },
  revolution: { fr: 'Révolution', en: 'Revolution' },
  war: { fr: 'Guerre', en: 'War' },
  biopic: { fr: 'Biopic', en: 'Biopic' },
  western: { fr: 'Western', en: 'Western' },
  colonial: { fr: 'Colonial', en: 'Colonial' },
  ancient_east: { fr: 'Orient ancien', en: 'Ancient East' },
  cold_war: { fr: 'Guerre froide', en: 'Cold War' },
  '20th_century': { fr: 'XXe siècle', en: '20th Century' },
  contemporary: { fr: 'Contemporain', en: 'Contemporary' },
  viking: { fr: 'Viking', en: 'Viking' },
  pirate: { fr: 'Pirate', en: 'Pirate' },
  empire: { fr: 'Empire', en: 'Empire' },
};

export const REGION_LABELS: Record<Region, { fr: string; en: string }> = {
  europe_west: { fr: 'Europe Ouest', en: 'Western Europe' },
  europe_east: { fr: 'Europe Est', en: 'Eastern Europe' },
  mediterranean: { fr: 'Méditerranée', en: 'Mediterranean' },
  middle_east: { fr: 'Moyen-Orient', en: 'Middle East' },
  asia_east: { fr: 'Asie de l\'Est', en: 'East Asia' },
  asia_south: { fr: 'Asie du Sud', en: 'South Asia' },
  africa: { fr: 'Afrique', en: 'Africa' },
  americas_north: { fr: 'Amérique du Nord', en: 'North America' },
  americas_south: { fr: 'Amérique du Sud', en: 'South America' },
  oceania: { fr: 'Océanie', en: 'Oceania' },
  nordic: { fr: 'Scandinavie', en: 'Scandinavia' },
};
