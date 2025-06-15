import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Address, Hex } from "viem";
import axios from "axios";
import {
  createIpMetadata,
  type IpMetadataResponse,
} from "../../story-typescript-tutorial/utils/createIpMetadata";
import { registerIP } from "../../story-typescript-tutorial/scripts/registration/register";
import { registerIPandMakeDerivative } from "../../story-typescript-tutorial/scripts/derivative/registerDerivativeCommercial";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mintAndRegisterIP = async (
  title: string,
  artistName: string,
  spotifyLink: string,
  photoLink: string
) => {
  if (!spotifyLink) return;
  const storyUrl = await registerIP(
    title,
    title,
    new Date().toISOString(),
    [
      {
        name: artistName,
        address: "0x3f93B8DCAf29D8B3202347018E23F76e697D8539" as Hex,
        contributionPercent: 100,
      },
    ],
    spotifyLink, // videoUrl as the assetUrl
    photoLink, // imageHash (provide actual hash if available)
    "Video", // category (example value)
    "video", // mediaType (added argument)
    "video/mp4"
  );

  console.log("Minted and Registered IP:", storyUrl);

  return storyUrl;
};

export const registerIPandMakeDerivativeFunc = async (
  parentIpId: Address,

  creatorName: string,
  creatorAddress: string
) => {
  if (!parentIpId) {
    return;
  }

  if (!import.meta.env.VITE_STORY_API_KEY) {
    return;
  }
  const {
    data: { data: parentLicenseTermId },
  } = await axios.get(
    `https://api.storyapis.com/api/v3/licenses/ip/terms/${parentIpId}`,
    {
      headers: {
        "X-Api-Key": import.meta.env.VITE_STORY_API_KEY!,
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
        name: creatorName,
        address: creatorAddress!,
        contributionPercent: 100,
      },
    ],

    "https://i.scdn.co/image/ab67616d0000b27318aa5d7e6d484b832cd5d03f", // Provide actual image URL if available
    "ab67616d0000b27318aa5d7e6d484b832cd5d03f", // Provide actual image hash if available
    "https://open.spotify.com/track/3GpbwCm3YxiWDvy29Uo3vP", // Use the video URL
    "3GpbwCm3YxiWDvy29Uo3vP", // Provide actual media hash if available
    "audio/mp3" // Specify the media type
  );

  console.log("Parent License Term ID:", parentLicenseTermId);

  const derivativeUrl = await registerIPandMakeDerivative(
    parentIpId,
    parentLicenseTermId[0].licenseTermsId,
    ipmetadata
  );

  // setStatus(`Derivative Registered: ${derivativeUrl}`);
  console.log("Derivative URL:", derivativeUrl);
};
