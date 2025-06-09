import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2, Music, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { AudioInfo } from "@/data/mock-data";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: () => Promise<AudioInfo>;
}

type AnalysisStep = "idle" | "extracting" | "comparing" | "completed" | "error";

export function AnalysisModal({
  isOpen,
  onClose,
  onAnalyze,
}: AnalysisModalProps) {
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [progress, setProgress] = useState(0);
  const [audioResult, setAudioResult] = useState<AudioInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("extracting");
      setProgress(0);
      setAudioResult(null);
      const simulateAnalysis = async () => {
        // Step 1: Audio Extraction
        let currentProgress = 0;
        const extractionInterval = setInterval(() => {
          currentProgress += 10;
          setProgress(currentProgress);
          if (currentProgress >= 40) {
            clearInterval(extractionInterval);
            setStep("comparing");
            currentProgress = 40; // Start comparison from 40%
          }
        }, 300);

        // Step 2: Audio Comparison
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate extraction time
        const comparisonInterval = setInterval(() => {
          currentProgress += 10;
          setProgress(currentProgress);
          if (currentProgress >= 100) {
            clearInterval(comparisonInterval);
            setStep("completed");
          }
        }, 200);

        // Get actual result after simulation
        try {
          const result = await onAnalyze();
          setAudioResult(result);
        } catch (error) {
          console.error("Analysis failed:", error);
          setStep("error");
        }
      };
      simulateAnalysis();
    }
  }, [isOpen, onAnalyze]);

  const getTitle = () => {
    switch (step) {
      case "extracting":
        return "Extracting Audio...";
      case "comparing":
        return "Comparing Audio...";
      case "completed":
        return "Analysis Complete!";
      case "error":
        return "Analysis Failed";
      default:
        return "Analyzing Reel...";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "extracting":
        return "Please wait while we extract the audio from your reel.";
      case "comparing":
        return "Comparing your reel's audio with our database to find matches.";
      case "completed":
        return "Your reel's audio has been analyzed.";
      case "error":
        return "There was an error during analysis. Please try again.";
      default:
        return "Preparing for analysis...";
    }
  };

  const getIcon = () => {
    switch (step) {
      case "extracting":
        return <Music className="h-10 w-10 text-blue-500 animate-pulse" />;
      case "comparing":
        return (
          <GitCompare className="h-10 w-10 text-purple-500 animate-spin" />
        );
      case "completed":
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case "error":
        return <XCircle className="h-10 w-10 text-red-500" />;
      default:
        return <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">{getIcon()}</div>
          <DialogTitle className="text-2xl font-bold">{getTitle()}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        {step !== "completed" && step !== "error" && (
          <div className="w-full">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground mt-2">
              {progress}%
            </p>
          </div>
        )}

        {step === "completed" && audioResult && (
          <div className="mt-4 text-center space-y-4">
            {audioResult.isUnique ? (
              <>
                <p className="text-lg font-semibold text-green-600">
                  Your audio is unique!
                </p>
                <p className="text-sm text-muted-foreground">
                  Similarity score: {audioResult.similarityScore || 0}% (no
                  significant matches found).
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-yellow-600">
                  Audio is a derivative.
                </p>
                <p className="text-sm">
                  It is {audioResult.similarityScore}% similar to:
                </p>
                {audioResult.similarToReelId &&
                  audioResult.similarToReelTitle && (
                    <Button variant="link" className="p-0 h-auto text-base">
                      <Link
                        href={`/reels/${audioResult.similarToReelId}`}
                        onClick={onClose}
                      >
                        {audioResult.similarToReelTitle}
                      </Link>
                    </Button>
                  )}
              </>
            )}
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="mt-4 text-center">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
