import { mockReels } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";

interface ReelDetailPageProps {
  params: {
    id: string;
  };
}

export default function ReelDetailPage() {
  const router = useRouter();
  const { reelid } = router.query;

  const reel = mockReels.find((r) => r.id === reelid);

  if (!reel) {
    return (
      <div className="text-center text-muted-foreground">Reel not found.</div>
    );
  }

  return (
    <section className="py-8" style={{ height: "calc(100vh - 64px)" }}>
      <div className="px-7 flex h-full gap-7">
        <div className="h-full rounded-lg w-[60%]">
          <div className="aspect-[9/16] w-full h-full flex justify-center">
            <video src={reel.videoUrl} controls className="object-contain">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{reel.title}</h1>
          <Link
            href={`/profile/${reel.userId}`}
            className="text-lg text-muted-foreground hover:underline"
          >
            @{reel.username}
          </Link>
          <p className="text-sm text-muted-foreground">
            {reel.views.toLocaleString()} views &bull; Uploaded on{" "}
            {reel.uploadDate}
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Audio Information</h2>
            {reel.audioInfo.isUnique ? (
              <Badge className="bg-green-100 text-green-800">
                Unique Audio
              </Badge>
            ) : (
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Derivative Audio
                </Badge>
                <p className="text-sm">
                  This audio is {reel.audioInfo.similarityScore}% similar to:
                </p>
                {reel.audioInfo.similarToReelId &&
                  reel.audioInfo.similarToReelTitle && (
                    <Button variant="link" className="p-0 h-auto text-base">
                      <Link
                        href={`/reels/${reel.audioInfo.similarToReelId}`}
                        className="flex items-center gap-1"
                      >
                        {reel.audioInfo.similarToReelTitle}{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
