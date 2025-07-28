import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music2, ListMusic } from "lucide-react";

const mockPlaylists = [
  { id: "1", name: "Workout Hits", songCount: 84, selected: true },
  { id: "2", name: "Running Favorites", songCount: 56, selected: true },
  { id: "3", name: "High Energy Mix", songCount: 92, selected: false },
  { id: "4", name: "Electronic Pump", songCount: 73, selected: false },
  { id: "5", name: "Rock Workout", songCount: 45, selected: true },
  { id: "6", name: "Pop Cardio", songCount: 68, selected: false },
];

const PlaylistSelector = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-accent" />
          Select Playlists to Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-3">
            {mockPlaylists.map((playlist) => (
              <div key={playlist.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <Checkbox
                  id={playlist.id}
                  defaultChecked={playlist.selected}
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={playlist.id}
                    className="text-sm font-medium cursor-pointer block truncate"
                  >
                    {playlist.name}
                  </label>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Music2 className="h-3 w-3" />
                    {playlist.songCount} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 text-xs text-muted-foreground text-center">
          {mockPlaylists.filter(p => p.selected).length} playlists selected
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaylistSelector;