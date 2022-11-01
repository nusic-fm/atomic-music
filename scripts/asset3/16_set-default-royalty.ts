import { BigNumber } from 'ethers';
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

  //const txt = await atomicMusicMCNFT.setDefaultRoyalty(owner.address,BigNumber.from(5000));
  const txt = await atomicMusicMCNFT.setDefaultRoyalty("0x38993c3843041066ef6ca666398d1f8ba5f19823",BigNumber.from(5000));
  console.log("setDefaultRoyalty txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("setDefaultRoyalty txt.hash = ",txtReceipt);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
