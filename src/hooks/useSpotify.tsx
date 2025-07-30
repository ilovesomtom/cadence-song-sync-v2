import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SpotifyToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  token_type: string;
  scope: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: { total: number };
  images: Array<{ url: string }>;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  duration_ms: number;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  audio_features?: {
    tempo: number;
  };
}

export const useSpotify = () => {
  const { user, session } = useAuth();
  const [spotifyToken, setSpotifyToken] = useState<SpotifyToken | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.provider_token) {
      // Store the Spotify token when we get it from the session
      storeSpotifyToken(session.provider_token, session.provider_refresh_token);
    }
  }, [session]);

  const storeSpotifyToken = async (accessToken: string, refreshToken?: string) => {
    if (!user || !accessToken) return;

    try {
      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now
      
      const { error } = await supabase
        .from('spotify_tokens')
        .upsert({
          id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken || '',
          expires_at: expiresAt,
          token_type: 'Bearer',
          scope: 'user-read-private user-read-email playlist-read-private user-library-read user-top-read',
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error storing Spotify token:', error);
      } else {
        setSpotifyToken({
          access_token: accessToken,
          refresh_token: refreshToken || '',
          expires_at: expiresAt,
          token_type: 'Bearer',
          scope: 'user-read-private user-read-email playlist-read-private user-library-read user-top-read',
        });
      }
    } catch (error) {
      console.error('Error in storeSpotifyToken:', error);
    }
  };

  const fetchPlaylists = async () => {
    if (!spotifyToken) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${spotifyToken.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.items || []);
      } else {
        console.error('Failed to fetch playlists:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTracksByBPM = async (targetBPM: number, selectedPlaylists: string[] = []) => {
    if (!spotifyToken) return [];

    setLoading(true);
    try {
      const tracks: SpotifyTrack[] = [];
      
      // If specific playlists are selected, fetch from those
      if (selectedPlaylists.length > 0) {
        for (const playlistId of selectedPlaylists) {
          const playlistTracks = await fetchPlaylistTracks(playlistId);
          tracks.push(...playlistTracks);
        }
      } else {
        // Otherwise, search user's top tracks and liked songs
        const topTracks = await fetchTopTracks();
        tracks.push(...topTracks);
      }

      // Get audio features for tracks and filter by BPM
      const tracksWithBPM = await getTracksWithBPM(tracks);
      const filteredTracks = tracksWithBPM.filter(track => {
        if (!track.audio_features) return false;
        return Math.abs(track.audio_features.tempo - targetBPM) <= 5; // ±5 BPM tolerance
      });

      return filteredTracks;
    } catch (error) {
      console.error('Error searching tracks by BPM:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistTracks = async (playlistId: string): Promise<SpotifyTrack[]> => {
    if (!spotifyToken) return [];

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${spotifyToken.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.items.map((item: any) => item.track).filter((track: any) => track && track.id);
      }
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
    
    return [];
  };

  const fetchTopTracks = async (): Promise<SpotifyTrack[]> => {
    if (!spotifyToken) return [];

    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        headers: {
          'Authorization': `Bearer ${spotifyToken.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      }
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
    
    return [];
  };

  const getTracksWithBPM = async (tracks: SpotifyTrack[]): Promise<SpotifyTrack[]> => {
    if (!spotifyToken || tracks.length === 0) return [];

    try {
      const trackIds = tracks.map(track => track.id).join(',');
      const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        headers: {
          'Authorization': `Bearer ${spotifyToken.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return tracks.map((track, index) => ({
          ...track,
          audio_features: data.audio_features[index],
        }));
      }
    } catch (error) {
      console.error('Error fetching audio features:', error);
    }
    
    return tracks;
  };

  return {
    spotifyToken: !!spotifyToken,
    playlists,
    loading,
    fetchPlaylists,
    searchTracksByBPM,
  };
};
