import { ethers } from 'hardhat';
import { NFTMock, NFTMock__factory, WETHMock, WETHMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

  const WETHMock:WETHMock__factory =  await ethers.getContractFactory("WETHMock");
  const wethMock:WETHMock = await WETHMock.attach(addresses.wethAddress);
  console.log("WETHMock deployed to:", wethMock.address);


  const txt = await wethMock.transfer(addr3.address,ethers.utils.parseEther("2"));
  console.log("wethMock.transfer txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  //console.log("wethMock.transfer txt.hash = ",txtReceipt);

  const txt2 = await wethMock.connect(addr3).approve(addresses.masterContractAddress,ethers.utils.parseEther("0.2"));
  console.log("wethMock.approve txt.hash = ",txt2.hash);
  const txtReceipt2 = await txt2.wait();

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
