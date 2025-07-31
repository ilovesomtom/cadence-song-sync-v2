import { Button } from "@/components/ui/button";
import { Play, Plus, Shuffle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Song {
  title: string;
  artist: string;
  bpm: number;
  duration: string;
  inLibrary?: boolean;
}

interface SearchResultsProps {
  songs: Song[];
  bpmRange: string;
  onShuffle: () => void;
}

const SearchResults = ({ songs, bpmRange, onShuffle }: SearchResultsProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Songs at {bpmRange}
        </h2>
        <p className="text-muted-foreground">Perfect for your running pace</p>
      </div>
      
      <div className="space-y-1">
        {songs.map((song, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-colors"
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-muted/20 hover:bg-muted/40"
            >
              <Play className="h-4 w-4 fill-current" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{song.title}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {song.artist}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {song.duration}
            </div>
            
            <div className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded font-medium">
              {song.bpm} BPM
            </div>
            
            {user && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onShuffle}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;