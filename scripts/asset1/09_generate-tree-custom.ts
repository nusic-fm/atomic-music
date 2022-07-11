import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
let atomicMusicNFT:AtomicMusicNFT;

interface TokenInfo {
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
  price: BigNumber;
}

let tokenCounter = -1;
const outerLoop = 5;
const innerLoop = 8;
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  atomicMusicNFT = await AtomicMusicNFT.attach(addresses.nftAddress);
  //console.log(sample);
  

  for (let i = 0; i < outerLoop; i++) {
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
  for (let i = 0; i < innerLoop; i++) {
    tokenInfo.push({
      tokenId:++tokenCounter,
      parentTokenId: parentTokenId,
      isMinted: false, 
      price:BigNumber.from(20000)
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
