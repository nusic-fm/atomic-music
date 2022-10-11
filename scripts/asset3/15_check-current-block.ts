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

  let blockNumberWithMethod = await ethers.provider.getBlockNumber();
  let blockNumberWithProperty = ethers.provider.blockNumber;
  //let timestamp = ethers.provider.;
  console.log("blockNumberWithMethod = ", blockNumberWithMethod);
  console.log("blockNumberWithProperty = ", blockNumberWithProperty);

  console.log("blockNumber in Contract = ", (await atomicMusicMCNFT.mintBlock()).toString());
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
