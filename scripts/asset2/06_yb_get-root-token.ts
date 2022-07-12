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


async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.attach(addresses.nftAddress);

  const isRoot = await atomicMusicYBNFT._rootTokens(0);
  console.log("isRoot = ",isRoot);

  const rootTokenInfo = await atomicMusicYBNFT._rootTokenInfo(0);
  console.log("rootTokenInfo = ",rootTokenInfo);
  
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
