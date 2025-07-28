import { Button } from "@/components/ui/button";
import { Music, User } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CadenceMatch
          </h1>
        </div>
        
        <Button variant="outline" className="gap-2">
          <User className="h-4 w-4" />
          Connect Spotify
        </Button>
      </div>
    </header>
  );
};

export default Header;