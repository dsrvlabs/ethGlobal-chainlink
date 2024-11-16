import React, { useState } from "react";
import { ethers } from "ethers";

// 첫 번째 컨트랙트 정보
const FIRST_CONTRACT_ADDRESS = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
const FIRST_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// 두 번째 컨트랙트 정보
const SECOND_CONTRACT_ADDRESS = "0x0302736820c13703309ba5b2c3f446f493efe1ed";
const SECOND_ABI = [
  {
    inputs: [],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Sepolia Network 설정
const TARGET_CHAIN_ID = "0xaa36a7"; // Sepolia Chain ID
const TARGET_CHAIN_NAME = "Sepolia Testnet";
const RPC_URL = "https://eth-sepolia.public.blastapi.io";
const BLOCK_EXPLORER_URL = "https://sepolia.etherscan.io";
const NATIVE_CURRENCY = {
  name: "Sepolia Ether",
  symbol: "ETH",
  decimals: 18,
};

const MainButton = () => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return false;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: TARGET_CHAIN_ID,
                chainName: TARGET_CHAIN_NAME,
                rpcUrls: [RPC_URL],
                blockExplorerUrls: [BLOCK_EXPLORER_URL],
                nativeCurrency: NATIVE_CURRENCY,
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
          return false;
        }
      } else {
        console.error("Error switching network:", switchError);
        return false;
      }
    }
  };

  const handleApproveAndJoinGame = async () => {
    try {
      setIsLoading(true); // 로딩 시작

      // 네트워크 전환
      const isNetworkSwitched = await switchToSepolia();
      if (!isNetworkSwitched) {
        alert(`Please switch to ${TARGET_CHAIN_NAME} manually in MetaMask.`);
        setIsLoading(false); // 로딩 상태 해제
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 첫 번째 컨트랙트: approve 호출
      const firstContract = new ethers.Contract(FIRST_CONTRACT_ADDRESS, FIRST_ABI, signer);
      const spenderAddress = SECOND_CONTRACT_ADDRESS; // 두 번째 컨트랙트를 spender로 설정
      const amount = ethers.utils.parseUnits("1.0", 18); // 승인할 토큰 수량

      console.log("Calling approve...");
      const approveTx = await firstContract.approve(spenderAddress, amount);
      console.log("Approve transaction sent:", approveTx.hash);

      await approveTx.wait();
      console.log("Approve transaction confirmed!");

      // 두 번째 컨트랙트: joinGame 호출
      const secondContract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, signer);

      console.log("Calling joinGame...");
      const joinGameTx = await secondContract.joinGame();
      console.log("JoinGame transaction sent:", joinGameTx.hash);

      await joinGameTx.wait();
      console.log("JoinGame transaction confirmed!");

      alert("Successfully joined the game!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing transactions.");
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <button
      onClick={handleApproveAndJoinGame}
      style={{
        backgroundColor: isLoading ? "#aaa" : "#ff007a",
        border: "none",
        color: "white",
        borderRadius: "10px",
        padding: "15px 40px",
        fontSize: "18px",
        fontFamily: "'Press Start 2P', sans-serif",
        cursor: isLoading ? "not-allowed" : "pointer",
        textShadow: "2px 2px 0px #000",
        boxShadow: "0px 4px 0px #000",
        marginTop: "30px",
        position: "relative",
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              border: "2px solid white",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></span>
          Processing...
        </span>
      ) : (
        "Join the Game"
      )}
    </button>
  );
};

export default MainButton;

