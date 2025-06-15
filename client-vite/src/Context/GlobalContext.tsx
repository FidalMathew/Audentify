import { ReelContract } from "@/lib/ReelContract";
import { createContext, type ReactNode } from "react";
import type { Hex } from "viem";

type GlobalContextType = {
  smartContract: ReelContract;
};

const smartContract = new ReelContract(
  "0x8127406B9724304B16Dbb602bC0006c409668841",
  `0x${import.meta.env.VITE_WALLET_PRIVATE_KEY!}` as Hex
);

export const GlobalContext = createContext<GlobalContextType>({
  smartContract: new ReelContract(
    "",
    `0x${import.meta.env.VITE_WALLET_PRIVATE_KEY!}`
  ),
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
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
