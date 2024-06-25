const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("Lottery" ,  ()=>{


    async function deployContractFetchAccounts(){

        const[Owner , User1 , User2 , User3] = await hre.ethers.getSigners();


        const Lottery = await hre.ethers.getContractFactory('LotteryContract');
        const lottery = await Lottery.connect(Owner).deploy();


        console.log("Owner address:" , Owner.address);
        console.log("Contract address:" , lottery.target);


        return {Owner , User1 , User2 , User3 , lottery}


    }

    it("Should deploy and set Contract owner address to owner address" , async()=>{

        const {Owner , lottery} = await loadFixture(deployContractFetchAccounts);


        expect(await lottery.owner()).to.equal(Owner.address);

    });

    it("Should tickets bought be equal to the contract balance " , async()=>{
        const {lottery,User1 , User2 , User3} = await loadFixture(deployContractFetchAccounts);

        await lottery.connect(User1).buyTicket( { value: hre.ethers.parseEther("1") });
        await lottery.connect(User2).buyTicket( { value: hre.ethers.parseEther("1") });
        await lottery.connect(User3).buyTicket( { value: hre.ethers.parseEther("1") });


        expect(hre.ethers.parseEther("3")).to.equal(await hre.ethers.provider.getBalance(lottery.target));
    });

    it("Should give the wining prize to the Winner " , async()=>{
        const {lottery,User1 , User2 , User3 , Owner} = await loadFixture(deployContractFetchAccounts);

        
        const winnerPromise = new Promise((resolve, reject) => {
            lottery.once("Winner", (winnerAddress) => {
                resolve(winnerAddress);
            });
        });

        await lottery.connect(User1).buyTicket( { value: hre.ethers.parseEther("1") });
        await lottery.connect(User2).buyTicket( { value: hre.ethers.parseEther("1") });
        await lottery.connect(User3).buyTicket( { value: hre.ethers.parseEther("1") });

        
        await lottery.connect(Owner).GetWinner();

        
        const winnerAddress = await winnerPromise;

     expect([User1.address, User2.address, User3.address]).to.include(winnerAddress);


    });
    
});


