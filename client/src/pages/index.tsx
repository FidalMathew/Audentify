import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadFileToIPFS } from "../../story-typescript-tutorial/utils/functions/uploadToIpfs";
import { createSpgNftCollection } from "../../story-typescript-tutorial/utils/functions/createSpgNftCollection";
import { mintNFT } from "../../story-typescript-tutorial/utils/functions/mintNFT";
import { useWalletContext } from "@/contexts/useWalletContext";
import { Hex, Address } from "viem";
import { registerIP } from "../../story-typescript-tutorial/scripts/registration/register";
import { registerIPandMakeDerivative } from "../../story-typescript-tutorial/scripts/derivative/registerDerivativeCommercial";
import axios from "axios";
import {
  createIpMetadata,
  IpMetadataResponse,
} from "../../story-typescript-tutorial/utils/createIpMetadata";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [collectionAddress, setCollectionAddress] = useState<string | null>(
    null
  );
  const { walletAddress } = useWalletContext();

  // Mock function to upload to IPFS
  const uploadToIPFS = async (file: File) => {
    setStatus("Uploading to IPFS...");
    const res = await uploadFileToIPFS(file);
    setStatus("Uploaded to IPFS!");
    const uri = `https://ipfs.io/ipfs/${res}`;
    return uri; // Return the IPFS URL
  };

  // // Mock function 2
  // const mintNFTfunc = async (ipfsHash: string) => {
  //   setStatus("Processing video...");
  //   const uri = `https://ipfs.io/ipfs/${ipfsHash}`;
  //   // await mintNFT(ipfsHash);
  //   const tokenId = await mintNFT(walletAddress! as Hex, uri);
  //   setVideoUrl(`https://ipfs.io/ipfs/${ipfsHash}`);
  //   setStatus("NFT minted successfully!");
  //   return uri;
  // };

  // Mock function 3
  const mintAndRegisterIP = async (videoUri: string) => {
    if (!videoUri) return;
    setStatus("Finalizing upload...");
    const storyUrl = await registerIP(
      "My Video IP",
      "This is a video IP asset.",
      new Date().toISOString(),
      [
        {
          name: "Creator Name",
          address: walletAddress!,
          contributionPercent: 100,
        },
      ],
      videoUri, // videoUrl as the assetUrl
      "", // imageHash (provide actual hash if available)
      "Video", // category (example value)
      "video", // mediaType (added argument)
      "video/mp4"
    );
    setStatus(`NFT Minted and IP Registerd with ${storyUrl}`);
  };

  const registerIPandMakeDerivativeFunc = async (parentIpId: Address) => {
    if (!parentIpId) {
      setStatus("Parent IP ID is required.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_STORY_API_KEY) {
      setStatus("API key is not set.");
      return;
    }
    const {
      data: { data: parentLicenseTermId },
    } = await axios.get(
      `https://api.storyapis.com/api/v3/licenses/ip/terms/${parentIpId}`,
      {
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_STORY_API_KEY,
          "X-Chain": "story-aeneid",
        },
      }
    );

    const ipmetadata: IpMetadataResponse = await createIpMetadata(
      "My Video IP",
      "This is a video IP asset.",
      new Date().toISOString(),
      [
        {
          name: "Creator Name",
          address: walletAddress!,
          contributionPercent: 100,
        },
      ],

      "https://ipfs.io/ipfs/bafkreicqtmtckbnyxdgrsmzzl7px6tltnyrg7py3yr57ncjsow5pcaifsa", // Provide actual image URL if available
      "bafkreicqtmtckbnyxdgrsmzzl7px6tltnyrg7py3yr57ncjsow5pcaifsa", // Provide actual image hash if available
      videoUrl || "", // Use the video URL
      "", // Provide actual media hash if available
      "image/jpeg" // Specify the media type
    );

    setStatus(`Registering derivative of ${parentIpId}`);

    console.log("Parent License Term ID:", parentLicenseTermId);

    const derivativeUrl = await registerIPandMakeDerivative(
      parentIpId,
      parentLicenseTermId[0].licenseTermsId,
      ipmetadata
    );

    setStatus(`Derivative Registered: ${derivativeUrl}`);
    console.log("Derivative URL:", derivativeUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setStatus("Please select a video file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoUrl(url);
      setStatus("");
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    // Check video duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(videoFile);
    video.onloadedmetadata = async () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > 60) {
        setStatus("Video must be under 1 minute.");
        return;
      }
      // Sequential execution
      const ipfsUri = await uploadToIPFS(videoFile);
      await mintAndRegisterIP(ipfsUri);
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button onClick={() => inputRef.current?.click()}>Select Video</Button>
      {videoUrl && (
        <video src={videoUrl} controls width={320} className="rounded shadow" />
      )}

      <div>
        {videoUrl && (
          <div className="mt-2 text-sm text-gray-700">
            IPFS Hash: {videoUrl}
          </div>
        )}
      </div>
      <Button onClick={handleUpload} disabled={!videoFile} className="mt-2">
        Upload to IPFS
      </Button>
      {status && <div className="mt-2 text-sm text-gray-700">{status}</div>}

      <Button
        onClick={() =>
          registerIPandMakeDerivativeFunc(
            "0xd6D3AC2058bE199a9Db411fd300E065cc3D18e85"
          )
        }
      >
        Register Derivative
      </Button>
    </div>
  );
}
