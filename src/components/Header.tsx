import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signInWithSpotify, signOut, loading } = useAuth();

  const handleSpotifyLogin = async () => {
    try {
      await signInWithSpotify();
    } catch (error) {
      console.error('Failed to sign in with Spotify:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

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
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={user.user_metadata?.avatar_url} 
                    alt={user.user_metadata?.full_name || user.email} 
                  />
                  <AvatarFallback className="bg-spotify-green text-dark">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleSpotifyLogin}
            disabled={loading}
            className="bg-spotify-green hover:bg-spotify-green/90 text-dark font-medium rounded-full px-6"
          >
            <User className="h-4 w-4 mr-2" />
            {loading ? 'Loading...' : 'Connect Spotify'}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;