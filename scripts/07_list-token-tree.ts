import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
let atomicMusicNFT:AtomicMusicNFT;

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  atomicMusicNFT = await AtomicMusicNFT.attach("0xC57d6963f184Bff298d38b47276C0ECe1199f76c");
  
  console.log("AtomicMusicNFT Address:", atomicMusicNFT.address);
  let tokenId:BigNumber = BigNumber.from(1);
  const children = await atomicMusicNFT.childrenOf(tokenId);
  await childrenRecursion(1, tokenId,children);
}

async function childrenRecursion(level: number,parentTokenId:BigNumber, children:any) {
  console.log(`${addSpaces(level)}There are ${children.length} Children of TokenId ${parentTokenId}`);
  for (let index = 0; index < children.length; index++) {
    const element = children[index];
    console.log(`${addSpaces(level)}|`);
    console.log(`${addSpaces(level)}|--- Child Token id: ${element.tokenId.toString()}`);
    console.log(`${addSpaces(level)}|--- Child Token's Contract Id : ${element.contractAddress}`);
    const childrenAtNextLevel = await atomicMusicNFT.childrenOf(element.tokenId);
    if(childrenAtNextLevel.length>0) {
      await childrenRecursion(level+1,element.tokenId,childrenAtNextLevel);
    }
    
  }
}

function addSpaces(level:number) {
  let totalSpaces = level*3;
  let spaces = "";
  for (let i = 0; i < level; i++) {
    spaces +="|";
    for (let j = 0; j < 3; j++) {
      spaces +=" "; 
    }  
  }
  return spaces;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
