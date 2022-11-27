import { ethers } from 'hardhat';
import { MasterContract, MasterContract__factory, NFTMock, NFTMock__factory, WETHMock, WETHMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();
  
  /*
  const NFTMock:NFTMock__factory =  await ethers.getContractFactory("NFTMock");
  const nftMock:NFTMock = await NFTMock.deploy("The Point of No Return","FERAL");
  await nftMock.deployed(); 
  console.log("NFTMock deployed to:", nftMock.address);

  const WETHMock:WETHMock__factory =  await ethers.getContractFactory("WETHMock");
  const wethMock:WETHMock = await WETHMock.deploy();
  await wethMock.deployed(); 
  console.log("WETHMock deployed to:", wethMock.address);
  */
  const MasterContract:MasterContract__factory =  await ethers.getContractFactory("MasterContract");
  
  // All deployed together
  //const masterContract:MasterContract = await MasterContract.deploy(owner.address, wethMock.address, nftMock.address);
  
  // Using existing testnet addresses
  //const masterContract:MasterContract = await MasterContract.deploy(owner.address, addresses.wethAddress, addresses.nftAddress);

  // Using existing mainnet addresses
  const masterContract:MasterContract = await MasterContract.deploy(owner.address, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0x51d339788b11f64b0c29b7afa0b13b23f9313258");
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
