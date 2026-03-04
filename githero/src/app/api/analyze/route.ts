import { NextRequest, NextResponse } from 'next/server';
import { analyzeGitHubUser } from '@/lib/github';
import { calculatePowerScore, getPowerLabel } from '@/lib/scoring';
import { getCharacter, metricsToPowerstats } from '@/lib/characters';
import { fetchSuperheroData, findBestHeroMatch, SuperheroData } from '@/lib/superheroApi';
import { generateAIAnalysis } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
  }

  const sanitized = username.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');

  if (!/^[a-zA-Z0-9-]+$/.test(sanitized)) {
    return NextResponse.json({ error: 'Invalid GitHub username.' }, { status: 400 });
  }

  try {
    // 1. Fetch GitHub profile data
    const analysis = await analyzeGitHubUser(sanitized);
    const breakdown = calculatePowerScore(analysis.metrics);
    const characterMetrics = {
      score: breakdown.total,
      repos: analysis.metrics.repos,
      stars: analysis.metrics.stars,
      followers: analysis.metrics.followers,
      commits: analysis.metrics.commits,
      languages: analysis.metrics.languages.length,
      streak: analysis.metrics.streak,
    };

    // 2. Calculate developer's powerstats profile
    const devStats = metricsToPowerstats(
      breakdown.total,
      analysis.metrics.repos,
      analysis.metrics.stars,
      analysis.metrics.followers,
      analysis.metrics.commits,
      analysis.metrics.languages.length,
      analysis.metrics.streak
    );

    // 3. Run Superhero API lookup + base character matching in parallel
    const [superheroMatch, baseCharacter] = await Promise.all([
      findBestHeroMatch(devStats),       // dynamic 730-hero pool match (Marvel/DC)
      Promise.resolve(getCharacter(characterMetrics)), // static + anime fallback
    ]);

    // 4. Decide final character: prefer superhero API match if available, else static
    let finalCharacter = baseCharacter;
    let heroData: SuperheroData | null = null;

    if (superheroMatch) {
      // If base character has a superheroApiName, enrich it with real API image
      if (baseCharacter.superheroApiName) {
        heroData = await fetchSuperheroData(baseCharacter.superheroApiName);
      }
      // If no enrichment happened, use the full API match
      if (!heroData) {
        heroData = superheroMatch;
      }
    } else if (baseCharacter.superheroApiName) {
      // Token set but findBestHeroMatch returned nothing — try direct lookup
      heroData = await fetchSuperheroData(baseCharacter.superheroApiName);
    }

    // 5. Generate AI analysis with Gemini (runs in parallel with step 4 enrichment)
    const aiAnalysis = await generateAIAnalysis(
      sanitized,
      analysis.metrics,
      finalCharacter.name,
      finalCharacter.archetype
    );

    const powerLabel = getPowerLabel(breakdown.total);

    return NextResponse.json({
      user: analysis.user,
      metrics: analysis.metrics,
      breakdown,
      character: finalCharacter,
      heroData: heroData
        ? {
            imageUrl: heroData.imageUrl,
            publisher: heroData.publisher,
            fullName: heroData.fullName,
            firstAppearance: heroData.firstAppearance,
            apiName: heroData.name,
          }
        : null,
      ai: aiAnalysis,
      powerLabel,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

