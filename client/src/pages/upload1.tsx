import { Button } from "@/components/ui/button";
import { AudioInfo } from "@/data/mock-data";
import { Upload } from "lucide-react";
import { useRef } from "react";

type CheckpointStatus = "idle" | "loading" | "success" | "error";

interface CheckpointProps {
  title: string;
  status: CheckpointStatus;
  message: string;
  progress?: number;
}

export default function Upload1() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className=""
      style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
    >
      <div className="p-8 h-full">
        <div className="h-full border w-full rounded-lg flex">
          <div className="h-full w-2/3 bg-black relative flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-white text-lg font-medium mb-2">
                Select a video to upload
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Choose a video file from your device
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
              >
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                // onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
          <div className="h-full w-1/3 border-l rounded-r-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Upload Reel</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
