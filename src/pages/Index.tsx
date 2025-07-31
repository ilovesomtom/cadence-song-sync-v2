import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import GenreSelector from "@/components/GenreSelector";
import SearchResults from "@/components/SearchResults";

const mockSongs = [
  { title: "Thunder", artist: "Imagine Dragons", bpm: 168, duration: "3:07", inLibrary: true },
  { title: "Stronger", artist: "Kelly Clarkson", bpm: 168, duration: "3:42", inLibrary: true },
  { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", bpm: 170, duration: "4:18", inLibrary: false },
  { title: "Pump It", artist: "Black Eyed Peas", bpm: 172, duration: "3:35", inLibrary: true },
];

const Index = () => {
  const { user, signInWithSpotify } = useAuth();
  const [bpmMode, setBpmMode] = useState<"single" | "range">("single");
  const [singleBpm, setSingleBpm] = useState("");
  const [minBpm, setMinBpm] = useState("");
  const [maxBpm, setMaxBpm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = () => {
    setShowResults(true);
  };
  
  const handlePlaylistSearch = () => {
    if (!user) {
      signInWithSpotify();
    } else {
      setShowResults(true);
    }
  };
  
  const handleShuffle = () => {
    // Shuffle logic here
    console.log("Shuffling songs...");
  };
  
  const getBpmDisplay = () => {
    if (bpmMode === "single" && singleBpm) {
      return `${singleBpm} BPM`;
    } else if (bpmMode === "range" && minBpm && maxBpm) {
      return `${minBpm}-${maxBpm} BPM`;
    }
    return "168-172 BPM";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Search Controls */}
        <div className="bg-card/20 p-8 space-y-8">
          {/* Spotify Login */}
          {!user && (
            <div className="text-center space-y-3">
              <Button 
                onClick={signInWithSpotify}
                className="bg-green-600 hover:bg-green-700 text-white w-full max-w-sm rounded-lg py-3"
              >
                <Music className="h-5 w-5 mr-2" />
                Sign in with Spotify
              </Button>
              <div className="text-sm text-muted-foreground">
                <div>To search from your playlist</div>
                <div>and add songs to your account</div>
              </div>
            </div>
          )}
          
          {/* BPM Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-medium text-white">Set Your Target BPM</h2>
            </div>
            
            <Tabs value={bpmMode} onValueChange={(value) => setBpmMode(value as "single" | "range")}>
              <TabsList className="grid w-full grid-cols-2 max-w-sm">
                <TabsTrigger value="single">Single BPM</TabsTrigger>
                <TabsTrigger value="range">BPM Range</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="singleBpm" className="text-white">Target BPM</Label>
                  <Input
                    id="singleBpm"
                    type="number"
                    placeholder="e.g., 180"
                    value={singleBpm}
                    onChange={(e) => setSingleBpm(e.target.value)}
                    min="60"
                    max="200"
                    className="text-center text-lg font-mono max-w-sm bg-muted/20"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="range" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="space-y-2">
                    <Label htmlFor="minBpm" className="text-white">Min BPM</Label>
                    <Input
                      id="minBpm"
                      type="number"
                      placeholder="170"
                      value={minBpm}
                      onChange={(e) => setMinBpm(e.target.value)}
                      min="60"
                      max="200"
                      className="text-center font-mono bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBpm" className="text-white">Max BPM</Label>
                    <Input
                      id="maxBpm"
                      type="number"
                      placeholder="190"
                      value={maxBpm}
                      onChange={(e) => setMaxBpm(e.target.value)}
                      min="60"
                      max="200"
                      className="text-center font-mono bg-muted/20"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Genre Selection */}
          <GenreSelector />
          
          {/* Search Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white w-full max-w-sm rounded-lg"
            >
              Search
            </Button>
            
            <div className="text-center text-muted-foreground text-sm">or</div>
            
            <Button 
              onClick={handlePlaylistSearch}
              variant="outline"
              className="w-full max-w-sm rounded-lg border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              disabled={!user}
            >
              Search from your playlists
            </Button>
          </div>
        </div>
        
        {/* Right Panel - Search Results */}
        <div className="p-8">
          {showResults ? (
            <SearchResults 
              songs={mockSongs}
              bpmRange={getBpmDisplay()}
              onShuffle={handleShuffle}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-4">
                <Music className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Ready to find your rhythm?</h3>
                  <p className="text-muted-foreground">Set your BPM and search for the perfect songs</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
