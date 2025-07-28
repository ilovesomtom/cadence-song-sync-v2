import { Button } from "@/components/ui/button";
import { Play, Plus, Heart } from "lucide-react";

interface SongCardProps {
  title: string;
  artist: string;
  bpm: number;
  duration: string;
  albumArt?: string;
  inLibrary?: boolean;
}

const SongCard = ({ title, artist, bpm, duration, albumArt, inLibrary = false }: SongCardProps) => {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      {/* Album Art */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {albumArt ? (
          <img src={albumArt} alt="Album art" className="w-full h-full rounded object-cover" />
        ) : (
          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
            <Play className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <Button 
          size="sm" 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8 m-auto transition-opacity"
        >
          <Play className="h-3 w-3 fill-current" />
        </Button>
      </div>
      
      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate hover:underline cursor-pointer">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {inLibrary && <Heart className="h-3 w-3 text-primary fill-current" />}
          <span className="truncate hover:underline cursor-pointer">{artist}</span>
        </div>
      </div>
      
      {/* BPM Badge */}
      <div className="hidden sm:block">
        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
          {bpm} BPM
        </span>
      </div>
      
      {/* Duration and Actions */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>{duration}</span>
        <Button 
          size="sm" 
          variant="ghost" 
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SongCard;