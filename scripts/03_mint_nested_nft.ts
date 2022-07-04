import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.attach("0xC57d6963f184Bff298d38b47276C0ECe1199f76c");
  
  console.log("AtomicMusicNFT Address:", atomicMusicNFT.address);

  const txt1:ContractTransaction = await atomicMusicNFT.mint("0xC57d6963f184Bff298d38b47276C0ECe1199f76c",15,11,"NEST");
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
