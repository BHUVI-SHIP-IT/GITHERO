import { GitHubMetrics } from './scoring';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: Array<{ sha: string }>;
    size?: number;
  };
}

export interface AnalysisResult {
  user: {
    login: string;
    name: string;
    avatar: string;
    bio: string;
    profileUrl: string;
    joinYear: number;
  };
  metrics: GitHubMetrics;
}

const GITHUB_API = 'https://api.github.com';

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function analyzeGitHubUser(username: string): Promise<AnalysisResult> {
  const headers = getHeaders();

  // Fetch user profile
  const userRes = await fetch(`${GITHUB_API}/users/${username}`, { headers });
  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error(`GitHub user "${username}" not found.`);
    if (userRes.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    throw new Error(`GitHub API error: ${userRes.status}`);
  }
  const user: GitHubUser = await userRes.json();

  // Fetch repos (up to 100, sorted by stars) + events + commit search in parallel
  const [reposRes, eventsRes, commitsSearchRes] = await Promise.all([
    fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&type=owner`, { headers }),
    fetch(`${GITHUB_API}/users/${username}/events?per_page=100`, { headers }),
    fetch(`${GITHUB_API}/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`, {
      headers: { ...headers, Accept: 'application/vnd.github.cloak-preview+json' },
    }),
  ]);
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];
  const events: GitHubEvent[] = eventsRes.ok ? await eventsRes.json() : [];
  // GitHub Search API gives us the real all-time commit count
  const commitsSearchData = commitsSearchRes.ok ? await commitsSearchRes.json() : null;
  const searchCommitCount: number = commitsSearchData?.total_count ?? 0;

  // Calculate total stars (excluding forks)
  const ownRepos = repos.filter((r) => !r.fork);
  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

  // Get unique languages
  const languageMap = new Map<string, number>();
  ownRepos.forEach((r) => {
    if (r.language) {
      languageMap.set(r.language, (languageMap.get(r.language) || 0) + 1);
    }
  });

  const languages = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  const topLanguage = languages[0] || 'Unknown';

  // Count commits from push events (last 90 days of public events)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  let eventCommitCount = 0;
  const pushDays = new Set<string>();

  events.forEach((event) => {
    const eventDate = new Date(event.created_at);
    if (event.type === 'PushEvent' && eventDate >= oneYearAgo) {
      const commits = event.payload.commits?.length || event.payload.size || 0;
      eventCommitCount += commits;
      pushDays.add(eventDate.toISOString().split('T')[0]);
    }
  });

  // Prefer the Search API's total_count (all-time, accurate) over the limited event count
  const commitCount = searchCommitCount > 0 ? searchCommitCount : eventCommitCount;
  // Estimate streak from push days (consecutive days)
  const streak = calculateStreak(pushDays);

  return {
    user: {
      login: user.login,
      name: user.name || user.login,
      avatar: user.avatar_url,
      bio: user.bio || '',
      profileUrl: user.html_url,
      joinYear: new Date(user.created_at).getFullYear(),
    },
    metrics: {
      repos: user.public_repos,
      stars: totalStars,
      followers: user.followers,
      following: user.following,
      commits: commitCount,
      languages,
      streak,
      forks: totalForks,
      topLanguage,
    },
  };
}

function calculateStreak(pushDays: Set<string>): number {
  if (pushDays.size === 0) return 0;

  const sortedDays = Array.from(pushDays).sort().reverse();
  let streak = 1;
  let currentDate = new Date(sortedDays[0]);

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}
