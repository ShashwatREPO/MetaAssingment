# Lottery Contract DApp

This project demonstrates a basic decentralized application (DApp) for a lottery using Ethereum smart contracts and a React frontend.

## Demonstrated Functions

function that are demonstrated 

### Buy Ticket (buyTicket)

Allows participants to buy a lottery ticket by sending 1 ether. This function adds the sender's address to the list of participants.

### Get Winner (GetWinner)

Runs the selection process to determine the winner of the lottery. It picks a random participant based on block data and transfers 90% of the contract's balance to the winner.

### Withdraw Rest (withdrawRest)
Allows the contract owner to withdraw the remaining balance (10% of the contract's balance) after the winner has been selected.


## Functions in smartcontract (not Demostrated because of lack of time)

### participantsCount()
Counts and returns the number of participants in the lottery.

### PrizePool()
Returns the current balance of the contract, which represents the total prize pool available.

### fallback()
Rejects direct payments to the contract to prevent unintended transfers.


## Learning OutComes

This project helps in understanding:

- Interactions between a React frontend and Ethereum smart contracts using ethers.js.
- Solidity smart contract deployement and testing using harhat
