import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicYBNFT, AtomicMusicYBNFT__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  // USDC on moonriver
  //0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d
  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.deploy("NoAirMusic","NANFT", addresses.usdcAddress ,"https://gateway.pinata.cloud/ipfs/QmXDP6iiTwFTUEWaV8NizypmNnnXfbqvgjB3hQnUygnBQB/");
  await atomicMusicYBNFT.deployed();
  //"AtomicMusicNFT","AMNFT"
  console.log("AtomicMusicYBNFT deployed to:", atomicMusicYBNFT.address);
  //0xC57d6963f184Bff298d38b47276C0ECe1199f76c
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
