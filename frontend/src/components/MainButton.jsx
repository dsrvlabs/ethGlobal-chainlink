import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

// 컨트랙트 정보
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

// 네트워크 설정 (Sepolia)
const TARGET_CHAIN_ID = "0xaa36a7"; // Sepolia Testnet Chain ID
const TARGET_CHAIN_NAME = "Sepolia Testnet";
const RPC_URL = "https://eth-sepolia.public.blastapi.io";
const BLOCK_EXPLORER_URL = "https://sepolia.etherscan.io";
const NATIVE_CURRENCY = {
  name: "Sepolia Ether",
  symbol: "ETH",
  decimals: 18,
};

const MainButton = () => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [loadingDots, setLoadingDots] = useState(""); // 점 상태
  const navigate = useNavigate(); // 페이지 이동

  // 점 애니메이션 효과
  useEffect(() => {
    if (isLoading) {
      let count = 0;
      const interval = setInterval(() => {
        setLoadingDots(".".repeat(count % 4)); // 점이 0~3개까지 반복
        count++;
      }, 500); // 0.5초 간격
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    } else {
      setLoadingDots(""); // 로딩 완료 시 점 초기화
    }
  }, [isLoading]);

  // 네트워크 전환 함수
  const switchToSepolia = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return false;
    }

    try {
      // 네트워크 전환 요청
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      // 네트워크가 없는 경우 추가
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
      setIsLoading(true);

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
      const spenderAddress = SECOND_CONTRACT_ADDRESS;
      const amount = ethers.utils.parseUnits("1.0", 18);

      console.log("Calling approve...");
      const approveTx = await firstContract.approve(spenderAddress, amount);
      await approveTx.wait();
      console.log("Approve transaction confirmed!");

      // 두 번째 컨트랙트: joinGame 호출
      const secondContract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, signer);

      console.log("Calling joinGame...");
      const gasLimit = await secondContract.estimateGas.joinGame(); // 가스 추정
      const joinGameTx = await secondContract.joinGame({
        gasLimit: gasLimit.add(ethers.BigNumber.from("100000000")), // 가스 한도 추가
      });
      console.log("JoinGame transaction sent:", joinGameTx.hash);

      await joinGameTx.wait();
      console.log("JoinGame transaction confirmed!");

      alert("Successfully joined the game!");
      navigate("/apt"); // APT 페이지로 이동
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing transactions.");
    } finally {
      setIsLoading(false);
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
        width: "250px", // 고정 너비
        height: "60px", // 고정 높이
        padding: "0",
        fontSize: "18px",
        fontFamily: "'Press Start 2P', sans-serif",
        cursor: isLoading ? "not-allowed" : "pointer",
        textShadow: "2px 2px 0px #000",
        boxShadow: "0px 4px 0px #000",
        marginTop: "30px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      disabled={isLoading}
    >
      {isLoading ? `Processing${loadingDots}` : "Join the Game"}
    </button>
  );
};

export default MainButton;

