import Home from "@/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header.tsx";
import { WalletProvider } from "./Context/GlobalContext.tsx";
import Connect from "./pages/Connect.tsx";
import UserProfilePage from "./pages/profile/Profile";
import ReelDetailPage from "./pages/reels/ReedPage";
import Upload1 from "./pages/Upload.tsx";

function App() {
  return (
    <>
      <WalletProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/upload" element={<Upload1 />} />
            <Route path="/reels/:reelId" element={<ReelDetailPage />} />
            <Route path="/profile/:profileId" element={<UserProfilePage />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </>
  );
}

export default App;
