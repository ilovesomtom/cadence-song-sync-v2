import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-background/10 hover:bg-background/20">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-background/10 hover:bg-background/20">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-6">
          <User className="h-4 w-4 mr-2" />
          Log in with Spotify
        </Button>
      </div>
    </header>
  );
};

export default Header;