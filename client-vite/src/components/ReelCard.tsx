import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AudioInfo, Reel } from "story-typescript-tutorial/data/mock-data";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ReelCardProps {
  reel: Reel;
}

export function ReelCard({ reel }: ReelCardProps) {
  const [poster, setPoster] = useState<string | null>(null);

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

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.src = reel.videoUrl;
        video.muted = true;
        video.playsInline = true;

        await new Promise<void>((resolve, reject) => {
          video.addEventListener("loadeddata", () => {
            video.currentTime = 1;
          });

          video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL("image/jpeg");
              setPoster(dataUrl);
            }
            resolve();
          });

          video.addEventListener("error", reject);
        });
      } catch (error) {
        console.error("Failed to generate video thumbnail", error);
      }
    };

    if (reel.thumbnailUrl === "") {
      generateThumbnail();
    } else {
      setPoster(reel.thumbnailUrl);
    }
  }, [reel.thumbnailUrl, reel.videoUrl]);

  return (
    <Link to={`/reels/${reel.id}`} className="block">
      <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-[2/3] bg-gray-200 flex items-center justify-center">
          <img
            src={poster || "/placeholder.svgx"}
            alt={reel.title}
            className="object-cover w-full h-full"
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
