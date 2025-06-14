import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ReelCard } from "@/components/ReelCard";
import { mockUsers, mockReels } from "@/data/mock-data";
import { useParams } from "react-router-dom";

export default function UserProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();

  const user = mockUsers.find((u) => u.id === profileId);
  const userReels = mockReels.filter((r) => r.userId === profileId);

  if (!user) {
    return (
      <div className="text-center text-muted-foreground">User not found.</div>
    );
  }

  return (
    <section className="py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user.avatarUrl || "/placeholder.svg"}
            alt={user.username}
          />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">@{user.username}</h1>
        <p className="text-muted-foreground text-center max-w-md">{user.bio}</p>
      </div>

      <Separator className="my-8" />
      <div className="px-7">
        <h2 className="text-2xl font-bold mb-6">Uploaded Reels</h2>
        {userReels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {userReels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No reels uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
}
