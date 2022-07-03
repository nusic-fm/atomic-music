import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicNFT, AtomicMusicNFT__factory } from '../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicNFT:AtomicMusicNFT__factory = await ethers.getContractFactory("AtomicMusicNFT");
  const atomicMusicNFT:AtomicMusicNFT = await AtomicMusicNFT.deploy("ipfs://QmXsMLpKjznF3z1KsVm5tNs3E94vj4BFAyAHvD5RTWgQ1J");
  await atomicMusicNFT.deployed();

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
