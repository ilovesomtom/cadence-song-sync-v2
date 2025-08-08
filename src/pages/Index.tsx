import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMusicSearch } from "@/hooks/useMusicSearch";
import GenreSelector from "@/components/GenreSelector";
import SearchResults from "@/components/SearchResults";

const Index = () => {
  const { user, signInWithSpotify } = useAuth();
  const { searchSongs, songs, isLoading, error } = useMusicSearch();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [bpmMode, setBpmMode] = useState<"single" | "range">("single");
  const [singleBpm, setSingleBpm] = useState("");
  const [minBpm, setMinBpm] = useState("");
  const [maxBpm, setMaxBpm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Surface OAuth errors (e.g., provider_email_needs_verification) from redirect params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    if (error) {
      toast.error(errorDescription || 'Authentication error');
      // Clean the URL
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
  }, []);
  
  const handleSearch = async () => {
    await searchSongs({
      bpmMode,
      singleBpm,
      minBpm,
      maxBpm,
      genres: selectedGenres
    });
    setShowResults(true);
  };
  
  const handlePlaylistSearch = async () => {
    if (!user) {
      signInWithSpotify();
    } else {
      await searchSongs({
        bpmMode,
        singleBpm,
        minBpm,
        maxBpm,
        genres: selectedGenres
      });
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
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Centered Content Panel */}
        <div className="w-full max-w-md space-y-8">
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
                     className="text-center text-lg font-mono max-w-sm bg-muted/20 text-white"
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
                       className="text-center font-mono bg-muted/20 text-white"
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
                       className="text-center font-mono bg-muted/20 text-white"
                     />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Genre Selection */}
          <GenreSelector 
            selectedGenres={selectedGenres}
            onGenresChange={setSelectedGenres}
          />
          
          {/* Search Buttons */}
           <div className="space-y-3">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white w-full max-w-sm rounded-lg"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
             
             <div className="text-center text-muted-foreground text-sm">or</div>
             
             <Button 
               onClick={handlePlaylistSearch}
               variant="outline"
               disabled={!user || isLoading}
               className="w-full max-w-sm rounded-lg border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
             >
               {isLoading ? 'Searching...' : 'Search from your playlists'}
             </Button>
             
             {/* Error Display */}
             {error && (
               <div className="text-red-400 text-sm text-center mt-2">
                 {error}
               </div>
             )}
           </div>
           
           {/* Bottom Message */}
           {!showResults && (
             <div className="text-center space-y-4 mt-8">
               <Music className="h-16 w-16 text-muted-foreground mx-auto" />
               <div>
                 <h3 className="text-xl font-medium text-white mb-2">Ready to find your rhythm?</h3>
                 <p className="text-muted-foreground">Set your BPM and search for the perfect songs</p>
               </div>
             </div>
           )}
         </div>
         
         {/* Search Results Modal */}
         {showResults && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
             <div className="bg-background rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
               <div className="p-6">
                  <SearchResults 
                    songs={songs}
                    bpmRange={getBpmDisplay()}
                    onShuffle={handleShuffle}
                  />
                 <Button 
                   onClick={() => setShowResults(false)}
                   variant="outline"
                   className="mt-4 w-full"
                 >
                   Close
                 </Button>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default Index;
