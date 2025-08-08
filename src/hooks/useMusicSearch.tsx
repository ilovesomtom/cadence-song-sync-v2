import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Song {
  title: string;
  artist: string;
  bpm: number;
  duration: string;
  inLibrary?: boolean;
}

interface SearchParams {
  bpmMode: 'single' | 'range';
  singleBpm?: string;
  minBpm?: string;
  maxBpm?: string;
  genres: string[];
  source?: 'recommendations' | 'top' | 'saved' | 'playlists';
  playlistIds?: string[];
}

export const useMusicSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchSongs = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎵 searchSongs called with params:', params);
      
      // Attach the user's auth token so the Edge Function can read user-scoped data
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      console.log('🔑 Session token available:', !!accessToken);
      console.log('👤 User session:', sessionData.session?.user?.email);

      const { data, error: functionError } = await supabase.functions.invoke('music-search', {
        body: params,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      console.log('📡 Function response:', { data, error: functionError });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data && data.songs) {
        setSongs(data.songs);
        console.log('✅ Search completed, found', data.songs.length, 'songs');
        console.log('📊 Sample songs:', data.songs.slice(0, 3));
      } else {
        setSongs([]);
        console.log('❌ No songs found in response');
      }
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchSongs,
    songs,
    isLoading,
    error
  };
};