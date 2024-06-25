import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import contract from "../../../SmartContract/artifacts/contracts/LotteryContract.sol/LotteryContract.json";

function App() {
  const [walletConnection, setWalletConnection] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [connectAccount, setConnectAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [prizePool, setPrizePool] = useState(0);

  const contractAddress = "0x0a6DE36C08018d7d16756BF286656c1d2C982eEd";

  const checkForWalletProvider = useCallback(async () => {
    if (window.ethereum) {
      console.log("Wallet provider found");
      try {
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length >= 0) {
          const signer =await provider.getSigner();
          const account = await signer.getAddress();
          setWalletConnection(true);
          setConnectAccount(account);
          const instance = new ethers.Contract(
            contractAddress,
            contract.abi,
            signer
          );
          setContractInstance(instance);

          const ownerAddress = await instance.owner();
          setIsOwner(ownerAddress === account);

          
        } else {
          setWalletConnection(false);
        }
      } catch (e) {
        console.log(e);
        setWalletConnection(false);
      }
    }
  }, [contractAddress]);

 

  useEffect(() => {
    checkForWalletProvider();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setWalletConnection(false);
        setConnetAccount("");
        setContreactInstance(null);
      }
    };

    return () => {
      window.ethereum.off("accountsChanged", handleAccountsChanged);
    };
  }, [checkForWalletProvider]);

  const handleClick = async () => {
    try {
      await checkForWalletProvider();
    } catch (e) {
      console.log(e);
    }
   
  };

  const handleWithdraw = async () => {
    try {
      contractInstance.withdrawRest({});
    } catch (e) {
      if (e && contractInstance) {
        const decodeError = contractInstance.interface.parseError(e.data);
        console.log(`Error : ${decodeError?.name}`);
      }
    }
  };

  const handleWithGetWinner = async () => {
    try {
      contractInstance.GetWinner({});
    } catch (e) {
      if (e && contractInstance) {
        const decodeError = contractInstance.interface.parseError(e.data);
        console.log(`Error : ${decodeError?.name}`);
      }
    }
  };

  const handleBuyTicket = async () => {
    try {
      const tx = await contractInstance.buyTicket({
        value: ethers.parseEther("1"),
      });
      await tx.wait();

      const participants = await contractInstance.participantsCount();
      await setParticipants(ethers.formatUnits(participants , 1) * 10);
      console.log(ethers.formatUnits(participants , 1) * 10);

      const PrizePool = await contractInstance.PrizePool();
      await setPrizePool(ethers.formatUnits(PrizePool , 1) * 10);
      console.log(ethers.formatUnits(PrizePool , 1) * 10);
    } catch (e) {
      console.log(e);
    }
  };

  return walletConnection ? (
    <div className="w-screen h-screen bg-primary-0 flex flex-col ]">
      <div className="flex justify-between items-center p-4 ">
        <p className="font-Josefin text-white font-bold italic ">
          TO HELL WITH MONEY
        </p>

        <div className="flex gap-2 items-center">
          {isOwner ? (
            <div className="flex items-center gap-2 ">
              <button
                className="bg-accent-0 px-6 py-2  text-white rounded-md"
                onClick={handleWithdraw}
              >
                Withdraw
              </button>

              <button
                className="px-6 py-2 border-collapse border-[1px] rounded-md border-white font-Josefin text-white"
                onClick={handleWithGetWinner}
              >
                Get Winner
              </button>
            </div>
          ) : (
            <div></div>
          )}

          <p className="text-white px-4 py-4 font-Josefin font-bold">
            {isOwner ? "Owner" : "Participants"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 h-full">
        <div className="flex gap-4">
          <p className="text-white font-Josefin">
            Participants count : {participants}
          </p>
          <p className="text-white font-Josefin">
            Prize Pool : {prizePool} Eth
          </p>
        </div>

        <button
          className="bg-accent-0 px-4 py-2 text-white font-Josefin rounded-md"
          onClick={handleBuyTicket}
        >
          Buy Ticked, cost 1 Eth{" "}
        </button>
      </div>
    </div>
  ) : (
    <div className="w-screen h-screen bg-primary-0 bg-contain bg-no-repeat  bg-cover justify-center  flex flex-col bg-[url('./assets/bg-Image.png')]">
      <div className="flex flex-col bg-[#120E20] justify-between mx-auto w-96 h-1/2 rounded-lg bg-opacity-90 px-6 py-10">
        <div className="flex flex-col gap-3">
          <div className="font-Josefin font-bold italic text-offWhite-0 text-4xl mx-auto">
            To Hell With <br />
            <div className="w-40 h-1 bg-offWhite-0 inline-block mb-3"></div>
            Money
          </div>

          <p className="font-Josefin text-offWhite-0 leading-5 text-base">
            <span className="font-bold">Disclamer : </span>This is not a
            gambling website its an assignment and the purpose of this website
            is just to practice connection between smart contract and frontend
            application
          </p>
        </div>

        <button
          className="text-offWhite-0 bg-accent-0 px-4 py-2 rounded-md font-Josefin"
          onClick={handleClick}
        >
          Connect Metamasks
        </button>
      </div>
    </div>
  );
}

export default App;
