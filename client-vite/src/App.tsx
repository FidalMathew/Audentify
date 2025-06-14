import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import ReelDetailPage from "./pages/reels/ReedPage";
import UserProfilePage from "./pages/profile/Profile";
import { Header } from "./components/Header.tsx";
import Upload1 from "./pages/Upload.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload1 />} />
          <Route path="/reels/:reelId" element={<ReelDetailPage />} />
          <Route path="/profile/:profileId" element={<UserProfilePage />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
