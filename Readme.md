# 🎵 Audentify

**Audentify** is a platform that empowers **music artists** by giving them rightful recognition when their music is used in others' creative content. In traditional content-sharing platforms, creators often include background music from artists to enhance their videos, but the original music creators receive no credit or acknowledgment. **Audentify** changes that.

## 🌟 Features

- 🔍 **Music Recognition in Videos**
  Automatically extracts and analyzes music from uploaded videos.

- 🧠 **Chunk-Based Audio Analysis**
  Videos are converted to audio and divided into chunks to detect multiple songs used.

- 🪪 **Creator Acknowledgment via Story Protocol**
  Detected music is linked to its original NFT using [Story Protocol](https://www.storyprotocol.xyz/), establishing a derivative relationship.

- 🔐 **Web3 Authentication with Tomo**
  Seamless login experience using [Tomo](https://www.tomo.xyz/), a Web3 authentication and identity layer.

- 💡 **Transparency and Attribution**
  Artists gain visibility as their music is used across various creative works, preserving attribution on-chain.

---

## 🔧 Tech Stack

| Layer      | Tech Used                       |
| ---------- | ------------------------------- |
| Frontend   | React.js                        |
| Backend    | Node.js, Express                |
| Auth       | Tomo Web3 Login                 |
| Audio      | FFmpeg, Custom Audio Analyzer   |
| Blockchain | Story Protocol                  |
| Storage    | IPFS (via Lighthouse or Pinata) |

---

## 🚀 How It Works

1. **Upload Video**
   Users upload a video via the frontend interface.

2. **Audio Extraction**
   Backend processes the video and extracts the audio using FFmpeg.

3. **Chunking and Detection**
   The audio is divided into chunks and analyzed to detect embedded music tracks.

4. **NFT Derivative Linkage**
   If a song is found to be an existing NFT, we use Story Protocol to set the video as a **derivative work** of that music.

5. **User Login and Ownership**
   All actions are authenticated using Tomo, ensuring secure and seamless Web3 access.
