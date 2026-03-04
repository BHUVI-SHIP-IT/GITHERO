import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubMetrics } from './scoring';

export interface AIAnalysis {
  personalizedQuote: string;
  matchReason: string;
  roast: string;
  suggestedCharacter?: string; // AI can override the character if it finds a better match
}

const SYSTEM_PROMPT = `You are a hilarious yet insightful developer personality analyst for "GitHub Hero" — a web app that matches developers to legendary characters (Marvel, DC, Anime) based on their GitHub activity.

Your job: analyze real GitHub stats and a pre-selected character match, then generate fun, personalized content.

RULES:
- Keep quotes punchy (1-2 sentences max)
- Keep matchReason insightful but funny (2-3 sentences)
- Keep roast savage but friendly — no insults, just developer humor
- Do NOT use cringe corporate language
- Reference actual stats when possible
- Sound like a playful friend, not a marketing bot
- Return ONLY valid JSON — no markdown, no code blocks, no extra text`;

export async function generateAIAnalysis(
  username: string,
  metrics: GitHubMetrics,
  characterName: string,
  archetype: string
): Promise<AIAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.9,
        maxOutputTokens: 600,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const topLangs = Array.isArray(metrics.languages)
      ? metrics.languages.slice(0, 3).join(', ')
      : 'unknown';

    const prompt = `
GitHub user: @${username}
Character Match: ${characterName} (${archetype})
Stats:
  - Public repos: ${metrics.repos}
  - Total stars: ${metrics.stars}
  - Followers: ${metrics.followers}
  - Recent commits (last year): ${metrics.commits}
  - Contribution streak: ${metrics.streak} days
  - Top languages: ${topLangs}
  - Total languages used: ${Array.isArray(metrics.languages) ? metrics.languages.length : 0}

Generate a JSON object with exactly these fields:
{
  "personalizedQuote": "A short, funny, personalized quote (in-character voice of ${characterName}) referencing their actual stats",
  "matchReason": "2-3 funny but insightful sentences explaining WHY their GitHub stats match ${characterName}'s personality",
  "roast": "A friendly developer roast based on their stats (e.g., 'your ${metrics.stars} stars suggest...' or 'that ${metrics.streak}-day streak implies...')"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code blocks if model ignores responseMimeType
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed: AIAnalysis = JSON.parse(clean);

    // Validate required fields
    if (!parsed.personalizedQuote || !parsed.matchReason || !parsed.roast) {
      return null;
    }

    return parsed;
  } catch (err) {
    console.error('Gemini AI error:', err);
    return null;
  }
}
