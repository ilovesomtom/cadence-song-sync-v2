import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import BPMInput from "@/components/BPMInput";
import PlaylistSelector from "@/components/PlaylistSelector";
import SongCard from "@/components/SongCard";
import { ArrowRight, Zap, Target, Headphones } from "lucide-react";
import heroImage from "@/assets/hero-runner.jpg";

const mockSongs = [
  { title: "Thunder", artist: "Imagine Dragons", bpm: 168, duration: "3:07", inLibrary: true },
  { title: "Stronger", artist: "Kelly Clarkson", bpm: 168, duration: "3:42", inLibrary: true },
  { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", bpm: 170, duration: "4:18", inLibrary: false },
  { title: "Pump It", artist: "Black Eyed Peas", bpm: 172, duration: "3:35", inLibrary: true },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="block bg-gradient-accent bg-clip-text text-transparent">
              Running Rhythm
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Match your running cadence with songs from your Spotify library. 
            Build the perfect playlist for your pace.
          </p>
          <Button variant="accent" size="lg" className="gap-2">
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Precise BPM Matching</h3>
                <p className="text-muted-foreground">
                  Find songs that match your exact running cadence or within your preferred range.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Headphones className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Music Library</h3>
                <p className="text-muted-foreground">
                  Search through your existing Spotify playlists and discover new recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Playlists</h3>
                <p className="text-muted-foreground">
                  Create and save custom cadence-based playlists directly to your Spotify account.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input */}
            <div className="space-y-6">
              <BPMInput />
              <PlaylistSelector />
            </div>
            
            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Songs at 168-172 BPM</h2>
                  <div className="space-y-3">
                    {mockSongs.map((song, index) => (
                      <SongCard key={index} {...song} />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline">Load More Songs</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
