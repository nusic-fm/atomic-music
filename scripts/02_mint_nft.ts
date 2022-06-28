import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.attach("0x5293EA6E7E0a28964Fbf43A6313C7CD0C33c49c7");
  
  console.log("AtomicMusicNFT Address:", atomicMusicNFT.address);

  const txt1:ContractTransaction = await atomicMusicNFT.mint(5);
  console.log("NFT mint Transaction Hash = ", txt1.hash);
  const txtReceipt:ContractReceipt = await txt1.wait();
  console.log("NFT mint Transaction Receipt = ", txtReceipt);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
