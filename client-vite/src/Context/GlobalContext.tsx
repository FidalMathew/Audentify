import { ReelContract } from "@/lib/ReelContract";
import { createContext, useEffect, type ReactNode } from "react";
import { Onboard } from "@tomo-inc/tomo-evm-kit";
// import { ethers } from "ethers";
import { storyAeneid } from "viem/chains";
import { ethers } from "ethers";
import { useState } from "react";
import { abi as contractAbi } from "@/data/abi"; // Your contract ABI

type GlobalContextType = {
  smartContract: ReelContract | null;
};

export const GlobalContext = createContext<GlobalContextType>({
  smartContract: new ReelContract(
    "",
    // @ts-ignore
    `0x${import.meta.env.VITE_WALLET_PRIVATE_KEY!}`
  ),
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [smartContract, setSmartContract] = useState<ReelContract | null>(null);
  useEffect(() => {
    (async function () {
      const appMetadata = {
        name: "Web3-Onboard Vanilla JS Demo",
      };

      const onboard = await Onboard({
        wallets: [],
        chains: [storyAeneid],
        appMetadata,
        theme: "default",
        clientId:
          "pqDiVPy5XHRwLGHJhc72t8QvPVHKgaV1kJnskEAkKlUAVGK1QLP9540EiRsEvU3eEqyyAvRt1SR2WOhYqiFyamR6", // client id from tomo
        projectId: "7ccfc6744e60679e5bf3ace7413c4e1f", // project id for wallet connect
      });

      const wallets = await onboard.connectWallet();
      const currentWallet = wallets[0];
      const walletProvider = currentWallet.provider;
      const provider = new ethers.BrowserProvider(walletProvider);
      // provider.send('personal_sign', ["0x313233", fromAccount]);
      console.log("Wallet connected:", currentWallet);
      // console.log("Provider:", provider);
      const signer = await provider.getSigner();
      console.log("Signer:", signer);

      const contractAddress = "0xFc1E0f63aF947254834610510932C7C0d295405F";

      // const contract = new ethers.Contract(
      //   contractAddress,
      //   contractAbi,
      //   signer
      // );

      // console.log("Contract:", contract);

      // const smartContractObj = new ReelContract(contractAddress, signer);
      // setSmartContract(smartContractObj);
    })();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        smartContract,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
