import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../../typechain';
import sample from '../../data/sample.json';
import treeData from '../../data/binary-tree-basic.json';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.attach(addresses.nftAddress);

  //const amount = await atomicMusicNFT.price();
  const amount = ethers.utils.parseEther("0.25")
  const txt = await atomicMusicNFT.mint(3,1, {value: amount});
  console.log("mint child txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("mint child txt.hash = ",txtReceipt);

  /*
  const txt = await atomicMusicNFT.mint(4,0);
  console.log("mint child txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("mint child txt.hash = ",txtReceipt);
  */
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
