export type Universe = 'Marvel' | 'DC' | 'Anime';

/** Mirrors the Superhero API powerstats schema (0–100 each) */
export interface Powerstats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface Character {
  id: string;
  name: string;
  /** Exact name used to query the Superhero API (Marvel/DC only) */
  superheroApiName?: string;
  universe: Universe;
  archetype: string;
  emoji: string;
  avatar: string;
  colors: {
    primary: string;
    secondary: string;
    glow: string;
    border: string;
  };
  /** Fallback static quote – replaced by AI-generated quote at runtime */
  quote: string;
  description: string;
  traits: string[];
  scoreMin: number;
  scoreMax: number;
  /** Powerstats used for matching developer profile (same scale as Superhero API) */
  powerstats: Powerstats;
  condition?: (metrics: CharacterMetrics) => boolean;
}

export interface CharacterMetrics {
  score: number;
  repos: number;
  stars: number;
  followers: number;
  commits: number;
  languages: number;
  streak: number;
}

export const CHARACTERS: Character[] = [
  {
    id: 'aizen',
    name: 'Aizen Sosuke',
    universe: 'Anime',
    archetype: 'Strategic Architect',
    emoji: '♟️',
    avatar: 'from-purple-900 via-purple-600 to-yellow-500',
    colors: {
      primary: '#c084fc',
      secondary: '#facc15',
      glow: 'rgba(192, 132, 252, 0.6)',
      border: 'border-purple-500',
    },
    quote:
      '"Your code architecture is so elegant, even the bugs bow before merging." — The codebase feared you before you even pushed.',
    description:
      'You architect systems that mortals cannot comprehend. Your commit history reads like forbidden scripture and your PRs are accepted without question.',
    traits: ['Systems Thinker', 'Architecture God', 'Long-game Player', 'Flawless Design'],
    scoreMin: 90,
    scoreMax: 100,
    powerstats: { intelligence: 100, strength: 60, speed: 70, durability: 85, power: 100, combat: 95 },
  },
  {
    id: 'goku',
    name: 'Son Goku',
    universe: 'Anime',
    archetype: 'Pure Power Coder',
    emoji: '⚡',
    avatar: 'from-orange-500 via-yellow-400 to-orange-600',
    colors: {
      primary: '#fb923c',
      secondary: '#facc15',
      glow: 'rgba(251, 146, 60, 0.6)',
      border: 'border-orange-500',
    },
    quote:
      '"I\'m not the strongest developer in the universe... yet. But my commits are OVER 9000 per week!" — You, probably.',
    description:
      'Raw unfiltered coding power. You push past every limit, break every repo record, and somehow your code always compiles on the first try.',
    traits: ['Limitless Power', 'Always Training', 'Legendary Output', 'Never Gives Up'],
    scoreMin: 85,
    scoreMax: 100,
    powerstats: { intelligence: 60, strength: 100, speed: 100, durability: 100, power: 100, combat: 95 },
    condition: (m) => m.commits > 300 && m.score >= 85,
  },
  {
    id: 'levi',
    name: 'Levi Ackerman',
    universe: 'Anime',
    archetype: 'Elite Clean Coder',
    emoji: '⚔️',
    avatar: 'from-slate-800 via-slate-600 to-teal-500',
    colors: {
      primary: '#2dd4bf',
      secondary: '#94a3b8',
      glow: 'rgba(45, 212, 191, 0.6)',
      border: 'border-teal-400',
    },
    quote:
      '"A single messy function is a disgrace. Clean code or die trying." — Clean, precise, merciless.',
    description:
      "Humanity's strongest coder. Your functions are short, your variables are named perfectly, and you've never left a TODO comment in production. Not once.",
    traits: ['Surgical Precision', 'Zero Tolerance for Mess', 'Elite Efficiency', 'Code Aesthetics'],
    scoreMin: 80,
    scoreMax: 94,
    powerstats: { intelligence: 90, strength: 90, speed: 95, durability: 80, power: 75, combat: 100 },
    condition: (m) => m.repos > 0 && m.stars / Math.max(m.repos, 1) > 5,
  },
  {
    id: 'ironman',
    name: 'Tony Stark',
    superheroApiName: 'Iron Man',
    universe: 'Marvel',
    archetype: 'Experimental Builder',
    emoji: '🤖',
    avatar: 'from-red-600 via-red-500 to-yellow-400',
    colors: {
      primary: '#ef4444',
      secondary: '#fbbf24',
      glow: 'rgba(239, 68, 68, 0.65)',
      border: 'border-red-500',
    },
    quote:
      '"I am GitHub, and I have a repo for that." — Your README files alone could fund a startup.',
    description:
      "Your repos look like Stark Industries — bold ideas, constant experiments, and a beautiful kind of organized chaos. You don't just build apps, you build the future.",
    traits: ['Relentless Builder', 'Polyglot Dev', 'Always Iterating', 'MVP Machine'],
    scoreMin: 72,
    scoreMax: 89,
    powerstats: { intelligence: 100, strength: 85, speed: 58, durability: 85, power: 100, combat: 64 },
    condition: (m) => m.repos >= 30 || m.languages >= 6,
  },
  {
    id: 'batman',
    name: 'Batman',
    superheroApiName: 'Batman',
    universe: 'DC',
    archetype: 'Solo High-Skill Developer',
    emoji: '🦇',
    avatar: 'from-gray-900 via-gray-700 to-yellow-500',
    colors: {
      primary: '#facc15',
      secondary: '#374151',
      glow: 'rgba(250, 204, 21, 0.5)',
      border: 'border-yellow-400',
    },
    quote:
      '"I work alone. No pair programming. No standups. Just me, the terminal, and the dark." — Your commit timestamps tell a story.',
    description:
      "You don't need a team. While everyone else is in sprint planning, you've already shipped the feature, found the bug, and fixed it. Always prepared, always alone, always brilliant.",
    traits: ['Self-Sufficient', 'Night-mode Coder', 'Prepared for Anything', 'No Framework Needed'],
    scoreMin: 68,
    scoreMax: 88,
    powerstats: { intelligence: 100, strength: 26, speed: 27, durability: 50, power: 47, combat: 100 },
    condition: (m) => m.followers < m.repos && m.stars > 20,
  },
  {
    id: 'captainamerica',
    name: 'Captain America',
    superheroApiName: 'Captain America',
    universe: 'Marvel',
    archetype: 'Consistent Contributor',
    emoji: '🛡️',
    avatar: 'from-blue-700 via-blue-500 to-red-500',
    colors: {
      primary: '#3b82f6',
      secondary: '#ef4444',
      glow: 'rgba(59, 130, 246, 0.6)',
      border: 'border-blue-500',
    },
    quote:
      '"I can do this all day." — And your contribution graph literally proves it. Every. Single. Day.',
    description:
      "The backbone of every team. You show up every day, write solid code, review PRs without complaint, and your commit streak is the stuff of legends.",
    traits: ['Daily Committer', 'Team Player', 'Reliable Reviewer', 'Streak Legend'],
    scoreMin: 55,
    scoreMax: 79,
    powerstats: { intelligence: 63, strength: 19, speed: 35, durability: 55, power: 60, combat: 100 },
    condition: (m) => m.streak >= 30 || m.commits >= 200,
  },
  {
    id: 'thanos',
    name: 'Thanos',
    superheroApiName: 'Thanos',
    universe: 'Marvel',
    archetype: 'Universe-Scale Builder',
    emoji: '💎',
    avatar: 'from-violet-700 via-purple-600 to-violet-900',
    colors: {
      primary: '#8b5cf6',
      secondary: '#c4b5fd',
      glow: 'rgba(139, 92, 246, 0.6)',
      border: 'border-violet-500',
    },
    quote:
      '"I used half the open-source libraries... because balance." — Your package.json is an infinity gauntlet.',
    description:
      'You think in galactic scale. Multiple languages, multiple frameworks, multiple repos. Some call it over-engineering. You call it perfectly balanced.',
    traits: ['Multi-Language', 'Framework Collector', 'Monorepo Master', 'Balanced Dependencies'],
    scoreMin: 60,
    scoreMax: 82,
    powerstats: { intelligence: 100, strength: 100, speed: 33, durability: 100, power: 100, combat: 95 },
    condition: (m) => m.languages >= 5,
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    superheroApiName: 'Spider-Man',
    universe: 'Marvel',
    archetype: 'Creative Problem Solver',
    emoji: '🕷️',
    avatar: 'from-red-600 via-blue-600 to-red-500',
    colors: {
      primary: '#dc2626',
      secondary: '#2563eb',
      glow: 'rgba(220, 38, 38, 0.5)',
      border: 'border-red-500',
    },
    quote:
      '"With great pull requests comes great responsibility." — You hack elegant solutions together faster than anyone expects.',
    description:
      "Quick, witty, and creative. You find solutions nobody else thought of and your code swings elegantly between logic and creativity.",
    traits: ['Creative Solutions', 'Fast Learner', 'Web Specialist', 'Friendly Coder'],
    scoreMin: 45,
    scoreMax: 65,
    powerstats: { intelligence: 90, strength: 55, speed: 67, durability: 75, power: 74, combat: 85 },
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    universe: 'Anime',
    archetype: 'Determined Fast Learner',
    emoji: '🍥',
    avatar: 'from-orange-500 via-yellow-400 to-orange-400',
    colors: {
      primary: '#f97316',
      secondary: '#facc15',
      glow: 'rgba(249, 115, 22, 0.6)',
      border: 'border-orange-400',
    },
    quote:
      '"I\'m gonna be Hokage of GitHub one day, believe it! I\'ve already made 47 repos this month." — The hustle is real.',
    description:
      "Everyone doubted you. But look at that commit history — you never stopped. You started with 'Hello World' and now you're building production systems. The journey is the legend.",
    traits: ['Never Gives Up', 'Rapid Grower', 'Self-Taught', 'Underdog Energy'],
    scoreMin: 25,
    scoreMax: 55,
    powerstats: { intelligence: 45, strength: 65, speed: 80, durability: 70, power: 90, combat: 80 },
  },
  {
    id: 'deadpool',
    name: 'Deadpool',
    superheroApiName: 'Deadpool',
    universe: 'Marvel',
    archetype: 'Chaotic Creative',
    emoji: '🗡️',
    avatar: 'from-red-700 via-gray-800 to-red-600',
    colors: {
      primary: '#dc2626',
      secondary: '#1f2937',
      glow: 'rgba(220, 38, 38, 0.5)',
      border: 'border-red-600',
    },
    quote:
      '"My code doesn\'t follow best practices. My code IS the best practice. Also I pushed directly to main. You\'re welcome." — Maximum effort.',
    description:
      "Unconventional, unpredictable, and somehow it all works. Your commit messages are entertainment, your code is chaos, and your solutions work in ways nobody can explain.",
    traits: ['Maximum Effort', 'Breaks the Rules', 'Somehow It Works', 'Legendary Commit Messages'],
    scoreMin: 0,
    scoreMax: 35,
    powerstats: { intelligence: 69, strength: 32, speed: 50, durability: 100, power: 100, combat: 90 },
  },
];

