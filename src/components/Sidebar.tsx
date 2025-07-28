import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <h1 className="text-white text-xl font-bold">CadenceMatch</h1>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 mb-8">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent text-base font-medium h-10"
        >
          <Home className="mr-3 h-5 w-5" />
          Home
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent text-base font-medium h-10"
        >
          <Search className="mr-3 h-5 w-5" />
          Search
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent text-base font-medium h-10"
        >
          <Library className="mr-3 h-5 w-5" />
          Your Library
        </Button>
      </nav>

      <Separator className="bg-sidebar-border mb-6" />

      {/* Quick Actions */}
      <div className="space-y-2 mb-6">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent text-sm h-8"
        >
          <Plus className="mr-3 h-4 w-4" />
          Create Playlist
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent text-sm h-8"
        >
          <Heart className="mr-3 h-4 w-4" />
          Liked Songs
        </Button>
      </div>

      <Separator className="bg-sidebar-border mb-4" />

      {/* Recently Created */}
      <div className="flex-1">
        <h3 className="text-sidebar-foreground text-sm font-medium mb-3">Recently Created</h3>
        <div className="space-y-1">
          <button className="text-sidebar-foreground hover:text-white text-sm block w-full text-left p-1 rounded">
            My Running Mix
          </button>
          <button className="text-sidebar-foreground hover:text-white text-sm block w-full text-left p-1 rounded">
            High Intensity Workout
          </button>
          <button className="text-sidebar-foreground hover:text-white text-sm block w-full text-left p-1 rounded">
            Morning Jog Beats
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;