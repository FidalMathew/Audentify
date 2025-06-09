import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Home, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Camera className="h-6 w-6" />
          ReelFlow
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Feed</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/upload">
              <Camera className="h-5 w-5" />
              <span className="sr-only">Upload Reel</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/user-1">
              {" "}
              {/* Mock user ID */}
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
