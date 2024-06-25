const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Lottery" , (m)=>{
    const lotteryContract = m.contract("LotteryContract");



    return {lotteryContract} ;
})