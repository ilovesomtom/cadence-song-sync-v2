import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="hover:bg-accent/5 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
            {albumArt ? (
              <img src={albumArt} alt="Album art" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {bpm} BPM
              </Badge>
              <span className="text-xs text-muted-foreground">{duration}</span>
              {inLibrary && (
                <Heart className="h-3 w-3 text-accent fill-current" />
              )}
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="accent">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SongCard;