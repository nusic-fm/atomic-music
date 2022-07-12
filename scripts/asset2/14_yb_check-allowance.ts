import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { USDCMock, USDCMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();
  
  const USDCMock:USDCMock__factory = await ethers.getContractFactory("USDCMock");
  const uSDCMock:USDCMock = await USDCMock.attach(addresses.usdcAddress);
  console.log("USDCMock Address:", uSDCMock.address);

  const allowance = await uSDCMock.allowance(owner.address,addresses.nftAddress);
  console.log("allowance = ",allowance.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
