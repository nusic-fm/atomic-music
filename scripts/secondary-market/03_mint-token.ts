import { ethers } from 'hardhat';
import { NFTMock, NFTMock__factory } from '../../typechain';
const addresses = require("./address.json");
/*
* Main deployment script to deploy all the relevent contracts
*/

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const NFTMock:NFTMock__factory =  await ethers.getContractFactory("NFTMock");
  const nftMock:NFTMock = await NFTMock.attach(addresses.nftAddress);

  const amount = ethers.utils.parseEther("0.00")
  const txt = await nftMock.mint(
            addr2.address, 4,0, "myid1",
            "https://gateway.pinata.cloud/ipfs/QmQ89xevkyDy1Nn99ennYEYRhXoswBkfafozqNdYhQT4PN/14.json", 
            {value: amount});
  console.log("mint child txt.hash = ",txt.hash);
  const txtReceipt = await txt.wait();
  console.log("mint child txtReceipt = ",txtReceipt);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
