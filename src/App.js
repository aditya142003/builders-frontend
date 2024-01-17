import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./components/Login";
import VideoRecordButton from "./components/VideoRecordButton";
import "./components/Home.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/VideoRecordButton" element={<VideoRecordButton />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
