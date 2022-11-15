import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from '@ethersproject/wallet';
import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { MasterContract, MasterContract__factory, NFTMock, NFTMock__factory, WETHMock__factory } from '../typechain';
import { WETHMock } from '../typechain/WETHMock';
import tokenData from '../data/mc-child-info-zero-prices.json'; 

var crypto = require('crypto');

describe("Nusic Secondary Market Place", function () {

  let nftMock:NFTMock;
  let masterContract:MasterContract;
  let wethMock: WETHMock;
  let _accountList:Wallet[] = [];
  before(async()=>{
    const [owner,addr1] = await ethers.getSigners();

    const NFTMock:NFTMock__factory =  await ethers.getContractFactory("NFTMock");
    nftMock = await NFTMock.deploy("The Point of No Return","FERAL");
    await nftMock.deployed(); 

    const WETHMock:WETHMock__factory =  await ethers.getContractFactory("WETHMock");
    wethMock = await WETHMock.deploy();
    await wethMock.deployed(); 

    const MasterContract:MasterContract__factory =  await ethers.getContractFactory("MasterContract");
    masterContract = await MasterContract.deploy(owner.address, wethMock.address, nftMock.address);
    await masterContract.deployed(); 

    const addressToBeGenerated = 14;
    console.log("Accounts Generated = ",addressToBeGenerated);
    for(let i=0;i<addressToBeGenerated;i++) {
      var id = crypto.randomBytes(32).toString('hex');
      var privateKey = "0x"+id;
      var wallet = new ethers.Wallet(privateKey,ethers.provider);
      _accountList.push(wallet);
    }
  });

  it("Generated Metadata for NFT Tokens", async function () {
    const [owner,addr1] = await ethers.getSigners();
    
    interface TokenInfo {
      id: string;
      tokenId: number;
      parentTokenId: number;
      isMinted:boolean;
      price: BigNumber;
    }

    let tokenRoots = tokenData.tokenRoots;
    for (let i = 0; i < tokenRoots.length; i++) {
      let tokenInfo:TokenInfo[] = [];
      for (let j = 0; j < tokenRoots[i].children.length; j++) {
        let child = tokenRoots[i].children[j];
        tokenInfo.push({
          id: "",
          tokenId: child.tokenId,
          parentTokenId: tokenRoots[i].tokenId,
          isMinted: false, 
          price: ethers.utils.parseEther(child.price)
        });
        
      }
      //console.log("i = ",i);
      //console.log(tokenInfo);
      expect(await nftMock.addChildMetadata(tokenRoots[i].tokenId, ethers.utils.parseEther(tokenRoots[i].price),tokenInfo)).to.be.ok; 
    }
  });

  it("Minted NFT Token for each address", async function () {
    const [owner,addr1] = await ethers.getSigners();

    const amount = ethers.utils.parseEther("0");

    for (let index = 0; index < _accountList.length; index++) {
      let tokenConter = index+1;
      expect(await nftMock.mint(
        _accountList[index].address, (tokenConter),0, "myid"+tokenConter,
        `https://gateway.pinata.cloud/ipfs/QmQ89xevkyDy1Nn99ennYEYRhXoswBkfafozqNdYhQT4PN/${tokenConter}.json`, 
        {value: amount})).to.be.ok;
    }
    
  });

  it("Transfer ETH for Gas in Wallets", async function () {
    const [owner,addr1,addr2] = await ethers.getSigners();

    for(let i=0;i<_accountList.length;i++) {
      expect(await addr2.sendTransaction({
        to:_accountList[i].address,
        value: ethers.utils.parseEther("0.08")
      })).to.be.ok;
    }
  });

  it("Give Approval to MasterContract for each token transfer", async function () {

    for(let i=0;i<_accountList.length;i++) {
      expect(await nftMock.connect(_accountList[i]).approve(masterContract.address,(i+1))).to.be.ok;
    }
  });

  it("Approval of WTH by Buyer", async function () {
    const [owner,addr1,addr2,addr3] = await ethers.getSigners();

    expect(await wethMock.transfer(addr3.address,ethers.utils.parseEther("2"))).to.be.ok;
    expect(await wethMock.connect(addr3).approve(masterContract.address,ethers.utils.parseEther("1"))).to.be.ok;
  });

  it("Accept offer should be failed as called is not owner or manager", async function () {
    const [owner,addr1,addr2,addr3] = await ethers.getSigners();

    await expect(masterContract.connect(addr1).acceptTokenOffer(addr3.address,_accountList[0].address,ethers.utils.parseEther("0.2"),1)).to.be.revertedWith("Caller needs to Owner or Manager");
  });

  it("Set manager should fail as caller in not owner", async function () {
    const [owner,addr1,addr2,addr3] = await ethers.getSigners();

    await expect(masterContract.connect(addr1).setManager(addr2.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Set Addr1 to manager of master contract successfully", async function () {
    const [owner,addr1,addr2] = await ethers.getSigners();

    expect(await masterContract.connect(owner).setManager(addr1.address)).to.be.ok;
  });
  
  it("Addr1 Accept offer and transfer funds from buyer and token to buyer successfully", async function () {
    const [owner,addr1,addr2,addr3] = await ethers.getSigners();

    expect(await masterContract.connect(addr1).acceptTokenOffer(addr3.address,_accountList[0].address,ethers.utils.parseEther("0.2"),1)).to.be.ok;
  });
  
  it("Check Token balance and MasterContract Balance", async function () {
    const [owner,addr1,addr2] = await ethers.getSigners();

    const userBalance = await masterContract.userBalance(_accountList[0].address);
    const masterContractBalance = await masterContract.marketPlanceBalance();
    console.log("User Balance = ", userBalance.toString());
    console.log("MasterContract Balance = ", masterContractBalance.toString());
  });

});
