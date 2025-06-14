import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  Hex,
  ReadContractReturnType,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi as contractAbi } from "@/data/abi"; // Import your ABI here
import { storyAeneid } from "viem/chains"; // Change to polygonMumbai, sepolia, etc.

export class ReelContract {
  private walletClient;
  private publicClient;
  private contractAddress: Hex;
  private account;

  constructor(contractAddress: string, privateKey: Hex) {
    this.contractAddress = contractAddress as Hex;
    this.account = privateKeyToAccount(privateKey);

    this.walletClient = createWalletClient({
      account: this.account,
      chain: storyAeneid, // Change as needed
      transport: http(),
    });

    this.publicClient = createPublicClient({
      chain: storyAeneid,
      transport: http(),
    });
  }

  async setUserProfile(username: string, profileImage: string) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi: contractAbi,
      functionName: "setUserProfile",
      args: [username, profileImage],
    });
  }

  async uploadReel(
    ipfsHash: string,
    title: string,
    isDerivative: boolean,
    songNames: string[],
    songImages: string[],
    songLinks: string[]
  ) {
    return this.walletClient.writeContract({
      address: this.contractAddress,
      abi: contractAbi,
      functionName: "uploadReel",
      args: [ipfsHash, title, isDerivative, songNames, songImages, songLinks],
    });
  }

  async getAllReels(): Promise<ReadContractReturnType> {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi: contractAbi,
      functionName: "getAllReels",
    });
  }

  async getUserReels(userAddress: Hex): Promise<ReadContractReturnType> {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi: contractAbi,
      functionName: "getUserReels",
      args: [userAddress],
    });
  }

  async getUserProfile(userAddress: Hex): Promise<ReadContractReturnType> {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi: contractAbi,
      functionName: "getUserProfile",
      args: [userAddress],
    });
  }
}
