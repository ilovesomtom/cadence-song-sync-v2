import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const genres = [
  "Pop",
  "Electronics", 
  "Hip hop",
  "Rock",
  "Alternative",
  "Indie",
  "Dance",
  "House"
];

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

const GenreSelector = ({ selectedGenres, onGenresChange }: GenreSelectorProps) => {
  const [showMore, setShowMore] = useState(false);
  
  const visibleGenres = showMore ? genres : genres.slice(0, 3);
  
  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre) 
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    onGenresChange(newGenres);
  };
  
  const handleSelectAll = () => {
    if (selectedGenres.length === genres.length) {
      onGenresChange([]);
    } else {
      onGenresChange([...genres]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Preferred Genre</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all"
            checked={selectedGenres.length === genres.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm text-muted-foreground">
            Select all
          </label>
        </div>
        
        {visibleGenres.map((genre) => (
          <div key={genre} className="flex items-center space-x-2">
            <Checkbox 
              id={genre}
              checked={selectedGenres.includes(genre)}
              onCheckedChange={() => handleGenreToggle(genre)}
            />
            <label htmlFor={genre} className="text-sm text-white">
              {genre}
            </label>
          </div>
        ))}
        
        {genres.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(!showMore)}
            className="text-muted-foreground hover:text-white p-0 h-auto"
          >
            {showMore ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                See less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                See more
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenreSelector;