import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, TomoEVMKitProvider } from "@tomo-inc/tomo-evm-kit";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import App from "./App.tsx";
import "./index.css";

// import { Buffer } from "buffer";
// import process from "process";

// window.Buffer = Buffer;
// window.process = process;

const config = getDefaultConfig({
  clientId: import.meta.env.VITE_CLIENT_ID, // Replace with your clientId
  appName: import.meta.env.VITE_CLIENT_APPNAME, // Replace with your appName
  projectId: import.meta.env.VITE_PROJECT_ID, // Note: Every dApp that relies on WalletConnect now needs to obtain a projectId from WalletConnect Cloud.
  chains: [mainnet],
  ssr: true, // If your dApp uses server-side rendering (SSR)
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <TomoEVMKitProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </TomoEVMKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
