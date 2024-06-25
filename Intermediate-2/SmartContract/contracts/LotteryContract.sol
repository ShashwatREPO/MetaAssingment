// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LotteryContract {
    address payable public owner;
    bool public eventEnded = false;
    bool public winnerDecided = false;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner of contract");
        _;
    }

    address[] private participantAddresses;
    uint256 TicketPrice = 1 ether;

    event Winner(address indexed winnerAddress);

    function buyTicket() public payable {
        require(!eventEnded, "Eventended");
        require(msg.value >= TicketPrice, "Not enough ether");
        assert(msg.value == TicketPrice);

        participantAddresses.push(msg.sender);
    }

    function participantsCount() external view returns (uint256) {
        return participantAddresses.length;
    }

    function GetWinner() public onlyOwner {
        require(!winnerDecided, "Winner has already been decided");

        require(
            participantAddresses.length > 0,
            "No participants in the lottery"
        );

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.difficulty,
                    block.timestamp,
                    participantAddresses
                )
            )
        );
        uint256 winnerIndex = randomNumber % participantAddresses.length;
        address payable winnerAddress = payable(
            participantAddresses[winnerIndex]
        );

        uint256 balanceOfContract = address(this).balance;
        uint256 winningAmount = (balanceOfContract * 90) / 100;

        winnerAddress.transfer(winningAmount);

        winnerDecided = true;
        eventEnded = true;

        emit Winner(winnerAddress);

        delete participantAddresses;
    }

    function withdrawRest() public onlyOwner {
        require(winnerDecided == true, "winner not decided");
        require(eventEnded == true, "Event not ended");

        owner.transfer(address(this).balance);
        eventEnded = false;
        winnerDecided = false;
    }

    function PrizePool() external returns (uint256) {
        return address(this).balance;
    }

    fallback() external {
        revert("Cannot except ether directly");
    }
}
