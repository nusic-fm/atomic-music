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

let childInfo:TokenInfo[] = [];
let tokenCounter = 0;
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  atomicMusicNFT = await AtomicMusicNFT.attach(addresses.nftAddress);
  console.log(sample);
  //childrenRecursion(BigNumber.from(sample.name),sample.children);
  
  //generateChilrensWithExplicitTokenId(treeData);
  generateChilrensWithImplictTokenId(treeData);

  console.log(childInfo);
  /*
  for (let index = 0; index < childInfo.length; index++) {
    const element = childInfo[index];
    console.log(element);
    
  }*/
  
  const txt = await atomicMusicNFT.addChildMetadata(0, childInfo, {
    gasLimit:2000000
  });
  console.log("txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("txt.hash = ",txtReceipt);
  
}

async function generateChilrensWithExplicitTokenId(sample:any) {
  childrenRecursion(sample.name,sample.children);
}

async function childrenRecursion(parentTokenId:number, children:any) {
  for (let i = 0; i < children.length; i++) {
    childInfo.push({
      tokenId:children[i].tokenId,
      parentTokenId: parentTokenId,
      isMinted:false
    });
    if(children[i].children && children[i].children.length>0) {
      childrenRecursion(children[i].name,children[i].children)
    }
  }
}


async function generateChilrensWithImplictTokenId(sample:any) {
  childrenRecursionImplict(tokenCounter,sample.children);
}

async function childrenRecursionImplict(parentTokenId:number, children:any) {
  for (let i = 0; i < children.length; i++) {
    childInfo.push({
      tokenId:++tokenCounter,
      parentTokenId: parentTokenId,
      isMinted:false
    });
    if(children[i].children && children[i].children.length>0) {
      childrenRecursionImplict(tokenCounter,children[i].children)
    }
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
