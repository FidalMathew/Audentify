import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AudioWaveformIcon, User, Home, Camera } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <Link to="/home" className="flex items-center gap-2 font-bold text-lg">
          <AudioWaveformIcon className="h-6 w-6" />
          Audentify
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Feed</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/upload">
              <Camera className="h-5 w-5" />
              <span className="sr-only">Upload Reel</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile/user-1">
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
