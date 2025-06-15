// import { ReelContract } from "@/lib/ReelContract";
import { abi as contractAbi } from "@/data/abi"; // Your contract ABI
import { ethers } from "ethers";

import { createContext, useEffect, useState, type ReactNode } from "react";
type GlobalContextType = {
  smartContract: any;
  wallet: any;
  setWallet: (address: string | null) => void;
};
export const GlobalContext = createContext<GlobalContextType>({
  smartContract: null,
  wallet: null,
  setWallet: () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [smartContract, setSmartContract] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    console.log("use connext working");
    // console.log(WalletList, "WalletList in global context");
    // This effect runs once when the component mounts
    console.log("Performing action in useEffect");
  }, []);

  useEffect(() => {
    console.log(wallet, "wallet in global context");

    if (wallet == undefined || wallet == null) {
      setSmartContract(null);
      return;
    }

    const getAllReels = async (smartContractObj: any) => {
      try {
        const reels = await smartContractObj.getAllReels();
        console.log("All Reels:", reels);
      } catch (error) {
        console.error("Error fetching reels:", error);
      }
    };

    const setContract = async () => {
      try {
        const contractAddress = "0xFc1E0f63aF947254834610510932C7C0d295405F";
        const walletProvider = wallet.provider;
        const provider = new ethers.BrowserProvider(walletProvider);
        // //     // provider.send('personal_sign', ["0x313233", fromAccount]);
        // //     console.log("Wallet connected:", currentWallet);
        // //     // console.log("Provider:", provider);
        const signer = await provider.getSigner();

        const smartContractObj = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        setSmartContract(smartContractObj);
        console.log("Smart Contract:", smartContractObj);

        getAllReels(smartContractObj);
      } catch (error) {
        console.error("Error setting contract:", error);
        setSmartContract(null);
      }
    };

    setContract();
  }, [wallet]);

  return (
    <GlobalContext.Provider
      value={{
        smartContract,
        wallet,
        setWallet,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
