import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  bpmMode: 'single' | 'range';
  singleBpm?: string;
  minBpm?: string;
  maxBpm?: string;
  genres: string[];
  source?: string; // Added for debugging
}

async function getAppSpotifyToken(): Promise<string | null> {
  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID') ?? ''
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET') ?? ''
  if (!clientId || !clientSecret) {
    console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
    return null
  }

  const body = new URLSearchParams()
  body.append('grant_type', 'client_credentials')

  const basic = btoa(`${clientId}:${clientSecret}`)
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body
  })

  if (!res.ok) {
    console.error('Failed to get Spotify app token', await res.text())
    return null
  }
  const json = await res.json()
  return json.access_token as string
}

function mapToSeedGenres(genres: string[]): string[] {
  if (!genres || genres.length === 0) return ['pop']
  const mapping: Record<string, string> = {
    'pop': 'pop',
    'electronics': 'electronic',
    'electronic': 'electronic',
    'hip hop': 'hip-hop',
    'hip-hop': 'hip-hop',
    'rock': 'rock',
    'alternative': 'alternative',
    'indie': 'indie',
    'dance': 'dance',
    'house': 'house',
  }
  const seeds = genres
    .map(g => mapping[g.trim().toLowerCase()] || g.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter(Boolean)
  // Spotify allows up to 5 seed values
  return (seeds.length > 0 ? seeds : ['pop']).slice(0, 5)
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

async function fetchAudioFeatures(token: string, trackIds: string[]): Promise<Record<string, number>> {
  if (trackIds.length === 0) return {}
  const ids = trackIds.join(',')
  const res = await fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) {
    console.error('Failed to fetch audio features', await res.text())
    return {}
  }
  const json = await res.json()
  const map: Record<string, number> = {}
  for (const af of json.audio_features || []) {
    if (af && af.id && typeof af.tempo === 'number') {
      map[af.id] = Math.round(af.tempo)
    }
  }
  return map
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get request data
    const { bpmMode, singleBpm, minBpm, maxBpm, genres, source }: SearchParams = await req.json();
    console.log('🔍 Search params:', { bpmMode, singleBpm, minBpm, maxBpm, genres, source });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    console.log('🔑 Auth header present:', !!authHeader);
    if (!authHeader) {
      console.log('❌ No auth header provided, proceeding without user-specific data');
    }

    let spotifyToken: string | null = null;
    
    // Try to get user's Spotify token if authenticated
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      
      if (user) {
        console.log('✅ User authenticated:', user.id, user.email);
        
        // Get user's Spotify access token
        const { data: tokenData, error: tokenError } = await supabaseClient
          .from('spotify_tokens')
          .select('access_token, expires_at')
          .eq('id', user.id)
          .single()
        
        console.log('🎵 Token lookup result:', { tokenData: !!tokenData, error: tokenError });
        
        if (tokenData && new Date(tokenData.expires_at) > new Date()) {
          spotifyToken = tokenData.access_token;
          console.log('✅ Using user Spotify token');
        } else {
          console.log('❌ No valid user token found');
        }
      } else {
        console.log('❌ User not authenticated');
      }
    }

    // If we have a user token, search user library/top tracks; else fall back to recommendations
    if (spotifyToken) {
      console.log('🎵 Using user Spotify token for search');
      const targetMin = bpmMode === 'single' && singleBpm
        ? parseInt(singleBpm) - 5
        : bpmMode === 'range' && minBpm && maxBpm
          ? parseInt(minBpm)
          : 120
      const targetMax = bpmMode === 'single' && singleBpm
        ? parseInt(singleBpm) + 5
        : bpmMode === 'range' && minBpm && maxBpm
          ? parseInt(maxBpm)
          : 140

      console.log('🎯 BPM target range:', { targetMin, targetMax });

      // Fetch user's top tracks (50)
      const topRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        headers: { 'Authorization': `Bearer ${spotifyToken}` }
      })
      let tracks: Array<any> = []
      if (topRes.ok) {
        const topJson = await topRes.json()
        tracks = (topJson.items || [])
        console.log('📊 Fetched', tracks.length, 'top tracks from user');
      } else {
        console.warn('❌ Top tracks request failed:', topRes.status, await topRes.text());
      }

      // Optionally: also fetch liked tracks or playlist tracks in future

      if (tracks.length > 0) {
        const ids = tracks.map(t => t.id).filter(Boolean)
        console.log('🎵 Fetching audio features for', ids.length, 'tracks');
        const tempos = await fetchAudioFeatures(spotifyToken, ids)
        console.log('🎵 Got tempo data for', Object.keys(tempos).length, 'tracks');
        
        const filtered = tracks.filter(t => {
          const tempo = tempos[t.id]
          const inRange = typeof tempo === 'number' && tempo >= targetMin && tempo <= targetMax
          if (inRange) {
            console.log('✅ Track matches BPM:', t.name, 'BPM:', tempo);
          }
          return inRange
        })
        
        console.log('🎯 Found', filtered.length, 'tracks matching BPM range');
        
        const songs = filtered.map(t => ({
          title: t.name as string,
          artist: (t.artists || []).map((a: any) => a.name).join(', '),
          bpm: Math.round(tempos[t.id]),
          duration: formatDuration(t.duration_ms),
          inLibrary: true,
        }))
        return new Response(JSON.stringify({ songs }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      // no tracks found in top-tracks path → fall back below
    }

    console.log('No user token or no matches in library; using public recommendations')
    const appToken = await getAppSpotifyToken()
    if (!appToken) throw new Error('No Spotify token available')

    // Determine BPM target/range
    let cacheBpmRange = ''
    let params = new URLSearchParams()
    params.set('limit', '30')

    if (bpmMode === 'single' && singleBpm) {
      params.set('target_tempo', singleBpm)
      cacheBpmRange = singleBpm
    } else if (bpmMode === 'range' && minBpm && maxBpm) {
      params.set('min_tempo', minBpm)
      params.set('max_tempo', maxBpm)
      const midpoint = Math.round((parseInt(minBpm) + parseInt(maxBpm)) / 2)
      params.set('target_tempo', String(midpoint))
      cacheBpmRange = `${minBpm}-${maxBpm}`
    } else {
      params.set('min_tempo', '120')
      params.set('max_tempo', '140')
      params.set('target_tempo', '130')
      cacheBpmRange = '120-140'
    }
    const seedGenres = mapToSeedGenres(genres)
    params.set('seed_genres', seedGenres.join(','))

    const cacheKey = `${cacheBpmRange}_${seedGenres.join(',')}_${bpmMode}`
    const { data: cached } = await supabaseClient
      .from('music_search_cache')
      .select('results')
      .eq('search_query', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single()
    if (cached) {
      return new Response(JSON.stringify(cached.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const recUrl = `https://api.spotify.com/v1/recommendations?${params.toString()}`
    const recRes = await fetch(recUrl, { headers: { 'Authorization': `Bearer ${appToken}` } })
    if (!recRes.ok) throw new Error('Failed to fetch recommendations from Spotify')
    const recJson = await recRes.json()
    const tracks = (recJson.tracks || []) as Array<any>
    const ids = tracks.map(t => t.id).filter(Boolean)
    const tempos = await fetchAudioFeatures(appToken, ids)
    const songs = tracks.map(t => ({
      title: t.name as string,
      artist: (t.artists || []).map((a: any) => a.name).join(', '),
      bpm: tempos[t.id] ?? Math.round(Number(params.get('target_tempo') || '0')),
      duration: formatDuration(t.duration_ms),
      inLibrary: false,
    }))
    const results = { songs }
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    await supabaseClient
      .from('music_search_cache')
      .insert({ search_query: cacheKey, bpm_range: cacheBpmRange, genres: seedGenres, results, expires_at: expiresAt })
    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error('Error in music-search function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})