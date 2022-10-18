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

  const _royaltyInfo = await atomicMusicMCNFT.royaltyInfo(2,ethers.utils.parseEther("0.5"));
  console.log("_royaltyInfo = ",_royaltyInfo.toString());

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
