import type React from "react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2, Upload } from "lucide-react";
import type { AudioInfo } from "@/data/mock-data";
import Link from "next/link";

type CheckpointStatus = "idle" | "loading" | "success" | "error";

interface CheckpointProps {
  title: string;
  status: CheckpointStatus;
  message: string;
  progress?: number;
}

function Checkpoint({ title, status, message, progress }: CheckpointProps) {
  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <span className="h-5 w-5 border rounded-full" />;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-grow">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {status === "loading" && progress !== undefined && (
          <Progress value={progress} className="w-full mt-1" />
        )}
      </div>
    </div>
  );
}

export default function Upload1() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [reelTitle, setReelTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Audio Analysis Checkpoints
  const [extractAudioStatus, setExtractAudioStatus] =
    useState<CheckpointStatus>("idle");
  const [extractAudioMessage, setExtractAudioMessage] = useState("");
  const [extractAudioProgress, setExtractAudioProgress] = useState(0);

  const [findSimilarityStatus, setFindSimilarityStatus] =
    useState<CheckpointStatus>("idle");
  const [findSimilarityMessage, setFindSimilarityMessage] = useState("");
  const [findSimilarityProgress, setFindSimilarityProgress] = useState(0);
  const [finalAudioResult, setFinalAudioResult] = useState<AudioInfo | null>(
    null
  );

  // IPFS & Registration Checkpoints
  const [uploadToIpfsStatus, setUploadToIpfsStatus] =
    useState<CheckpointStatus>("idle");
  const [uploadToIpfsMessage, setUploadToIpfsMessage] = useState("");
  const [uploadToIpfsProgress, setUploadToIpfsProgress] = useState(0);

  const [registerIpStatus, setRegisterIpStatus] =
    useState<CheckpointStatus>("idle");
  const [registerIpMessage, setRegisterIpMessage] = useState("");
  const [registerIpProgress, setRegisterIpProgress] = useState(0);

  const [finishingStatus, setFinishingStatus] =
    useState<CheckpointStatus>("idle");
  const [finishingMessage, setFinishingMessage] = useState("");
  const [finishingProgress, setFinishingProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create video URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      resetAnalysisState();
    }
  };

  const resetAnalysisState = () => {
    setIsAnalyzing(false);
    setIsUploading(false);
    setExtractAudioStatus("idle");
    setExtractAudioMessage("");
    setExtractAudioProgress(0);
    setFindSimilarityStatus("idle");
    setFindSimilarityMessage("");
    setFindSimilarityProgress(0);
    setFinalAudioResult(null);
    resetUploadState();
  };

  const resetUploadState = () => {
    setUploadToIpfsStatus("idle");
    setUploadToIpfsMessage("");
    setUploadToIpfsProgress(0);
    setRegisterIpStatus("idle");
    setRegisterIpMessage("");
    setRegisterIpProgress(0);
    setFinishingStatus("idle");
    setFinishingMessage("");
    setFinishingProgress(0);
  };

  const simulateAudioAnalysis = async (): Promise<AudioInfo> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const similarityScore = Math.floor(Math.random() * 100) + 1; // 1-100%

        let result: AudioInfo;
        if (similarityScore > 90) {
          result = { isUnique: true, similarityScore: similarityScore };
        } else {
          const similarReels = [
            { id: "reel-1", title: "Morning Coffee Vibes" },
            { id: "reel-3", title: "City Lights at Night" },
          ];
          const randomSimilarReel =
            similarReels[Math.floor(Math.random() * similarReels.length)];
          result = {
            isUnique: false,
            similarityScore: similarityScore,
            similarToReelId: randomSimilarReel.id,
            similarToReelTitle: randomSimilarReel.title,
          };
        }
        resolve(result);
      }, 1500);
    });
  };

  const simulateCheckpoint = async (
    setStatus: React.Dispatch<React.SetStateAction<CheckpointStatus>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    loadingMessage: string,
    successMessage: string,
    errorMessage: string,
    duration: number,
    successRate = 0.9
  ): Promise<boolean> => {
    setStatus("loading");
    setMessage(loadingMessage);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, duration / 10);

    await new Promise((resolve) => setTimeout(resolve, duration));
    clearInterval(interval);

    const success = Math.random() < successRate;
    if (success) {
      setStatus("success");
      setMessage(successMessage);
      setProgress(100);
      return true;
    } else {
      setStatus("error");
      setMessage(errorMessage);
      setProgress(0);
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !reelTitle) {
      alert("Please select a video file and enter a title.");
      return;
    }

    resetUploadState();

    setIsAnalyzing(true);

    // Checkpoint 1: Extract Audio
    const extracted = await simulateCheckpoint(
      setExtractAudioStatus,
      setExtractAudioMessage,
      setExtractAudioProgress,
      "Extracting audio from your reel...",
      "Audio extracted successfully.",
      "Failed to extract audio. Please try again.",
      1000
    );
    if (!extracted) {
      setIsAnalyzing(false);
      return;
    }

    // Checkpoint 2: Find Similarity Score
    const compared = await simulateCheckpoint(
      setFindSimilarityStatus,
      setFindSimilarityMessage,
      setFindSimilarityProgress,
      "Comparing audio for similarity...",
      "Similarity analysis complete.",
      "Failed to compare audio. Please try again.",
      1500
    );
    if (!compared) {
      setIsAnalyzing(false);
      return;
    }
    const audioResult = await simulateAudioAnalysis();
    setFinalAudioResult(audioResult);

    setIsAnalyzing(false);
  };

  const handleUploadToBlockchain = async () => {
    setIsUploading(true);
    resetUploadState();

    // Checkpoint 3: Upload to IPFS
    const uploaded = await simulateCheckpoint(
      setUploadToIpfsStatus,
      setUploadToIpfsMessage,
      setUploadToIpfsProgress,
      "Uploading reel to IPFS...",
      "Reel uploaded to IPFS successfully.",
      "Failed to upload to IPFS. Please try again.",
      1200
    );
    if (!uploaded) {
      setIsUploading(false);
      return;
    }

    // Checkpoint 4: Registering IP Status
    const registered = await simulateCheckpoint(
      setRegisterIpStatus,
      setRegisterIpMessage,
      setRegisterIpProgress,
      "Registering IP status...",
      "IP status registered.",
      "Failed to register IP status. Please try again.",
      1000
    );
    if (!registered) {
      setIsUploading(false);
      return;
    }

    // Checkpoint 5: Finishing Status
    const finished = await simulateCheckpoint(
      setFinishingStatus,
      setFinishingMessage,
      setFinishingProgress,
      "Finalizing upload...",
      "Reel upload complete!",
      "Failed to finalize upload. Please try again.",
      800
    );
    if (!finished) {
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
  };

  const isAudioAnalysisError =
    extractAudioStatus === "error" || findSimilarityStatus === "error";
  const isAudioAnalysisComplete =
    extractAudioStatus === "success" && findSimilarityStatus === "success";

  const isUploadError =
    uploadToIpfsStatus === "error" ||
    registerIpStatus === "error" ||
    finishingStatus === "error";
  const isUploadComplete =
    uploadToIpfsStatus === "success" &&
    registerIpStatus === "success" &&
    finishingStatus === "success";

  return (
    <div
      className=""
      style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
    >
      <div className="p-8 h-full">
        <div className="h-full border w-full rounded-lg flex">
          {/* Left side - Video preview */}
          <div className="h-full w-2/3 bg-black relative flex items-center justify-center">
            {!selectedFile ? (
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
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="max-w-full max-h-full object-contain rounded-lg aspect-[9/16]"
                  style={{ maxHeight: "calc(100% - 2rem)" }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Right side - Upload form and progress */}
          <div className="h-full w-1/3 border-l rounded-r-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Upload Reel</h2>

            {/* Form section */}
            <div className="space-y-4 mb-6">
              <div className="grid gap-2">
                <Label htmlFor="reel-title">Reel Title</Label>
                <Input
                  id="reel-title"
                  placeholder="Enter your reel's title"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  disabled={isAnalyzing || isUploading}
                />
              </div>

              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  <p>Selected: {selectedFile.name}</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Change File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                className="w-full"
                disabled={
                  !selectedFile || !reelTitle || isAnalyzing || isUploading
                }
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Audio"}
              </Button>
            </div>

            {/* Audio Analysis Progress */}
            {(extractAudioStatus !== "idle" ||
              findSimilarityStatus !== "idle") && (
              <div className="mb-6 space-y-4 border p-3 rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-semibold">Audio Analysis</h3>
                <div className="space-y-3">
                  <Checkpoint
                    title="1. Extract Audio"
                    status={extractAudioStatus}
                    message={extractAudioMessage}
                    progress={extractAudioProgress}
                  />
                  {extractAudioStatus === "success" && (
                    <Checkpoint
                      title="2. Find Similarity"
                      status={findSimilarityStatus}
                      message={findSimilarityMessage}
                      progress={findSimilarityProgress}
                    />
                  )}
                </div>

                {isAudioAnalysisComplete && finalAudioResult && (
                  <div className="mt-4 pt-3 border-t space-y-2">
                    <h4 className="font-semibold">Result:</h4>
                    <p className="text-sm">
                      Similarity:{" "}
                      <span className="font-semibold">
                        {finalAudioResult.similarityScore}%
                      </span>
                    </p>
                    {finalAudioResult.isUnique ? (
                      <p className="text-green-600 font-semibold text-sm">
                        Audio is Unique!
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-yellow-600 font-semibold text-sm">
                          Audio is Derivative
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Similar to:{" "}
                          {finalAudioResult.similarToReelId &&
                          finalAudioResult.similarToReelTitle ? (
                            <Link
                              href={`/reels/${finalAudioResult.similarToReelId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {finalAudioResult.similarToReelTitle}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={handleUploadToBlockchain}
                      className="w-full mt-3"
                      size="sm"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload to Blockchain"}
                    </Button>
                  </div>
                )}

                {isAudioAnalysisError && (
                  <div className="mt-4 pt-3 border-t text-center">
                    <p className="text-red-600 font-semibold text-sm">
                      Analysis failed
                    </p>
                    <Button
                      onClick={() => setIsAnalyzing(false)}
                      className="w-full mt-2"
                      size="sm"
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Blockchain Upload Progress */}
            {(uploadToIpfsStatus !== "idle" ||
              registerIpStatus !== "idle" ||
              finishingStatus !== "idle") && (
              <div className="space-y-4 border p-3 rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="text-lg font-semibold">Blockchain Upload</h3>
                <div className="space-y-3">
                  <Checkpoint
                    title="1. Upload to IPFS"
                    status={uploadToIpfsStatus}
                    message={uploadToIpfsMessage}
                    progress={uploadToIpfsProgress}
                  />
                  {uploadToIpfsStatus === "success" && (
                    <Checkpoint
                      title="2. Register IP"
                      status={registerIpStatus}
                      message={registerIpMessage}
                      progress={registerIpProgress}
                    />
                  )}
                  {registerIpStatus === "success" && (
                    <Checkpoint
                      title="3. Finishing"
                      status={finishingStatus}
                      message={finishingMessage}
                      progress={finishingProgress}
                    />
                  )}
                </div>

                {isUploadComplete && (
                  <div className="mt-4 pt-3 border-t text-center">
                    <p className="text-green-600 font-semibold text-sm">
                      Upload Complete!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reel uploaded to blockchain successfully.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setVideoUrl("");
                        setReelTitle("");
                        resetAnalysisState();
                      }}
                      className="w-full mt-2"
                      size="sm"
                    >
                      Upload Another
                    </Button>
                  </div>
                )}

                {isUploadError && (
                  <div className="mt-4 pt-3 border-t text-center">
                    <p className="text-red-600 font-semibold text-sm">
                      Upload failed
                    </p>
                    <Button
                      onClick={() => {
                        setIsUploading(false);
                        resetUploadState();
                      }}
                      className="w-full mt-2"
                      size="sm"
                    >
                      Reset Upload
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
