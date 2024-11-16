import React, { useState } from "react";

const ConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it and try again.");
    }
  };

  return (
    <button
      onClick={connectWallet}
      style={{
        backgroundColor: "#ff007a",
        border: "none",
        color: "white",
        borderRadius: "10px",
        padding: "10px 20px",
        fontSize: "12px",
        fontFamily: "'Press Start 2P', sans-serif",
        cursor: "pointer",
        textShadow: "2px 2px 0px #000",
        boxShadow: "0px 4px 0px #000",
      }}
    >
      {connected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect"}
    </button>
  );
};

export default ConnectButton;
