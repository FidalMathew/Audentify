import { createContext, ReactNode } from "react";

type WalletContextType = {
  walletAddress?: string;
};

export const WalletContext = createContext<WalletContextType>({
  walletAddress: undefined,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const walletAddress = "0x3f93B8DCAf29D8B3202347018E23F76e697D8539";
  return (
    <WalletContext.Provider
      value={{
        walletAddress: walletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
