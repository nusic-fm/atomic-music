import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicMCNFT, AtomicMusicMCNFT__factory } from '../../typechain';
import sample from '../../data/sample.json';
import treeData from '../../data/binary-tree-basic.json';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
let atomicMusicMCNFT:AtomicMusicMCNFT;

interface TokenInfo {
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
  price: BigNumber;
}


async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicMCNFT:AtomicMusicMCNFT__factory = await ethers.getContractFactory("AtomicMusicMCNFT");
  atomicMusicMCNFT = await AtomicMusicMCNFT.attach(addresses.nftAddress);

  const childInfo = await atomicMusicMCNFT.getChildrenMetadata(0);
  console.log("_childrenInfo = ",childInfo);
  
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
