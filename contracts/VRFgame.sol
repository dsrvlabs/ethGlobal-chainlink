// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MoneyGame is VRFConsumerBase {
    IERC20 public linkToken; // LINK token for deposits
    uint256 public depositAmount; // Fixed deposit amount per user

    address[] public players; // List of players
    address public winner; // Address of the winner

    bytes32 internal keyHash; // Chainlink VRF keyHash
    uint256 internal fee; // Chainlink VRF fee

    enum GameState { Open, Closed, Calculating }
    GameState public gameState;

    event PlayerJoined(address indexed player);
    event WinnerDeclared(address indexed winner, uint256 reward);
    event GameReset();

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint256 _depositAmount
    )
        VRFConsumerBase(_vrfCoordinator, _linkToken)
    {
        linkToken = IERC20(_linkToken);
        keyHash = _keyHash;
        fee = _fee;
        depositAmount = _depositAmount;
        gameState = GameState.Open;
    }

    function joinGame() external {
        require(gameState == GameState.Open, "Game is not open");
        require(players.length < 3, "Game already has 3 players");
        require(
            linkToken.transferFrom(msg.sender, address(this), depositAmount),
            "Token transfer failed"
        );

        players.push(msg.sender);
        emit PlayerJoined(msg.sender);

        if (players.length == 3) {
            gameState = GameState.Calculating;
            requestRandomWinner();
        }
    }

    function requestRandomWinner() internal {
        require(linkToken.balanceOf(address(this)) >= fee, "Not enough LINK for VRF fee");
        requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        require(gameState == GameState.Calculating, "Not in calculation state");
        uint256 winnerIndex = randomness % players.length;
        winner = players[winnerIndex];

        uint256 totalReward = depositAmount * players.length;
        require(
            linkToken.transfer(winner, totalReward),
            "Token transfer to winner failed"
        );

        emit WinnerDeclared(winner, totalReward);

        resetGame();
    }

    function resetGame() internal {
        delete players;
        winner = address(0);
        gameState = GameState.Open;
        emit GameReset();
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }
}
