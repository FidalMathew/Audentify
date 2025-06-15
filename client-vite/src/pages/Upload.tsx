import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useGlobalContext } from "@/Context/useGlobalContext";
import { mockAudioResult } from "@/data/mockResult";
import { mintAndRegisterIP } from "@/lib/utils";
import { Field, Form, Formik, type FormikProps } from "formik";
import { CheckCircle, Loader2, Upload, XCircle } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Connect from "./Connect";

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
              <span>{message.split("http")[0]} </span>
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
  const { smartContract, wallet } = useGlobalContext();

  const formikRef = useRef<FormikProps<{
    reelTitle: string;
    reelVideo: File | null;
  }> | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDoneWithRegisteringIPStatus, setIsDoneWithRegisteringIPStatus] =
    useState<CheckpointStatus>("idle");

  const [isDoneWithRegisteringIPMessage, setIsDoneWithRegisteringIPMessage] =
    useState<string>("");

  const [isDoneWithRegisteringIPProgress, setIsDoneWithRegisteringIPProgress] =
    useState(0);

  const [
    isDoneWithRegisteringIPasDerivativeStatus,
    setIsDoneWithRegisteringIPasDerivativeStatus,
  ] = useState<CheckpointStatus>("idle");

  const [
    isDoneWithRegisteringIPasDerivativeMessage,
    setIsDoneWithRegisteringIPasDerivativeMessage,
  ] = useState("");

  const [
    isDoneWithRegisteringIPasDerivativeProgress,
    setIsDoneWithRegisteringIPasDerivativeProgress,
  ] = useState(0);

  const [uploadToBlockchainStatus, setUploadToBlockchainStatus] =
    useState(false);

  const [findSimilarityStatus, setFindSimilarityStatus] =
    useState<CheckpointStatus>("idle");
  const [findSimilarityMessage, setFindSimilarityMessage] = useState("");
  const [findSimilarityProgress, setFindSimilarityProgress] = useState(0);

  // IPFS & Registration Checkpoints
  const [uploadToIpfsStatus, setUploadToIpfsStatus] =
    useState<CheckpointStatus>("idle");
  const [uploadToIpfsMessage, setUploadToIpfsMessage] = useState("");
  const [uploadToIpfsProgress, setUploadToIpfsProgress] = useState(0);

  const [blockchainUploadStatus, setBlockchainUploadStatus] =
    useState<CheckpointStatus>("idle");
  const [blockchainUploadMessage, setBlockchainUploadMessage] = useState("");
  const [blockchainUploadProgress, setBlockchainUploadProgress] = useState(0);

  const [audioResult, setAudioResult] = useState<
    | {
        title: string;
        trackId?: string;
        artistName?: string;
        artistId?: string;
        score?: number;
      }[]
    | null
  >(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create video URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      // resetAnalysisState();
    }
  };

  const resetAnalysisState = () => {
    setIsAnalyzing(false);
    setIsUploading(false);
    setFindSimilarityStatus("idle");
    setFindSimilarityMessage("");
    setFindSimilarityProgress(0);
    setIsDoneWithRegisteringIPStatus("idle");
    setIsDoneWithRegisteringIPMessage("");
    setIsDoneWithRegisteringIPProgress(0);
    setIsDoneWithRegisteringIPasDerivativeStatus("idle");
    setIsDoneWithRegisteringIPasDerivativeMessage("");
    setIsDoneWithRegisteringIPasDerivativeProgress(0);
    // resetUploadState();
  };

  const resetUploadState = () => {
    setUploadToIpfsStatus("idle");
    setUploadToIpfsMessage("");
    setUploadToIpfsProgress(0);
    setSelectedFile(null);
    setVideoUrl("");
  };

  const handleIPFSUpload = async (file: File) => {
    try {
      setUploadToIpfsStatus("loading");
      setUploadToIpfsMessage("Loading...");
      let currentProgress = 0;
      // const result = await uploadFileToIPFS(file);
      // Simulate IPFS upload and return a fake hash
      const result = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(
            "bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq"
          );
        }, 1000);
      });
      const interval = setInterval(() => {
        currentProgress += 10;
        setUploadToIpfsProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 1000 / 10);

      clearInterval(interval);

      setUploadToIpfsMessage(
        `Reel uploaded to IPFS successfully. https://ipfs.io/ipfs/${result}`
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
      // const result = await axios.post("http://localhost:8000/identify", {
      //   videoLink: "https://coral-light-cicada-276.mypinata.cloud/ipfs/" + hash,
      //   // videoLink:
      //   //   "https://coral-light-cicada-276.mypinata.cloud/ipfs/bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq",
      // });

      const result = await new Promise<{
        data: {
          similarityScore: number;
          similarToReelTitle?: string;
          similarToReelId?: string;
        };
      }>((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              similarityScore: 0.85,
              similarToReelTitle: "Sample Reel Title",
              similarToReelId: "12345",
            },
          });
        }, 3000);
      });

      const uniqueTitles = new Set<string>();
      const uniqueResults: {
        title: string;
        trackId?: string;
        albumId?: string;
        artistName?: string;
        artistId?: string;
        score?: number;
      }[] = [];

      mockAudioResult.results.forEach((audio) => {
        const music = audio.result.metadata.music[0].external_metadata;
        const title = music?.spotify?.track.name;
        const trackId = music?.spotify?.track.id;
        const artistName = music?.spotify?.artists[0].name;
        const artistId = music?.spotify?.artists[0].id;
        const score = audio.result.metadata.music[0].score;
        if (title && !uniqueTitles.has(title)) {
          uniqueTitles.add(title);
          uniqueResults.push({
            title,
            trackId,
            artistName,
            artistId,
            score,
          });
        }
      });

      setAudioResult(uniqueResults);

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
      setFindSimilarityMessage(
        `Audio analysis complete. Similarity score: ${mockAudioResult.results[0].result.metadata.music[0].score}`
      );
      setFindSimilarityStatus("success");
    } catch (error) {
      setFindSimilarityStatus("error");
      setFindSimilarityMessage("Failed to analyze audio. Please try again.");
      setFindSimilarityProgress(0);
      console.error("Audio analysis error:", error);
    }
  };

  const isSimilarityError =
    uploadToIpfsStatus === "error" || findSimilarityStatus === "error";

  const isSimilarityComplete =
    uploadToIpfsStatus === "success" && findSimilarityStatus === "success";

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

    resetAnalysisState();

    setIsAnalyzing(true);
    try {
      const hash = await handleIPFSUpload(formikRef.current.values.reelVideo!);
      if (!hash) {
        setIsAnalyzing(false);
        return;
      }
      await analyzeAudio(hash);
    } catch (error) {
      console.error("Error during analysis:", error);
    }

    setIsAnalyzing(false);
  };

  const setAsIP = async () => {
    try {
      setIsDoneWithRegisteringIPStatus("loading");
      setIsDoneWithRegisteringIPMessage("Registering IP...");

      let currentProgress = 0;

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
      const interval = setInterval(() => {
        currentProgress += 10;
        setIsDoneWithRegisteringIPProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 1000 / 10);

      clearInterval(interval);
      setIsDoneWithRegisteringIPProgress(100);

      setIsDoneWithRegisteringIPStatus("success");
      setIsDoneWithRegisteringIPMessage(
        "IP registered successfully. Story Link https://aeneid.explorer.story.foundation/ipa/0xd6D3AC2058bE199a9Db411fd300E065cc3D18e85"
      );
    } catch (error) {
      setIsDoneWithRegisteringIPStatus("error");
      setIsDoneWithRegisteringIPMessage("Failed to register IP.");
      setIsDoneWithRegisteringIPProgress(0);
      console.error("IP registration error:", error);
    }
  };

  const setAsIPandDerivative = async () => {
    try {
      setIsDoneWithRegisteringIPasDerivativeStatus("loading");
      setIsDoneWithRegisteringIPasDerivativeMessage(
        "Registering as Derivative IP..."
      );

      let currentProgress = 0;
      setIsDoneWithRegisteringIPasDerivativeProgress(currentProgress);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      });
      // Fill the parameters for registerIPandMakeDerivativeFunc
      // Example: await registerIPandMakeDerivativeFunc(title, artist, trackId, ...);
      // await registerIPandMakeDerivativeFunc(
      //   "0xd2FBBD463E8926C59eA075275259B48F3Fb1639b",
      //   audioResult?.[0]?.artistName || "",
      //   "0x3f93B8DCAf29D8B3202347018E23F76e697D8539"
      //   // Add any other required parameters here
      // );

      const interval = setInterval(() => {
        currentProgress += 10;
        setIsDoneWithRegisteringIPasDerivativeProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 1000 / 10);

      clearInterval(interval);
      setIsDoneWithRegisteringIPasDerivativeProgress(100);

      setIsDoneWithRegisteringIPasDerivativeStatus("success");
      setIsDoneWithRegisteringIPasDerivativeMessage(
        "Derivative IP registered successfully."
      );
    } catch (error) {
      setIsDoneWithRegisteringIPasDerivativeStatus("error");
      setIsDoneWithRegisteringIPasDerivativeMessage(
        "Failed to register as Derivative IP."
      );
      setIsDoneWithRegisteringIPasDerivativeProgress(0);
      console.error("Derivative IP registration error:", error);
    }
  };

  const handleIPRegistrations = async () => {
    try {
      setIsRegistering(true);
      await setAsIPandDerivative();
      await uploadToBlockchain();
      setIsRegistering(false);
    } catch (error) {
      console.error("IP registration error:", error);
    }
  };

  const uploadToBlockchain = async () => {
    try {
      if (!smartContract) return;
      setBlockchainUploadStatus("loading");
      setBlockchainUploadMessage("Uploading to blockchain...");
      let currentProgress = 0;

      // Simulate blockchain upload
      // You need to provide actual values for these arguments
      // Example values are used below; replace them with real data as needed
      // await smartContract.uploadReel(
      //   "bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq", // Replace with actual IPFS hash
      //   formikRef.current?.values.reelTitle || "Untitled", // Reel title
      //   false, // isDerivative (set to true if derivative)
      //   [], // songNames (array of song names)
      //   [], // songImages (array of song image URLs)
      //   [] // songLinks (array of song links)
      // );

      const res = await smartContract.uploadReel(
        "bafybeifixgtek4ooz2qqoam2iitstg3wedsomphuilneh2f7v5wf6xvofq", // ipfsHash (example)
        "RGERGER",
        true, // isDerivative (example: true)
        ["GERGERG"],
        ["GRGGERGR"], // songImages (example)
        ["rgerger"] // songLinks (example)
      );

      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(true);
      //   }, 2000);
      // });

      const interval = setInterval(() => {
        currentProgress += 20;
        setBlockchainUploadProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);

      clearInterval(interval);
      setBlockchainUploadProgress(100);

      setBlockchainUploadStatus("success");
      setBlockchainUploadMessage("Successfully uploaded to blockchain.");
    } catch (error) {
      setBlockchainUploadStatus("error");
      setBlockchainUploadMessage("Failed to upload to blockchain.");
      setBlockchainUploadProgress(0);
      console.error("Blockchain upload error:", error);
    }
  };

  // const handleUploadBlockchain = async () => {
  //   try {
  //     setUploadToBlockchainStatus(true);
  //     await uploadToBlockchain();
  //     setUploadToBlockchainStatus(false);
  //   } catch (error) {
  //     setUploadToBlockchainStatus(false);
  //     setBlockchainUploadStatus("error");
  //     setBlockchainUploadMessage("Failed to upload to blockchain.");
  //     console.error("Blockchain upload error:", error);
  //   }
  // };

  const isRegistrationError =
    isDoneWithRegisteringIPStatus === "error" ||
    isDoneWithRegisteringIPasDerivativeStatus === "error";

  const isRegistrationComplete = isDoneWithRegisteringIPStatus === "success";

  if (!wallet)
    return (
      <div>
        <Connect />
      </div>
    );

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

                      {/* <Button type="submit">Submit</Button>
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
                      </Button> */}

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
                      findSimilarityStatus !== "idle") && (
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
                            {/* {true && true ? (
                              true && (
                                <div className="space-y-3 py-2">
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
                            )} */}

                            {audioResult &&
                              audioResult.map((audio, index) => (
                                <div className="space-y-3 py-2" key={index}>
                                  {audio.score && audio.score > 70 ? (
                                    <p className="text-yellow-600 font-semibold text-sm">
                                      Audio is Derivative
                                    </p>
                                  ) : (
                                    <p className="text-green-600 font-semibold text-sm">
                                      Audio is Unique
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        mintAndRegisterIP(
                                          audio.title,
                                          audio.artistName!,
                                          "https://open.spotify.com/track/3GpbwCm3YxiWDvy29Uo3vP",
                                          "https://i.scdn.co/image/ab67616d00001e0218aa5d7e6d484b832cd5d03f"
                                        )
                                      }
                                    >
                                      Set as an IP
                                    </Button>
                                    {audio && audio.title ? (
                                      <Link
                                        to={`/reels/${audio.trackId}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {audio.title}
                                      </Link>
                                    ) : (
                                      "N/A"
                                    )}
                                  </p>
                                </div>
                              ))}
                            <Button
                              onClick={() => handleIPRegistrations()}
                              className="w-full mt-2"
                              size="sm"
                              type="button"
                            >
                              Set this as IP Derivative
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

                    {isDoneWithRegisteringIPStatus !== "idle" && (
                      <div className="space-y-4 border p-3 rounded-lg bg-card text-card-foreground shadow-sm mt-5">
                        <h3 className="text-lg font-semibold">
                          Register as an IP
                        </h3>
                        <div className="space-y-3 mb-2">
                          <Checkpoint
                            title="1. Register as an IP"
                            status={isDoneWithRegisteringIPStatus}
                            message={isDoneWithRegisteringIPMessage}
                            progress={isDoneWithRegisteringIPProgress}
                          />
                          {isDoneWithRegisteringIPStatus === "success" && (
                            <Checkpoint
                              title="2. Upload to Blockchain"
                              status={blockchainUploadStatus}
                              message={blockchainUploadMessage}
                              progress={blockchainUploadProgress}
                            />
                          )}
                        </div>

                        {/* {isRegistrationComplete && (
                          <div>
                            <Checkpoint
                              title="2. Uploading to Blockchain"
                              status={blockchainUploadStatus}
                              message={blockchainUploadMessage}
                              progress={blockchainUploadProgress}
                            />

                            <Button
                              onClick={() => {
                                resetAnalysisState();
                                resetUploadState();
                              }}
                              className="w-full mt-2"
                              size="sm"
                            >
                              Upload Another
                            </Button>
                          </div>
                        )} */}

                        {isRegistrationError && (
                          <div className="mt-4 pt-3 border-t text-center">
                            <p className="text-red-600 font-semibold text-sm">
                              Registration failed
                            </p>

                            <Button
                              onClick={() => {
                                setIsUploading(false);
                                resetUploadState();
                              }}
                              className="w-full mt-2"
                              size="sm"
                            >
                              Reset
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {isDoneWithRegisteringIPasDerivativeStatus !== "idle" && (
                      <div className="space-y-4 border p-3 rounded-lg bg-card text-card-foreground shadow-sm mt-5">
                        <h3 className="text-lg font-semibold">
                          Register as an IP
                        </h3>
                        <div className="space-y-3 mb-2">
                          <Checkpoint
                            title="1. Register as an IP"
                            status={isDoneWithRegisteringIPasDerivativeStatus}
                            message={isDoneWithRegisteringIPasDerivativeMessage}
                            progress={
                              isDoneWithRegisteringIPasDerivativeProgress
                            }
                          />
                          {isDoneWithRegisteringIPasDerivativeStatus ===
                            "success" && (
                            <Checkpoint
                              title="2. Upload to Blockchain"
                              status={blockchainUploadStatus}
                              message={blockchainUploadMessage}
                              progress={blockchainUploadProgress}
                            />
                          )}
                        </div>

                        {isRegistrationError && (
                          <div className="mt-4 pt-3 border-t text-center">
                            <p className="text-red-600 font-semibold text-sm">
                              Registration failed
                            </p>

                            <Button
                              onClick={() => {
                                setIsUploading(false);
                                resetUploadState();
                              }}
                              className="w-full mt-2"
                              size="sm"
                            >
                              Reset
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
