import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicYBNFT, AtomicMusicYBNFT__factory, USDCMock, USDCMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/
async function main() {
  const [owner, add1] = await ethers.getSigners();

  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.attach(addresses.nftAddress);

  const USDCMock:USDCMock__factory = await ethers.getContractFactory("USDCMock");
  const uSDCMock:USDCMock = await USDCMock.attach(addresses.usdcAddress);

  const balance = await owner.getBalance();
  console.log("Balance = ", balance.toString());

  const totalTokens = await atomicMusicYBNFT.totalTokens();
  console.log("totalTokens = ",totalTokens.toString());

  const totalMinted = await atomicMusicYBNFT.totalMinted();
  console.log("totalMinted = ",totalMinted.toString());

  const getPrice = await atomicMusicYBNFT.getPrice(3,0);
  console.log("getPrice = ", getPrice.toString());

  const balanceUSDC = await uSDCMock.balanceOf(atomicMusicYBNFT.address);
  console.log("balanceUSDC in contract = ", balanceUSDC.toString());

  const balanceUSDCUser = await uSDCMock.balanceOf(owner.address);
  console.log("balanceUSDC in User = ", balanceUSDCUser.toString());

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
