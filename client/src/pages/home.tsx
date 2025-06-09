import { ReelCard } from "@/components/ReelCard";
import { mockReels } from "@/data/mock-data";

export default function HomePage() {
  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-6">Reels Feed</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mockReels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  );
}
