import React from "react";

const Result = ({ description, winnerAddress, onClaim }) => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Press Start 2P', sans-serif",
        color: "white",
      }}
    >
      {/* 상단 타이틀 */}
      <h1
        style={{
          color: "#ff007a",
          fontSize: "72px",
          textShadow: "4px 4px 0px #000",
          marginBottom: "40px",
        }}
      >
        RESULT
      </h1>

      {/* 설명 텍스트 */}
      {description && (
        <p
          style={{
            color: "#e0e0e0",
            fontSize: "16px",
            textAlign: "center",
            margin: "0 20px",
            textShadow: "1px 1px 0px #000",
          }}
        >
          {description}
        </p>
      )}

      {/* 우승자 주소 */}
      {winnerAddress && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#00bfff",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
            fontSize: "16px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Winner: {winnerAddress.slice(0, 6)}...{winnerAddress.slice(-4)}
        </div>
      )}

      {/* Claim Reward 버튼 */}
      <button
        onClick={onClaim}
        style={{
          marginTop: "40px",
          backgroundColor: "#ff007a",
          border: "none",
          color: "white",
          borderRadius: "10px",
          padding: "15px 40px",
          fontSize: "18px",
          fontFamily: "'Press Start 2P', sans-serif",
          cursor: "pointer",
          textShadow: "2px 2px 0px #000",
          boxShadow: "0px 4px 0px #000",
        }}
      >
        Claim Reward
      </button>
    </div>
  );
};

export default Result;

