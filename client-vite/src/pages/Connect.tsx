import { Onboard, useConnectModal } from "@tomo-inc/tomo-evm-kit";
// import { ethers } from "ethers";
import { storyAeneid } from "viem/chains";
// import { ethers } from "ethers";
import { useGlobalContext } from "@/Context/useGlobalContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Connect() {
  const { setWallet } = useGlobalContext();
  const { openConnectModal } = useConnectModal();
  // const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const performAction = async () => {
    console.log("Performing action...");
    const chains = [
      {
        id: "0x1", // Replace with your chain ID
        name: "Ethereum Mainnet", // Replace with your chain name
        rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"], // Replace with your RPC URL
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
      },
      // Add more chains as needed
    ];
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
    // const provider = new ethers.BrowserProvider(walletProvider);
    // provider.send('personal_sign', ["0x313233", fromAccount]);
    // setProvider(provider);
    console.log("setWallet called", setWallet);
    console.log("Wallet connected:", currentWallet);
    setWallet(currentWallet);
    // setWalletAddress(currentWallet.accounts[0]);
    // console.log("Provider:", provider);
  };

  return (
    <>
      <Button onClick={() => openConnectModal?.()}>Connect Wallet</Button>
      {walletAddress && (
        <div>
          <p>Connected Wallet Address: {walletAddress}</p>
        </div>
      )}
      <Button onClick={() => performAction()}>Perform Action</Button>
    </>
  );
}

export default Connect;
