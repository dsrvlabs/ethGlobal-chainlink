import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import AptPage from "./pages/AptPage";
import Pending from "./pages/Pending";
import Result from "./pages/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 기본 경로 */}
        <Route path="/apt" element={<AptPage />} /> {/* /apt 경로 */}
        <Route path="/pending" element={<Pending />} /> {/* /pending 경로 */}
        <Route
          path="/result"
          element={
            <Result
               description="Selected winner using CHAINLINK VRF"
            />
          }
        /> {/* /result 경로 */}
      </Routes>
    </Router>
  );
}

export default App;

