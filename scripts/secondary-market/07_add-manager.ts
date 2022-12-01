import { ethers } from 'hardhat';
import { MasterContract, MasterContract__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();

  const MasterContract:MasterContract__factory =  await ethers.getContractFactory("MasterContract");
  const masterContract:MasterContract = await MasterContract.attach(addresses.masterContractAddress);
  console.log("MasterContract Address to:", masterContract.address);


  const txt = await masterContract.setManager("0x07C920eA4A1aa50c8bE40c910d7c4981D135272B");
  console.log("masterContract.setManager txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  //console.log("wethMock.transfer txt.hash = ",txtReceipt);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
