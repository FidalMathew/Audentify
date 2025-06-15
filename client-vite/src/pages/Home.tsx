import { ReelCard } from "@/components/ReelCard";
import { mockReels } from "story-typescript-tutorial/data/mock-data";
import Connect from "./Connect";
import { useGlobalContext } from "@/Context/useGlobalContext";
import { uploadFileToIPFS } from "@/../story-typescript-tutorial/utils/functions/uploadToIpfs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { wallet } = useGlobalContext();
  if (!wallet)
    return (
      <div>
        <Connect />
      </div>
    );

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reels Feed</h1>
      {/* <Button
        onClick={() =>
          uploadFileToIPFS(new File([""], "example.mp4", { type: "video/mp4" }))
        }
      >
        Upload Reel
      </Button> */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mockReels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  );
}
