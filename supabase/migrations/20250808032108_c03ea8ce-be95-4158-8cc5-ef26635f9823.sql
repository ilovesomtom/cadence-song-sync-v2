-- Create a table to cache search results for better performance
CREATE TABLE IF NOT EXISTS public.music_search_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query TEXT NOT NULL,
  bpm_range TEXT NOT NULL,
  genres TEXT[] NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_music_search_cache_query ON public.music_search_cache(search_query);
CREATE INDEX IF NOT EXISTS idx_music_search_cache_expires ON public.music_search_cache(expires_at);

-- Enable RLS
ALTER TABLE public.music_search_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this is cached search results)
CREATE POLICY "Music search cache is publicly accessible"
ON public.music_search_cache
FOR SELECT
USING (true);