import { useContext } from "react";
import { WalletContext } from "./WalletContext";

export const useWalletContext = () => {
  return useContext(WalletContext);
};
