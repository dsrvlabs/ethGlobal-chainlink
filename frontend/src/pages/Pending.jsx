import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const SECOND_CONTRACT_ADDRESS = "0xF3BDa598129334fE483C313b46E6953D33B8aC00";
const SECOND_ABI = [
  {
    inputs: [],
    name: "gameState",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
];

const Pending = () => {
  const navigate = useNavigate();
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    // gameState 상태 체크 (5초마다)
    const interval = setInterval(async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, provider);

          const state = await contract.gameState();
          if (state === 3) {
            navigate("/result"); // gameState가 3일 경우 Result 페이지로 이동
          }
        }
      } catch (error) {
        console.error("Error fetching gameState:", error);
      }
    }, 5000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
  }, [navigate]);

  useEffect(() => {
    // 로딩 점 애니메이션
    const dotInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

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
        APT.
      </h1>

      {/* "Checking Winner..." 버튼 */}
      <button
        style={{
          backgroundColor: "#ff007a",
          border: "none",
          color: "white",
          borderRadius: "10px",
          padding: "15px 40px",
          fontSize: "18px",
          fontFamily: "'Press Start 2P', sans-serif",
          cursor: "not-allowed", // 버튼 비활성화 상태
          textShadow: "2px 2px 0px #000",
          boxShadow: "0px 4px 0px #000",
        }}
        disabled
      >
        Checking Winner{loadingDots}
      </button>
    </div>
  );
};

export default Pending;

