// import { ethers } from "ethers";
// import { abi as contractAbi } from "@/data/abi"; // Your contract ABI

// export class ReelContract {
//   private contract!: ethers.Contract;

//   constructor(contractAddress: string, signer: ethers.JsonRpcSigner) {
//     this.contract = new ethers.Contract(contractAddress, contractAbi, signer);
//   }

//   async setUserProfile(username: string, profileImage: string) {
//     const tx = await this.contract.setUserProfile(username, profileImage);
//     return tx.wait();
//   }

//   async uploadReel(
//     ipfsHash: string,
//     title: string,
//     isDerivative: boolean,
//     songNames: string[],
//     songImages: string[],
//     songLinks: string[]
//   ) {
//     const tx = await this.contract.uploadReel(
//       ipfsHash,
//       title,
//       isDerivative,
//       songNames,
//       songImages,
//       songLinks
//     );

//     await tx.wait();

//     return tx;
//   }

//   async getAllReels(): Promise<any> {
//     return this.contract.getAllReels();
//   }

//   async getUserReels(userAddress: string): Promise<any> {
//     return this.contract.getUserReels(userAddress);
//   }

//   async getUserProfile(userAddress: string): Promise<any> {
//     return this.contract.getUserProfile(userAddress);
//   }
// }
