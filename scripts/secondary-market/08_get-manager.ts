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


  const managerAddress = await masterContract.manager();
  console.log("managerAddress = ",managerAddress);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
