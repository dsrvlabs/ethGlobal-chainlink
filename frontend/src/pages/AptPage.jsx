import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const SECOND_CONTRACT_ADDRESS = "0x0302736820c13703309ba5b2c3f446f493efe1ed";
const SECOND_ABI = [
  {
    inputs: [],
    name: "getPlayers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
];

const colors = ["#8000ff", "#00bfff", "#ff4500", "#32cd32"]; // 사각형 색상 팔레트

const AptPage = () => {
  const [players, setPlayers] = useState([]); // 게임 참여자 주소 배열
  const [currentAccount, setCurrentAccount] = useState(null); // 현재 사용자 주소

  useEffect(() => {
    // 현재 사용자 주소 가져오기
    const fetchCurrentAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setCurrentAccount(accounts[0]?.toLowerCase());
      }
    };

    fetchCurrentAccount();
  }, []);

  useEffect(() => {
    // 게임 참여자 주소 가져오기
    const fetchPlayers = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(SECOND_CONTRACT_ADDRESS, SECOND_ABI, provider);

          const playerAddresses = await contract.getPlayers();
          setPlayers(playerAddresses.map((address) => address.toLowerCase())); // 주소를 소문자로 변환
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  // 주소를 축약하는 함수
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`; // 앞 6자리와 뒤 4자리만 표시
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
          position: "absolute",
          top: "20px",
        }}
      >
        APT.
      </h1>

      {/* 3개의 사각형 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px", // 사각형 간 간격
        }}
      >
        {[1, 2, 3].map((level, index) => {
          const playerAddress = players[index]; // 현재 사각형에 대응하는 플레이어 주소
          const isCurrentPlayer = currentAccount === playerAddress; // 현재 사용자 여부
          const color = colors[index % colors.length]; // 색상 순환

          return (
            <div
              key={index}
              style={{
                width: "300px", // 사각형 너비 키움
                height: "120px", // 사각형 높이 키움
                backgroundColor: playerAddress ? color : "#e0e0e0", // 플레이어가 있을 때만 색상 적용
                border: "2px solid #444",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // 약간의 그림자
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: isCurrentPlayer ? "#fff" : "#000", // 자신의 주소는 흰색 글씨
                fontSize: "16px", // 글자 크기 확대
              }}
            >
              {playerAddress ? shortenAddress(playerAddress) : "Empty"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AptPage;

