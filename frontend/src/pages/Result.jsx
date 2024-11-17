import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const SECOND_CONTRACT_ADDRESS = "0xf2f7e6ad11894f3b11d3411eb8fe844d30f95bb2";
const SECOND_ABI = [
  {
    inputs: [],
    name: "winner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "distribute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Result = ({ description }) => {
  const [winnerAddress, setWinnerAddress] = useState(null); // Winner 주소 상태
  const [isClaiming, setIsClaiming] = useState(false); // Claim 상태 관리

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask is not installed!");
          return;
        }

        // Ethereum provider 연결
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, provider);

        // winner 호출
        const winner = await contract.lastWinner();
        setWinnerAddress(winner);
      } catch (error) {
        console.error("Error fetching winner:", error);
      }
    };

    fetchWinner();
  }, []);

  const handleClaim = async () => {
    try {
      setIsClaiming(true); // Claim 상태 시작
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // Ethereum provider 연결
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, signer);

      // distribute 함수 호출
      const tx = await contract.distribute();
      console.log("Transaction sent:", tx.hash);

      // 트랜잭션 확인 대기
      await tx.wait();
      alert("Reward distributed successfully!");
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Failed to distribute reward.");
    } finally {
      setIsClaiming(false); // Claim 상태 종료
    }
  };

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

      {/* Winner가 아직 없을 경우 */}
      {!winnerAddress && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#e0e0e0",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.4)",
            fontSize: "16px",
            color: "#000",
            textAlign: "center",
          }}
        >
          Fetching Winner...
        </div>
      )}

      {/* Claim Reward 버튼 */}
      <button
        onClick={handleClaim}
        disabled={isClaiming}
        style={{
          marginTop: "40px",
          backgroundColor: isClaiming ? "#888" : "#ff007a",
          border: "none",
          color: "white",
          borderRadius: "10px",
          padding: "15px 40px",
          fontSize: "18px",
          fontFamily: "'Press Start 2P', sans-serif",
          cursor: isClaiming ? "not-allowed" : "pointer",
          textShadow: "2px 2px 0px #000",
          boxShadow: "0px 4px 0px #000",
        }}
      >
        {isClaiming ? "Claiming..." : "Claim Reward"}
      </button>
    </div>
  );
};

export default Result;

