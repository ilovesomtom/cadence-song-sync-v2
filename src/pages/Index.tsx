import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BPMInput from "@/components/BPMInput";
import PlaylistSelector from "@/components/PlaylistSelector";
import SongCard from "@/components/SongCard";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-runner.jpg";

const mockSongs = [
  { title: "Thunder", artist: "Imagine Dragons", bpm: 168, duration: "3:07", inLibrary: true },
  { title: "Stronger", artist: "Kelly Clarkson", bpm: 168, duration: "3:42", inLibrary: true },
  { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", bpm: 170, duration: "4:18", inLibrary: false },
  { title: "Pump It", artist: "Black Eyed Peas", bpm: 172, duration: "3:35", inLibrary: true },
];

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-dark">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative px-8">
            <h1 className="text-6xl font-bold text-white mb-4">
              Find Your Perfect
            </h1>
            <h2 className="text-6xl font-bold text-primary mb-6">
              Running Rhythm
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Match your running cadence with songs from your Spotify library. 
              Build the perfect playlist for your pace.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 py-3 text-lg">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Get Started
            </Button>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex-1 px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <BPMInput />
              <PlaylistSelector />
            </div>
            
            {/* Right Column - Song Results */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Songs at 168-172 BPM</h2>
                <p className="text-muted-foreground">Perfect for your running pace</p>
              </div>
              
              <div className="space-y-1">
                {mockSongs.map((song, index) => (
                  <SongCard key={index} {...song} />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="rounded-full px-6">
                  Load More Songs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
