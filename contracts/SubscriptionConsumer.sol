// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity 0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts@1.2.0/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts@1.2.0/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SubscriptionConsumer is VRFConsumerBaseV2Plus {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests;

    uint256 public s_subscriptionId;


    uint256[] public requestIds;
    uint256 public lastRequestId;

    bytes32 public keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    IERC20 public linkToken; // LINK token for deposits
    uint256 public depositAmount; // Fixed deposit amount per user
    address public winner; // Address of the winner
    address public lastWinner; // Address of the winner

    enum GameState { Open, Closed, Calculating, Calculated }
    GameState public gameState;
    address[] public players; // List of players
    event PlayerJoined(address indexed player);
    event WinnerDeclared(address indexed winner, uint256 reward);
    event GameReset();

    uint32 public callbackGasLimit = 2400000;

    uint16 public requestConfirmations = 3;

    uint32 public numWords = 1;

    constructor(
        uint256 subscriptionId,
        address _linkToken,
        uint256 _depositAmount
    ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
        s_subscriptionId = subscriptionId;
        linkToken = IERC20(_linkToken);
        depositAmount = _depositAmount;
        gameState = GameState.Open;
    }

    function requestRandomWords(
        bool enableNativePayment
    ) internal returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: enableNativePayment
                    })
                )
            })
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        gameState = GameState.Calculated;

        emit RequestFulfilled(_requestId, _randomWords);        
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
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
			requestRandomWords(false);
        }
    }

    function resetGame() public onlyOwner {
        delete players;
        lastWinner = winner;
        winner = address(0);
        gameState = GameState.Open;
        emit GameReset();
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function distribute() external {
        require(gameState == GameState.Calculated, "Not in calculation state");
        uint256 winnerIndex = s_requests[lastRequestId].randomWords[0] % players.length;
        winner = players[winnerIndex];

        uint256 totalReward = depositAmount * players.length;
        require(
            linkToken.transfer(winner, totalReward),
            "Token transfer to winner failed"
        );

        emit WinnerDeclared(winner, totalReward);

        resetGame();
    }
}

