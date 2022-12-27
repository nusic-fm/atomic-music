import { ethers } from 'hardhat';
import { MasterContract, MasterContract__factory, WETHMock, WETHMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  const WETHMock:WETHMock__factory =  await ethers.getContractFactory("WETHMock");
  const wethMock:WETHMock = await WETHMock.attach(addresses.wethAddress);
  console.log("WETHMock deployed to:", wethMock.address);

  const balanceOfUser = await wethMock.balanceOf(addr4.address);
  console.log("wethMock.balanceOf(addr4.address) = ",balanceOfUser.toString());
  
  const balanceOfMarketPlace = await wethMock.balanceOf(addresses.masterContractAddress);
  console.log("wethMock.balanceOfMarketPlace = ",balanceOfMarketPlace.toString());

  const balanceOfOwner = await wethMock.balanceOf(owner.address);
  console.log("wethMock.balanceOf = ",balanceOfOwner.toString());
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
