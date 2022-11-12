import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
const addresses = require("./address.json");
//import tokenData from '../../data/child-info-data.json';
import tokenData from '../../data/mc-child-info-zero-prices.json'; 
import { NFTMock, NFTMock__factory } from '../../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
let nftMock:NFTMock;

interface TokenInfo {
  id: string;
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
  price: BigNumber;
}

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const NFTMock:NFTMock__factory = await ethers.getContractFactory("NFTMock");
  nftMock = await NFTMock.attach(addresses.nftAddress);
  console.log(tokenData);
  console.log(tokenData.tokenRoots);
  
  let tokenRoots = tokenData.tokenRoots;
  for (let i = 0; i < tokenRoots.length; i++) {
    let tokenInfo:TokenInfo[] = [];
    for (let j = 0; j < tokenRoots[i].children.length; j++) {
      let child = tokenRoots[i].children[j];
      tokenInfo.push({
        id: "",
        tokenId: child.tokenId,
        parentTokenId: tokenRoots[i].tokenId,
        isMinted: false, 
        price: ethers.utils.parseEther(child.price)
      });
       
    }
    console.log("i = ",i);
    console.log(tokenInfo);
    const txt = await nftMock.addChildMetadata(tokenRoots[i].tokenId, ethers.utils.parseEther(tokenRoots[i].price),tokenInfo);
    console.log("txt.hash = ",txt.hash);
    const txtReceipt = await txt.wait();
    console.log("txtReceipt = ",txtReceipt); 
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
