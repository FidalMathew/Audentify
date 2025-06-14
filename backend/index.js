const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const { existsSync, mkdirSync, readdirSync, rmSync } = fs;

dotenv.config(); // Load .env variables
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const ACR_OPTIONS = {
  host: process.env.ACR_HOST,
  endpoint: process.env.ACR_ENDPOINT,
  signature_version: process.env.ACR_SIGNATURE_VERSION,
  data_type: process.env.ACR_DATA_TYPE,
  secure: process.env.ACR_SECURE === "true",
  access_key: process.env.ACR_ACCESS_KEY,
  access_secret: process.env.ACR_ACCESS_SECRET,
};

function buildStringToSign(
  method,
  uri,
  accessKey,
  dataType,
  signatureVersion,
  timestamp
) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
    "\n"
  );
}

function sign(signString, accessSecret) {
  return crypto
    .createHmac("sha1", accessSecret)
    .update(Buffer.from(signString, "utf-8"))
    .digest()
    .toString("base64");
}

async function identifyChunk(chunkPath) {
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

function convertVideoStreamToAudio(videoUrl, audioOutputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .outputOptions("-vn")
      .toFormat("mp3")
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(audioOutputPath);
  });
}

function splitAudio(inputPath, outputDir, chunkDuration = 10) {
  return new Promise((resolve, reject) => {
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    const outputPattern = path.join(outputDir, "chunk_%03d.mp3");

    ffmpeg(inputPath)
      .outputOptions([
        "-f segment",
        `-segment_time ${chunkDuration}`,
        "-c copy",
      ])
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

app.post("/identify", async (req, res) => {
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

    await convertVideoStreamToAudio(videoLink, audioPath);
    const chunks = await splitAudio(audioPath, chunkDir, 10);

    const results = [];

    for (const chunkPath of chunks) {
      try {
        const result = await identifyChunk(chunkPath);
        results.push({ file: path.basename(chunkPath), result });
      } catch (err) {
        results.push({ file: path.basename(chunkPath), error: err.message });
      }
    }

    rmSync(tempDir, { recursive: true, force: true });

    res.status(200).json({ message: "Processed successfully", results });
  } catch (err) {
    console.error("Error:", err);
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Audentify Audio Identification API!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
