import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { USDCMock, USDCMock__factory } from '../../typechain';
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();
  
  const USDCMock:USDCMock__factory = await ethers.getContractFactory("USDCMock");
  const uSDCMock:USDCMock = await USDCMock.deploy();
  await uSDCMock.deployed();
  console.log("USDCMock deployed to:", uSDCMock.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
