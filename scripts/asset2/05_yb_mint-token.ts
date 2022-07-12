import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { AtomicMusicYBNFT, AtomicMusicYBNFT__factory, USDCMock, USDCMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, add1] = await ethers.getSigners();

  const USDCMock:USDCMock__factory = await ethers.getContractFactory("USDCMock");
  const uSDCMock:USDCMock = await USDCMock.attach(addresses.usdcAddress);

  const AtomicMusicYBNFT:AtomicMusicYBNFT__factory = await ethers.getContractFactory("AtomicMusicYBNFT");
  const atomicMusicYBNFT:AtomicMusicYBNFT = await AtomicMusicYBNFT.attach(addresses.nftAddress);

  //const amount = await atomicMusicNFT.price();
  //const amount = ethers.utils.parseEther("0.04")
  const amount = BigNumber.from(parseFloat("151.44")*1000000);
  //const amount2 = BigNumber.from(parseFloat("330.42")*1000000);
  const usdcApprovalTrasaction = await uSDCMock.approve(atomicMusicYBNFT.address, amount);

  console.log("usdc Approval Trasaction txt.hash = ",usdcApprovalTrasaction.hash);
  const usdcApprovalTrasactionReceipt = await usdcApprovalTrasaction.wait();
  console.log("usdcApprovalTrasactionReceipt = ",usdcApprovalTrasactionReceipt);
  
  const txt = await atomicMusicYBNFT.mint(5,0);
  console.log("mint child txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("mint child txtReceipt = ",txtReceipt);

  /*
  const txt = await atomicMusicNFT.mint(4,0);
  console.log("mint child txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("mint child txt.hash = ",txtReceipt);
  */
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
