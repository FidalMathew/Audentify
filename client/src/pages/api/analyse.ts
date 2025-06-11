import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import axios from "axios";
import crypto from "crypto";
import ffmpeg from "fluent-ffmpeg";
import FormData from "form-data";
import fs, { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

type Data = {
  message: string;
  results?: any[];
};

const ACR_OPTIONS = {
  host: process.env.ACR_HOST,
  endpoint: process.env.ACR_ENDPOINT,
  signature_version: process.env.ACR_SIGNATURE_VERSION,
  data_type: process.env.ACR_DATA_TYPE,
  secure: process.env.ACR_SECURE === 'true',
  access_key: process.env.ACR_ACCESS_KEY,
  access_secret: process.env.ACR_ACCESS_SECRET,
};



function buildStringToSign(
  method: string,
  uri: string,
  accessKey: string,
  dataType: string,
  signatureVersion: string,
  timestamp: number
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join("\n");
}

function sign(signString: string, accessSecret: string) {
  return crypto
    .createHmac("sha1", accessSecret)
    .update(Buffer.from(signString, "utf-8"))
    .digest()
    .toString("base64");
}

async function identifyChunk(chunkPath: string): Promise<any> {
  const data = fs.readFileSync(chunkPath);
  const timestamp = Math.floor(Date.now() / 1000);

  if (
    !ACR_OPTIONS.endpoint ||
    !ACR_OPTIONS.access_key ||
    !ACR_OPTIONS.data_type ||
    !ACR_OPTIONS.signature_version ||
    !ACR_OPTIONS.access_secret
  ) {
    throw new Error("Missing required ACRCloud configuration.");
  }

  const stringToSign = buildStringToSign(
    "POST",
    ACR_OPTIONS.endpoint,
    ACR_OPTIONS.access_key,
    ACR_OPTIONS.data_type,
    ACR_OPTIONS.signature_version,
    timestamp
  );
  const signature = sign(stringToSign, ACR_OPTIONS.access_secret);

  const form = new FormData();
  form.append("sample", data, {
    filename: "sample.mp3",
    contentType: "application/octet-stream",
  });
  form.append("sample_bytes", data.length.toString());
  form.append("access_key", ACR_OPTIONS.access_key);
  form.append("data_type", ACR_OPTIONS.data_type);
  form.append("signature_version", ACR_OPTIONS.signature_version);
  form.append("signature", signature);
  form.append("timestamp", timestamp.toString());

  const response = await axios.post(
    `http://${ACR_OPTIONS.host}${ACR_OPTIONS.endpoint}`,
    form,
    { headers: form.getHeaders() }
  );

  return response.data;
}

function convertVideoStreamToAudio(videoUrl: string, audioOutputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .outputOptions("-vn")
      .toFormat("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(audioOutputPath);
  });
}

function splitAudio(inputPath: string, outputDir: string, chunkDuration = 10): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    const outputPattern = path.join(outputDir, "chunk_%03d.mp3");

    ffmpeg(inputPath)
      .outputOptions(["-f segment", `-segment_time ${chunkDuration}`, "-c copy"])
      .output(outputPattern)
      .on("end", () => {
        const files = readdirSync(outputDir)
          .filter((file) => file.endsWith(".mp3"))
          .map((file) => path.join(outputDir, file));
        resolve(files);
      })
      .on("error", (err) => reject(err))
      .run();
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { videoLink } = req.body;

  if (!videoLink || typeof videoLink !== "string") {
    return res.status(400).json({ message: "Missing or invalid videoLink" });
  }

  const timestamp = Date.now();
  const tempDir = path.join(process.cwd(), "temp", timestamp.toString());
  const audioPath = path.join(tempDir, "audio.mp3");
  const chunkDir = path.join(tempDir, "chunks");

  try {
    mkdirSync(tempDir, { recursive: true });

    // Step 1: Convert video URL to audio
    await convertVideoStreamToAudio(videoLink, audioPath);

    // Step 2: Split audio into 10s chunks
    const chunks = await splitAudio(audioPath, chunkDir, 10);

    // Step 3: Send each chunk to ACRCloud
    const results = [];

    for (const chunkPath of chunks) {
      try {
        const result = await identifyChunk(chunkPath);
        results.push({ file: path.basename(chunkPath), result });
      } catch (err: any) {
        results.push({ file: path.basename(chunkPath), error: err.message });
      }
    }

    // Step 4: Cleanup
    rmSync(tempDir, { recursive: true, force: true });

    return res.status(200).json({
      message: "Processed successfully via stream",
      results,
    });
  } catch (err: any) {
    console.error("Processing error:", err);
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
    return res.status(500).json({ message: "Internal server error" });
  }
}
