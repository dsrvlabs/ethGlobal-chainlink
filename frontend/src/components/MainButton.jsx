import React from "react";

const MainButton = () => {
  const handleClick = () => {
    alert("Join the game clicked!");
  };

  return (
    <button
      onClick={handleClick}
      style={{
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
        marginTop: "30px",
      }}
    >
      Join the game
    </button>
  );
};

export default MainButton;

