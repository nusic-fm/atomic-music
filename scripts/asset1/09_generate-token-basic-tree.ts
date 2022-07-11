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

interface TokenInfo {
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
}

let tokenCounter = -1;
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  atomicMusicNFT = await AtomicMusicNFT.attach(addresses.nftAddress);
  //console.log(sample);
  
  /*
  const txt = await atomicMusicNFT.addChildInfo(childInfo, {
    gasLimit:2000000
  });
  */

  for (let i = 0; i < 5; i++) {
    let tokenInfo:TokenInfo[] = [];
    const rootToken = ++tokenCounter;
    await generateChildren(tokenInfo, tokenCounter);
    console.log(tokenInfo);
    const txt = await atomicMusicNFT.addChildMetadata(rootToken,tokenInfo);
    console.log("txt.hash = ",txt.hash);
    const txtReceipt = await txt.wait();
    console.log("txt.hash = ",txtReceipt);
  }
}

async function generateChildren(tokenInfo:TokenInfo[], parentTokenId:number) {
  for (let i = 0; i < 8; i++) {
    tokenInfo.push({
      tokenId:++tokenCounter,
      parentTokenId: parentTokenId,
      isMinted: false
    });
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
