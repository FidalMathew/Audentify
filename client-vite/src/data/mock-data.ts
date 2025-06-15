export type AudioInfo = {
  isUnique: boolean;
  similarityScore?: number; // 0-100
  similarToReelId?: string;
  similarToReelTitle?: string;
};

export type Reel = {
  id: string;
  userId: string;
  username: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioInfo: AudioInfo;
  views: number;
  uploadDate: string;
};

export type User = {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string;
};

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "reelmaster",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Sharing daily doses of creativity!",
  },
  {
    id: "user-2",
    username: "videovibes",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Short films, big dreams.",
  },
  {
    id: "user-3",
    username: "soundseeker",
    avatarUrl: "/placeholder.svg?height=100&width=100",
    bio: "Exploring unique sounds in every reel.",
  },
];

export const mockReels: Reel[] = [
  {
    id: "reel-1",
    userId: "user-1",
    username: "reelmaster",
    title: "Morning Coffee Vibes",
    videoUrl:
      "https://lavender-intensive-mouse-745.mypinata.cloud/ipfs/bafybeigjp53wh64gqsro4s5wtxm7ngmeysbdqfck6mnv7kuqowr3wwn7su?pinataGatewayToken=nkOSKCiaIeIjvbxCbIisrfCZLj9O4kVEr3q1UVn5qO9Wx6UP7MegEpXfSzc_8MpH",
    thumbnailUrl: "",
    audioInfo: {
      isUnique: true,
    },
    views: 12345,
    uploadDate: "2024-05-20",
  },
  {
    id: "reel-2",
    userId: "user-2",
    username: "videovibes",
    title: "Sunset Beach Walk",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "",
    audioInfo: {
      isUnique: false,
      similarityScore: 85,
      similarToReelId: "reel-1",
      similarToReelTitle: "Morning Coffee Vibes",
    },
    views: 8765,
    uploadDate: "2024-05-18",
  },
  {
    id: "reel-3",
    userId: "user-1",
    username: "reelmaster",
    title: "City Lights at Night",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "",
    audioInfo: {
      isUnique: true,
    },
    views: 23456,
    uploadDate: "2024-05-15",
  },
  {
    id: "reel-4",
    userId: "user-3",
    username: "soundseeker",
    title: "Rainy Day Study Session",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "",
    audioInfo: {
      isUnique: false,
      similarityScore: 92,
      similarToReelId: "reel-3",
      similarToReelTitle: "City Lights at Night",
    },
    views: 5432,
    uploadDate: "2024-05-10",
  },
  {
    id: "reel-5",
    userId: "user-2",
    username: "videovibes",
    title: "Cooking Adventures",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "",
    audioInfo: {
      isUnique: true,
    },
    views: 15000,
    uploadDate: "2024-05-05",
  },
];
