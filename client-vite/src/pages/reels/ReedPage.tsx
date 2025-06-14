import { mockReels } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ReelDetailPageProps {
  params: {
    id: string;
  };
}

const handleRedirect = () => {
  // Replace with actual music URL or streaming service link
  window.open("https://open.spotify.com/track/example", "_blank");
};

export default function ReelDetailPage() {
  const { reelId } = useParams<{ reelId: string }>();
  console.log("Reel ID from params:", reelId);

  const reel = mockReels.find((r) => r.id === reelId);

  if (!reel) {
    return (
      <div className="text-center text-muted-foreground">Reel not found.</div>
    );
  }

  return (
    <section className="py-8" style={{ height: "calc(100vh - 64px)" }}>
      <div className="px-7 flex h-full gap-7">
        <div className="h-full rounded-lg w-[60%] flex justify-center">
          <div className="aspect-[9/16] h-full flex border-2 rounded-lg">
            <video src={reel.videoUrl} controls className="object-contain">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{reel.title}</h1>
          <Link
            to={`/profile/${reel.userId}`}
            className="text-lg text-muted-foreground hover:underline"
          >
            @{reel.username}
          </Link>
          <p className="text-sm text-muted-foreground">
            {reel.views.toLocaleString()} views &bull; Uploaded on{" "}
            {reel.uploadDate}
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Audio Information</h2>
            {reel.audioInfo.isUnique ? (
              <Badge className="bg-green-100 text-green-800">
                Unique Audio
              </Badge>
            ) : (
              <div className="space-y-7">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Derivative Audio
                </Badge>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    This audio is {reel.audioInfo.similarityScore}% similar to:
                  </p>
                  {reel.audioInfo.similarToReelId &&
                    reel.audioInfo.similarToReelTitle && (
                      // <Button variant="link" className="p-0 h-auto text-base">
                      //   <Link
                      //     href={`/reels/${reel.audioInfo.similarToReelId}`}
                      //     className="flex items-center gap-1"
                      //   >
                      //     {reel.audioInfo.similarToReelTitle}{" "}
                      //     <ArrowRight className="h-4 w-4" />
                      //   </Link>
                      // </Button>

                      <Card className="w-72 border border-black bg-white dark:bg-zinc-900 shadow-none">
                        <CardContent className="p-4 shadow-none">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                              <img
                                src="https://i.scdn.co/image/ab67616d00001e02707ea5b8023ac77d31756ed4"
                                alt="Album cover"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-none truncate dark:text-zinc-200">
                                Balam Pichkari
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                                Yeh Jawani hain Deewani
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full shrink-0"
                              onClick={handleRedirect}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
