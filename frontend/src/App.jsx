import React from "react";
import ConnectButton from "./components/ConnectButton";

const App = () => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        height: "100vh",
        color: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <ConnectButton />
      </div>
    </div>
  );
};

export default App;