/**
 * Map developer metrics to the Superhero API powerstats scale (0-100).
 * This lets us do Euclidean-distance matching against any character's powerstats.
 */
export function metricsToPowerstats(
  score: number,
  repos: number,
  stars: number,
  followers: number,
  commits: number,
  languages: number,
  streak: number
): Powerstats {
  return {
    intelligence: Math.min(100, Math.round((languages * 10 + Math.min(commits / 5, 50)))),
    strength: Math.min(100, Math.round((stars * 2 + repos))),
    speed: Math.min(100, Math.round((streak * 3 + commits / 10))),
    durability: Math.min(100, Math.round(score)),
    power: Math.min(100, Math.round((score * 0.6 + stars * 0.4))),
    combat: Math.min(100, Math.round((followers * 2 + commits / 20))),
  };
}

function powerstatDistance(a: Powerstats, b: Powerstats): number {
  return Math.sqrt(
    Math.pow(a.intelligence - b.intelligence, 2) +
    Math.pow(a.strength - b.strength, 2) +
    Math.pow(a.speed - b.speed, 2) +
    Math.pow(a.durability - b.durability, 2) +
    Math.pow(a.power - b.power, 2) +
    Math.pow(a.combat - b.combat, 2)
  );
}

export function getCharacter(metrics: CharacterMetrics): Character {
  const { score } = metrics;

  // Check condition-based matches first
  const conditionMatches = CHARACTERS.filter(
    (c) =>
      c.condition &&
      c.condition(metrics) &&
      score >= c.scoreMin &&
      score <= c.scoreMax + 15
  );

  if (conditionMatches.length > 0) {
    return conditionMatches.sort((a, b) => b.scoreMin - a.scoreMin)[0];
  }

  // Powerstats-based matching (most nuanced)
  const devStats = metricsToPowerstats(
    score,
    metrics.repos,
    metrics.stars,
    metrics.followers,
    metrics.commits,
    metrics.languages,
    metrics.streak
  );

  return CHARACTERS.reduce((best, curr) => {
    const bestDist = powerstatDistance(devStats, best.powerstats);
    const currDist = powerstatDistance(devStats, curr.powerstats);
    return currDist < bestDist ? curr : best;
  });
}
