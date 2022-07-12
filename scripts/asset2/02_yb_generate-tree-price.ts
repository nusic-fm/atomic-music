import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicYBNFT, AtomicMusicYBNFT__factory } from '../../typechain';
const addresses = require("./address.json");
//import tokenData from '../../data/child-info-data-yb.json';
import tokenData from '../../data/child-info-data-yb-prices.json';
/*
* Main deployment script to deploy all the relevent contracts
*/

interface TokenInfo {
  tokenId: number;
  parentTokenId: number;
  isMinted:boolean;
  price: BigNumber;
}

async function main() {
  const [owner, add1] = await ethers.getSigners();

  //const data = "247.81";
  //console.log(parseFloat(data));
  //console.log(parseFloat(data)*1000000);

  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.attach(addresses.nftAddress);
  console.log(tokenData);
  console.log(tokenData.tokenRoots);


  let tokenRoots = tokenData.tokenRoots;
  for (let i = 0; i < tokenRoots.length; i++) {
    let tokenInfo:TokenInfo[] = [];
    for (let j = 0; j < tokenRoots[i].children.length; j++) {
      let child = tokenRoots[i].children[j];
      tokenInfo.push({
        tokenId: child.tokenId,
        parentTokenId: tokenRoots[i].tokenId,
        isMinted: false, 
        price: BigNumber.from(parseFloat(child.price)*1000000)
      });
       
    }
    console.log("i = ",i);
    console.log(tokenInfo);
    const txt = await atomicMusicYBNFT.addChildMetadata(tokenRoots[i].tokenId, BigNumber.from(parseFloat(tokenRoots[i].price)*1000000),tokenInfo);
    console.log("txt.hash = ",txt.hash);
    const txtReceipt = await txt.wait();
    console.log("txt.hash = ",txtReceipt); 
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
