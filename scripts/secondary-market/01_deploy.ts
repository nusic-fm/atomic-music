import { ethers } from 'hardhat';
import { MasterContract, MasterContract__factory, NFTMock, NFTMock__factory, ProvenanceCreator, ProvenanceCreatorProxy, ProvenanceCreatorProxy__factory, ProvenanceCreator__factory, ProvenanceNFT, ProvenanceNFT__factory, WETHMock, WETHMock__factory } from '../../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const NFTMock:NFTMock__factory =  await ethers.getContractFactory("NFTMock");
  const nftMock:NFTMock = await NFTMock.deploy("The Point of No Return","FERAL");
  await nftMock.deployed(); 
  console.log("NFTMock deployed to:", nftMock.address);

  const WETHMock:WETHMock__factory =  await ethers.getContractFactory("WETHMock");
  const wethMock:WETHMock = await WETHMock.deploy();
  await wethMock.deployed(); 
  console.log("WETHMock deployed to:", wethMock.address);

  const MasterContract:MasterContract__factory =  await ethers.getContractFactory("MasterContract");
  const masterContract:MasterContract = await MasterContract.deploy(owner.address, wethMock.address, nftMock.address);
  await masterContract.deployed(); 
  console.log("MasterContract deployed to:", masterContract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
