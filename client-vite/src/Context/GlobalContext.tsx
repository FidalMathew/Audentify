import { ReelContract } from "@/lib/ReelContract";
import { createContext, ReactNode } from "react";
import { Hex } from "viem";

type GlobalContextType = {
  walletAddress?: string;
};

export const GlobalContext = createContext<GlobalContextType>({
  walletAddress: undefined,
});

const r = new ReelContract(
  "0x3bbBefA6F76eB11FEcd720541f01410373d67F39",
  `0x${import.meta.env.VITE__WALLET_PRIVATE_KEY!}` as Hex
);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
};
