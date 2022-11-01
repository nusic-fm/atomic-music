import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicMCNFT, AtomicMusicMCNFT__factory, AtomicMusicNFT, AtomicMusicNFT__factory } from '../../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicMCNFT:AtomicMusicMCNFT__factory = await ethers.getContractFactory("AtomicMusicMCNFT");

  //https://gateway.pinata.cloud/ipfs/QmQ89xevkyDy1Nn99ennYEYRhXoswBkfafozqNdYhQT4PN/
  const atomicMusicMCNFT:AtomicMusicMCNFT = await AtomicMusicMCNFT.connect(owner).deploy("The Point of No Return","FERAL");
  await atomicMusicMCNFT.connect(owner).deployed();
  console.log("AtomicMusicNFT deployed to:", atomicMusicMCNFT.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
