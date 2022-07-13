import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  //https://gateway.pinata.cloud/ipfs/QmNZucC5ZvPxsoEr3Zw88HoR1MorEFPCojTV1kYfr9w59K
  //https://gateway.pinata.cloud/ipfs/QmXDP6iiTwFTUEWaV8NizypmNnnXfbqvgjB3hQnUygnBQB // new one

  const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.deploy("MFPNFT","MFP","https://gateway.pinata.cloud/ipfs/QmQ89xevkyDy1Nn99ennYEYRhXoswBkfafozqNdYhQT4PN/");
  //const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.deploy("TempMUSIC","TMNFT","https://gateway.pinata.cloud/ipfs/QmNZucC5ZvPxsoEr3Zw88HoR1MorEFPCojTV1kYfr9w59K/");
  await atomicMusicNFT.deployed();
  //"AtomicMusicNFT","AMNFT"
  console.log("AtomicMusicNFT deployed to:", atomicMusicNFT.address);
  //0xC57d6963f184Bff298d38b47276C0ECe1199f76c
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
