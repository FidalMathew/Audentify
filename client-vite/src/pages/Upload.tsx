import { uploadFileToIPFS } from "@/../story-typescript-tutorial/utils/functions/uploadToIpfs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { AudioInfo } from "@/data/mock-data";
import axios from "axios";
import { Field, Form, Formik, type FormikProps } from "formik";
import { CheckCircle, Loader2, Upload, XCircle } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

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
        <p className="text-sm text-muted-foreground">
          {message && message.match(/https?:\/\/[^\s]+/) ? (
            <div className="">
              <span>Reel Uploaded to IPFS: </span>
              <Link
                to={message.match(/https?:\/\/[^\s]+/)![0]}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click Here
              </Link>
            </div>
          ) : (
            message
          )}
        </p>
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

  const formikRef = useRef<FormikProps<{
    reelTitle: string;
    reelVideo: File | null;
  }> | null>(null);

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
    if (!formikRef) {
      return;
    }

    if (!formikRef.current) {
      return;
    }
    if (
      (formikRef.current && !formikRef.current.values.reelVideo) ||
      (formikRef.current && !formikRef.current.values.reelTitle)
    ) {
      // alert("Please select a video file and enter a title.");
      return;
    }

    resetUploadState();

    setIsAnalyzing(true);
    try {
      const hash = await handleIPFSUpload(formikRef.current.values.reelVideo!);
      if (!hash) {
        setIsAnalyzing(false);
        return;
      }
      setUploadToIpfsStatus("success");
      await analyzeAudio(hash);
    } catch (error) {
      console.error("Error during analysis:", error);
      setExtractAudioStatus("error");
    }

    setIsAnalyzing(false);
  };

  const handleIPFSUpload = async (file: File) => {
    try {
      setUploadToIpfsStatus("loading");
      setUploadToIpfsMessage("Loading...");
      let currentProgress = 0;
      const result = await uploadFileToIPFS(file);
      const interval = setInterval(() => {
        currentProgress += 10;
        setUploadToIpfsProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 1000 / 10);

      clearInterval(interval);

      setUploadToIpfsMessage(
        `Reel uploaded to IPFS successfully https://ipfs.io/ipfs/${result}`
      );
      setUploadToIpfsStatus("success");
      setUploadToIpfsProgress(100);

      return result;
    } catch (error) {
      // Optionally handle error here
      setUploadToIpfsStatus("error");
      setUploadToIpfsMessage("Failed to upload to IPFS. Please try again.");
      setUploadToIpfsProgress(0);
      console.error("IPFS upload error:", error);
    }
  };

  const analyzeAudio = async (hash: string) => {
    try {
      setFindSimilarityMessage("Analyzing audio for similarity...");
      setFindSimilarityStatus("loading");
      // integrate

      // cout<<
      const result = await axios.post("http://localhost:8000/identify", {
        videoLink: "https://coral-light-cicada-276.mypinata.cloud/ipfs/" + hash,
        // videoLink:
        //   "https://coral-light-cicada-276.mypinata.cloud/ipfs/bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq",
      });

      console.log("Audio analysis result:", result.data);
      // await new Promise((resolve) =>
      //   setTimeout(() => {
      //     resolve(true);
      //   }, 3000)
      // );

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setFindSimilarityProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 1000 / 10);

      clearInterval(interval);

      setFindSimilarityProgress(100);
      setFindSimilarityMessage(`Audio analysis complete. Similarity score:`);
      setFindSimilarityStatus("success");
    } catch (error) {
      setFindSimilarityStatus("error");
      setFindSimilarityMessage("Failed to analyze audio. Please try again.");
      setFindSimilarityProgress(0);
      console.error("Audio analysis error:", error);
    }
  };

  const isAudioAnalysisError =
    extractAudioStatus === "error" || findSimilarityStatus === "error";
  const isAudioAnalysisComplete =
    extractAudioStatus === "success" && findSimilarityStatus === "success";

  const isSimilarityError =
    uploadToIpfsStatus === "error" || findSimilarityStatus === "error";

  const isSimilarityComplete =
    uploadToIpfsStatus === "success" && findSimilarityStatus === "success";

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
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFileSelect(e);
                    if (formikRef.current) {
                      formikRef.current.setFieldValue(
                        "reelVideo",
                        fileInputRef.current?.files?.[0] || null
                      );
                    }
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <video
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

          <Formik
            initialValues={{ reelTitle: "", reelVideo: null as File | null }}
            onSubmit={(value, _) => console.log(value)}
            validateOnChange={false}
          >
            {(formik) => {
              formikRef.current = formik;
              console.log("hi");
              return (
                <Form className="h-full w-1/3 border-l rounded-r-lg p-4 overflow-y-auto">
                  <div className="h-full w-full">
                    <h2 className="text-xl font-semibold mb-4">Upload Reel</h2>

                    {/* Form section */}
                    <div className="space-y-4 mb-6">
                      <div className="grid gap-2">
                        <Label htmlFor="reel-title">Reel Title</Label>
                        <Field
                          as={Input}
                          id="reel-title"
                          placeholder="Enter your reel's title"
                          value={formik.values.reelTitle}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            formikRef.current?.setFieldValue(
                              "reelTitle",
                              e.target.value,
                              false
                            );
                            formik.setFieldValue(
                              "reelTitle",
                              e.target.value,
                              false
                            );
                          }}
                          disabled={isAnalyzing || isUploading}
                        />
                      </div>

                      {selectedFile && (
                        <div className="text-sm text-muted-foreground">
                          <p>Selected: {selectedFile.name}</p>
                          <Button
                            type="button"
                            onClick={() => {
                              fileInputRef.current?.click();
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            Change File
                          </Button>
                          <input
                            name="videoFile"
                            type="file"
                            ref={fileInputRef}
                            accept="video/*"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              console.log(e.currentTarget.files, "files");
                              handleFileSelect(e);
                              formikRef.current?.setFieldValue(
                                "reelVideo",
                                e.currentTarget.files?.[0] || null
                              );
                              formik.setFieldValue(
                                "reelVideo",
                                e.currentTarget.files?.[0] || null
                              );
                            }}
                            className="hidden"
                          />
                        </div>
                      )}

                      <Button type="submit">Submit</Button>
                      <Button
                        type="button"
                        onClick={() =>
                          analyzeAudio(
                            "bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq"
                          )
                        }
                      >
                        audio analysic
                      </Button>
                      <Button
                        onClick={async () => {
                          if (formik.values.reelVideo) {
                            console.log(
                              // await handleIPFSUpload(formik.values.reelVideo)
                              await handleAnalyze()
                            );
                          }
                        }}
                        type="button"
                      >
                        Upload to IPFS
                      </Button>

                      <Button
                        onClick={handleAnalyze}
                        className="w-full"
                        type="button"
                        disabled={
                          !formik.values.reelVideo ||
                          !formik.values.reelTitle ||
                          isAnalyzing ||
                          isUploading
                        }
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Audio"}
                      </Button>
                    </div>

                    {/* Blockchain Upload Progress */}
                    {(uploadToIpfsStatus !== "idle" ||
                      findSimilarityStatus !== "idle" ||
                      finishingStatus !== "idle") && (
                      <div className="space-y-4 border p-3 rounded-lg bg-card text-card-foreground shadow-sm">
                        <h3 className="text-lg font-semibold">
                          Audio Analysis
                        </h3>
                        <div className="space-y-3 mb-2">
                          <Checkpoint
                            title="1. Upload to IPFS"
                            status={uploadToIpfsStatus}
                            message={uploadToIpfsMessage}
                            progress={uploadToIpfsProgress}
                          />
                          {uploadToIpfsStatus === "success" && (
                            <Checkpoint
                              title="2. Find Similarity"
                              status={findSimilarityStatus}
                              message={findSimilarityMessage}
                              progress={findSimilarityProgress}
                            />
                          )}
                          {/* {registerIpStatus === "success" && (
                            <Checkpoint
                              title="3. Finishing"
                              status={finishingStatus}
                              message={finishingMessage}
                              progress={finishingProgress}
                            />
                          )} */}
                        </div>

                        {isSimilarityComplete && (
                          <div className="mt-4 pt-3 border-t text-center">
                            <p className="text-green-600 font-semibold text-sm">
                              Upload Complete!
                            </p>
                            {true && true ? (
                              true && (
                                <div className="space-y-1">
                                  <p className="text-yellow-600 font-semibold text-sm">
                                    Audio is Derivative
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Similar to:{" "}
                                    {true &&
                                    "finalAudioResult.similarToReelTitle" ? (
                                      <Link
                                        to={`/reels/${"finalAudioResult.similarToReelId"}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {"finalAudioResult.similarToReelTitle"}
                                      </Link>
                                    ) : (
                                      "N/A"
                                    )}
                                  </p>
                                </div>
                              )
                            ) : (
                              <p></p>
                            )}

                            <Button
                              onClick={() => {}}
                              className="w-full mt-2"
                              size="sm"
                            >
                              Set this as IP
                            </Button>
                          </div>
                        )}

                        {isSimilarityError && (
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
                </Form>
              );
            }}
          </Formik>
          {/* Right side - Upload form and progress */}
        </div>
      </div>
    </div>
  );
}
