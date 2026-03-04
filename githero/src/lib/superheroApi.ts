import { Powerstats } from './characters';

const SUPERHERO_API_BASE = 'https://www.superheroapi.com/api.php';

export interface SuperheroData {
  id: string;
  name: string;
  imageUrl: string;
  publisher: string;
  powerstats: Powerstats;
  firstAppearance: string;
  fullName: string;
}

interface RawSuperheroResult {
  id: string;
  name: string;
  powerstats: Record<string, string>;
  biography: {
    'full-name': string;
    publisher: string;
    'first-appearance': string;
  };
  image: { url: string };
}

interface SearchResponse {
  response: string;
  results?: RawSuperheroResult[];
  error?: string;
}

/** In-memory cache to avoid duplicate API calls within a single server session */
const cache = new Map<string, SuperheroData | null>();

function parseStats(raw: Record<string, string>): Powerstats {
  const parse = (v: string) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? 50 : n;
  };
  return {
    intelligence: parse(raw.intelligence),
    strength: parse(raw.strength),
    speed: parse(raw.speed),
    durability: parse(raw.durability),
    power: parse(raw.power),
    combat: parse(raw.combat),
  };
}

export async function fetchSuperheroData(characterName: string): Promise<SuperheroData | null> {
  const token = process.env.SUPERHERO_API_TOKEN;
  if (!token) return null;

  const cacheKey = characterName.toLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  try {
    const url = `${SUPERHERO_API_BASE}/${token}/search/${encodeURIComponent(characterName)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
    if (!res.ok) {
      cache.set(cacheKey, null);
      return null;
    }

    const data: SearchResponse = await res.json();
    if (data.response !== 'success' || !data.results?.length) {
      cache.set(cacheKey, null);
      return null;
    }

    // Pick the best result: exact name match preferred, or first result
    const match =
      data.results.find((r) => r.name.toLowerCase() === characterName.toLowerCase()) ||
      data.results[0];

    const heroData: SuperheroData = {
      id: match.id,
      name: match.name,
      imageUrl: match.image.url,
      publisher: match.biography.publisher,
      powerstats: parseStats(match.powerstats),
      firstAppearance: match.biography['first-appearance'],
      fullName: match.biography['full-name'],
    };

    cache.set(cacheKey, heroData);
    return heroData;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}

/**
 * Given a set of developer powerstats, find the closest matching hero
 * from the Superhero API's 731-character database by querying multiple
 * famous hero names and picking the lowest Euclidean distance.
 */
export async function findBestHeroMatch(devStats: Powerstats): Promise<SuperheroData | null> {
  const token = process.env.SUPERHERO_API_TOKEN;
  if (!token) return null;

  // Representative pool of well-known heroes with distinct stat profiles
  const candidateNames = [
    'Iron Man', 'Batman', 'Captain America', 'Spider-Man', 'Thor',
    'Hulk', 'Doctor Strange', 'Deadpool', 'Superman', 'Wonder Woman',
    'The Flash', 'Black Panther', 'Thanos', 'Wolverine', 'Loki',
    'Magneto', 'Black Widow', 'Hawkeye', 'Green Arrow', 'Daredevil',
  ];

  // Fetch all candidates in parallel
  const heroes = await Promise.all(candidateNames.map((n) => fetchSuperheroData(n)));
  const validHeroes = heroes.filter((h): h is SuperheroData => h !== null);

  if (!validHeroes.length) return null;

  // Find hero whose powerstats profile is closest to developer's profile
  return validHeroes.reduce((best, curr) => {
    const bestDist = euclidean(devStats, best.powerstats);
    const currDist = euclidean(devStats, curr.powerstats);
    return currDist < bestDist ? curr : best;
  });
}

function euclidean(a: Powerstats, b: Powerstats): number {
  return Math.sqrt(
    Math.pow(a.intelligence - b.intelligence, 2) +
    Math.pow(a.strength - b.strength, 2) +
    Math.pow(a.speed - b.speed, 2) +
    Math.pow(a.durability - b.durability, 2) +
    Math.pow(a.power - b.power, 2) +
    Math.pow(a.combat - b.combat, 2)
  );
}
