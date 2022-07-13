import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../../typechain';
import sample from '../../data/sample.json';
import treeData from '../../data/binary-tree-basic.json';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
let atomicMusicNFT:AtomicMusicNFT;

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  atomicMusicNFT = await AtomicMusicNFT.attach(addresses.nftAddress);

  const balance = await owner.getBalance();
  console.log("Balance = ", balance.toString());

  const totalTokens = await atomicMusicNFT.totalTokens();
  console.log("totalTokens = ",totalTokens.toString());

  const totalMinted = await atomicMusicNFT.totalMinted();
  console.log("totalMinted = ",totalMinted.toString());

  const getPrice = await atomicMusicNFT.getPrice(3,1);
  console.log("getPrice formatted = ", ethers.utils.formatEther(getPrice.toString()));
  console.log("getPrice = ", getPrice.toString());

  const balanceContract = await ethers.provider.getBalance(atomicMusicNFT.address);
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
