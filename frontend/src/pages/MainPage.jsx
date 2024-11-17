import React, { useState, useEffect } from "react";
import MainButton from "../components/MainButton";
import { ethers } from "ethers";

const MainPage = () => {
  const [account, setAccount] = useState(null);

  // MetaMask 연결 함수
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []); // MetaMask 연결 요청
        setAccount(accounts[0]); // 첫 번째 계정 설정
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // MetaMask 계정 변경 이벤트 처리
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      alert("Please connect to MetaMask.");
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    // MetaMask 자동 연결 및 이벤트 리스너 등록
    const loadAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]); // 자동으로 첫 번째 계정 설정
          }
        } catch (error) {
          console.error("Error fetching account:", error);
        }

        // 계정 변경 이벤트 리스너 등록
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
    };

    loadAccount();

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
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
        color: "white",
        fontFamily: "'Press Start 2P', sans-serif",
        position: "relative",
      }}
    >
      {/* 상단 타이틀 */}
      <h1
        style={{
          color: "#ff007a",
          fontSize: "72px",
          textShadow: "4px 4px 0px #000",
        }}
      >
        APT.
      </h1>

      {/* 현재 연결된 Wallet 정보 */}
      <div
        style={{
          margin: "20px 0",
          color: account ? "#00ff00" : "#ff0000",
          fontSize: "16px",
        }}
      >
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "Wallet not connected"}
      </div>

      {/* Connect Wallet 버튼 (지갑 미연결 상태일 때만 표시) */}
      {!account && (
        <button
          onClick={connectWallet}
          style={{
            backgroundColor: "#ff007a",
            border: "none",
            color: "white",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            fontFamily: "'Press Start 2P', sans-serif",
            cursor: "pointer",
            textShadow: "2px 2px 0px #000",
            boxShadow: "0px 4px 0px #000",
            marginBottom: "20px",
          }}
        >
          Connect Wallet
        </button>
      )}

      {/* 메인 버튼 */}
      <MainButton />
    </div>
  );
};

export default MainPage;

