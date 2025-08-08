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
    const { bpmMode, singleBpm, minBpm, maxBpm, genres }: SearchParams = await req.json();
    console.log('Search params:', { bpmMode, singleBpm, minBpm, maxBpm, genres });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('No auth header provided, proceeding without user-specific data');
    }

    let spotifyToken = null;
    
    // Try to get user's Spotify token if authenticated
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      
      if (user) {
        console.log('User authenticated:', user.id);
        
        // Get user's Spotify access token
        const { data: tokenData } = await supabaseClient
          .from('spotify_tokens')
          .select('access_token, expires_at')
          .eq('id', user.id)
          .single()
        
        if (tokenData && new Date(tokenData.expires_at) > new Date()) {
          spotifyToken = tokenData.access_token;
          console.log('Using user Spotify token');
        }
      }
    }

    // If no user token, we'll use Spotify's client credentials for public search
    if (!spotifyToken) {
      console.log('No user token available, using public search');
    }

    // Determine BPM range for search
    let targetBpm = '';
    if (bpmMode === 'single' && singleBpm) {
      targetBpm = singleBpm;
    } else if (bpmMode === 'range' && minBpm && maxBpm) {
      targetBpm = `${minBpm}-${maxBpm}`;
    } else {
      targetBpm = '120-140'; // Default range
    }

    // Create search query cache key
    const cacheKey = `${targetBpm}_${genres.join(',')}_${bpmMode}`;
    
    // Check cache first
    const { data: cachedResult } = await supabaseClient
      .from('music_search_cache')
      .select('results')
      .eq('search_query', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (cachedResult) {
      console.log('Returning cached results');
      return new Response(JSON.stringify(cachedResult.results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For now, return enhanced mock data based on user's criteria
    // In a real implementation, you would use Spotify Web API here
    const mockResults = generateMockResults(targetBpm, genres, bpmMode, singleBpm, minBpm, maxBpm);

    // Cache the results
    await supabaseClient
      .from('music_search_cache')
      .insert({
        search_query: cacheKey,
        bpm_range: targetBpm,
        genres: genres,
        results: mockResults
      })

    console.log('Search completed, returning results');
    return new Response(JSON.stringify(mockResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in music-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})

function generateMockResults(targetBpm: string, genres: string[], bpmMode: string, singleBpm?: string, minBpm?: string, maxBpm?: string) {
  // Enhanced mock data that responds to user's actual search criteria
  const allSongs = [
    { title: "Blinding Lights", artist: "The Weeknd", bpm: 171, duration: "3:20", genre: "pop", inLibrary: false },
    { title: "Don't Start Now", artist: "Dua Lipa", bpm: 124, duration: "3:03", genre: "pop", inLibrary: true },
    { title: "Watermelon Sugar", artist: "Harry Styles", bpm: 95, duration: "2:54", genre: "pop", inLibrary: false },
    { title: "Levitating", artist: "Dua Lipa", bpm: 103, duration: "3:23", genre: "pop", inLibrary: true },
    { title: "Good 4 U", artist: "Olivia Rodrigo", bpm: 166, duration: "2:58", genre: "rock", inLibrary: false },
    { title: "Industry Baby", artist: "Lil Nas X ft. Jack Harlow", bpm: 150, duration: "3:32", genre: "hip hop", inLibrary: false },
    { title: "Stay", artist: "The Kid LAROI & Justin Bieber", bpm: 169, duration: "2:21", genre: "pop", inLibrary: true },
    { title: "Heat Waves", artist: "Glass Animals", bpm: 80, duration: "3:58", genre: "electronic", inLibrary: false },
    { title: "Bad Habits", artist: "Ed Sheeran", bpm: 126, duration: "3:51", genre: "pop", inLibrary: true },
    { title: "Montero", artist: "Lil Nas X", bpm: 178, duration: "2:17", genre: "hip hop", inLibrary: false },
    { title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", bpm: 90, duration: "3:18", genre: "r&b", inLibrary: false },
    { title: "Deja Vu", artist: "Olivia Rodrigo", bpm: 120, duration: "3:35", genre: "pop", inLibrary: true },
    { title: "Drivers License", artist: "Olivia Rodrigo", bpm: 144, duration: "4:02", genre: "pop", inLibrary: false },
    { title: "Positions", artist: "Ariana Grande", bpm: 130, duration: "2:52", genre: "r&b", inLibrary: true },
    { title: "Mood", artist: "24kGoldn ft. iann dior", bpm: 91, duration: "2:20", genre: "hip hop", inLibrary: false },
  ];

  // Filter by BPM
  let targetMin = 60;
  let targetMax = 200;
  
  if (bpmMode === 'single' && singleBpm) {
    const bpm = parseInt(singleBpm);
    targetMin = bpm - 5; // Allow 5 BPM tolerance
    targetMax = bpm + 5;
  } else if (bpmMode === 'range' && minBpm && maxBpm) {
    targetMin = parseInt(minBpm);
    targetMax = parseInt(maxBpm);
  }

  let filteredSongs = allSongs.filter(song => 
    song.bpm >= targetMin && song.bpm <= targetMax
  );

  // Filter by genres if any are selected
  if (genres.length > 0 && !genres.includes('all')) {
    filteredSongs = filteredSongs.filter(song => 
      genres.some(genre => song.genre.toLowerCase().includes(genre.toLowerCase()))
    );
  }

  // If no songs match criteria, return a few close matches
  if (filteredSongs.length === 0) {
    filteredSongs = allSongs.slice(0, 3);
  }

  // Limit to 10 results and add some randomization
  const shuffled = filteredSongs.sort(() => 0.5 - Math.random());
  return { songs: shuffled.slice(0, 10) };
}