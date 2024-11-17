import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage"; // 기존 시작 페이지
import AptPage from "./pages/AptPage"; // APT 페이지

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 시작 페이지 */}
        <Route path="/" element={<MainPage />} />
        {/* APT 페이지 */}
        <Route path="/apt" element={<AptPage />} />
      </Routes>
    </Router>
  );
};

export default App;

