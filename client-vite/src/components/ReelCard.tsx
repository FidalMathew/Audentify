import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AudioInfo, Reel } from "@/data/mock-data";

interface ReelCardProps {
  reel: Reel;
}

export function ReelCard({ reel }: ReelCardProps) {
  const renderAudioInfo = (audioInfo: AudioInfo) => {
    if (audioInfo.isUnique) {
      return <Badge variant="secondary">Unique Audio</Badge>;
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Derivative ({audioInfo.similarityScore}% similar)
        </Badge>
      );
    }
  };

  return (
    <Link to={`/reels/${reel.id}`} className="block">
      <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-[2/3] bg-gray-200 flex items-center justify-center">
          <img
            src={reel.thumbnailUrl || "/placeholder.svg"}
            alt={reel.title}
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2">
            {renderAudioInfo(reel.audioInfo)}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="text-sm font-semibold line-clamp-2">{reel.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">@{reel.username}</p>
          <p className="text-xs text-muted-foreground">
            {reel.views.toLocaleString()} views
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
