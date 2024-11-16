import React from "react";
import Header from "./components/Header";
import ConnectButton from "./components/ConnectButton";
import MainButton from "./components/MainButton";

const App = () => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "#ff007a",
        fontFamily: "'Press Start 2P', sans-serif",
      }}
    >
      {/* 상단 연결 버튼 */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <ConnectButton />
      </div>

      {/* 메인 헤더 */}
      <Header />

      {/* 메인 버튼 */}
      <MainButton />
    </div>
  );
};

export default App;
