import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicYBNFT, AtomicMusicYBNFT__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

interface TokenInfo {
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
}

let tokenCounter = -1;
const outerLoop = 1;
const innerLoop = 14;
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.attach(addresses.nftAddress);
  //console.log(sample);
  

  for (let i = 0; i < outerLoop; i++) {
    let tokenInfo:TokenInfo[] = [];
    const rootToken = ++tokenCounter;
    await generateChildren(tokenInfo, tokenCounter);
    console.log(tokenInfo);
    const txt = await atomicMusicYBNFT.addChildMetadata(rootToken,tokenInfo);
    console.log("txt.hash = ",txt.hash);
    const txtReceipt = await txt.wait();
    console.log("txt.hash = ",txtReceipt);
  }
}

async function generateChildren(tokenInfo:TokenInfo[], parentTokenId:number) {
  for (let i = 0; i < innerLoop; i++) {
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
