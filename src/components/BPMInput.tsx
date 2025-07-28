import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from "lucide-react";

const BPMInput = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Music className="h-5 w-5 text-accent" />
          Set Your Target BPM
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single BPM</TabsTrigger>
            <TabsTrigger value="range">BPM Range</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="singleBpm">Target BPM</Label>
              <Input
                id="singleBpm"
                type="number"
                placeholder="e.g., 180"
                min="60"
                max="200"
                className="text-center text-lg font-mono"
              />
            </div>
            <Button variant="gradient" className="w-full">
              Find Songs at 180 BPM
            </Button>
          </TabsContent>
          
          <TabsContent value="range" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minBpm">Min BPM</Label>
                <Input
                  id="minBpm"
                  type="number"
                  placeholder="170"
                  min="60"
                  max="200"
                  className="text-center font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBpm">Max BPM</Label>
                <Input
                  id="maxBpm"
                  type="number"
                  placeholder="190"
                  min="60"
                  max="200"
                  className="text-center font-mono"
                />
              </div>
            </div>
            <Button variant="gradient" className="w-full">
              Find Songs in Range
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BPMInput;