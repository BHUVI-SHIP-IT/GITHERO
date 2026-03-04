export interface GitHubMetrics {
  repos: number;
  stars: number;
  followers: number;
  following: number;
  commits: number;
  languages: string[];
  streak: number;
  forks: number;
  topLanguage: string;
}

export interface ScoringBreakdown {
  repoScore: number;
  starScore: number;
  followerScore: number;
  commitScore: number;
  languageScore: number;
  streakScore: number;
  total: number;
}

export function calculatePowerScore(metrics: GitHubMetrics): ScoringBreakdown {
  // Each component capped to contribute proportionally to 100
  const repoScore = Math.min(Math.round(metrics.repos * 1.5), 20);
  const starScore = Math.min(Math.round(metrics.stars * 0.8), 25);
  const followerScore = Math.min(Math.round(metrics.followers * 0.3), 15);
  const commitScore = Math.min(Math.round(metrics.commits / 15), 20);
  const languageScore = Math.min(Math.round(metrics.languages.length * 2.5), 10);
  const streakScore = Math.min(Math.round(metrics.streak / 3), 10);

  const total = Math.min(
    repoScore + starScore + followerScore + commitScore + languageScore + streakScore,
    100
  );

  return {
    repoScore,
    starScore,
    followerScore,
    commitScore,
    languageScore,
    streakScore,
    total,
  };
}

export function getPowerLabel(score: number): string {
  if (score >= 90) return 'LEGENDARY';
  if (score >= 75) return 'ELITE';
  if (score >= 60) return 'ADVANCED';
  if (score >= 45) return 'RISING';
  if (score >= 25) return 'APPRENTICE';
  return 'ORIGIN STORY';
}

export function getPowerColor(score: number): string {
  if (score >= 90) return '#c084fc'; // purple
  if (score >= 75) return '#f97316'; // orange
  if (score >= 60) return '#facc15'; // yellow
  if (score >= 45) return '#22d3ee'; // cyan
  if (score >= 25) return '#4ade80'; // green
  return '#94a3b8'; // gray
}
