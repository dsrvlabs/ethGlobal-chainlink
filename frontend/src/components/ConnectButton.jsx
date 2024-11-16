import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectButton = () => {
  const [connected, setConnected] = useState(false); // 연결 상태 관리
  const [account, setAccount] = useState(""); // 연결된 계정 저장

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // MetaMask 요청으로 계정 연결
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // 첫 번째 계정 저장
        setConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <button
      onClick={connectWallet}
      style={{
        backgroundColor: "#ff007a",
        border: "none",
        color: "white",
        borderRadius: "50px",
        padding: "5px 20px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      {connected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect"}
    </button>
  );
};

export default ConnectButton;
