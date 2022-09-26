import { ethers } from 'hardhat';
import { AtomicMusicMCNFT, AtomicMusicMCNFT__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicMCNFT:AtomicMusicMCNFT__factory = await ethers.getContractFactory("AtomicMusicMCNFT");
  const atomicMusicMCNFT:AtomicMusicMCNFT = await AtomicMusicMCNFT.attach(addresses.nftAddress);

  const balance = await owner.getBalance();
  console.log("Balance = ", balance.toString());

  const totalTokens = await atomicMusicMCNFT.totalTokens();
  console.log("totalTokens = ",totalTokens.toString());

  const totalMinted = await atomicMusicMCNFT.totalMinted();
  console.log("totalMinted = ",totalMinted.toString());

  const getPrice = await atomicMusicMCNFT.getPrice(14,0);
  console.log("getPrice formatted = ", ethers.utils.formatEther(getPrice.toString()));
  console.log("getPrice = ", getPrice.toString());

  const balanceContract = await ethers.provider.getBalance(atomicMusicMCNFT.address);
  console.log("balanceContract in contract = ", balanceContract.toString());

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
