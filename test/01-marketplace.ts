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
    const [owner,addr1] = await ethers.getSigners();

    for(let i=0;i<_accountList.length;i++) {
      expect(await addr1.sendTransaction({
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
    const [owner,addr1,addr2] = await ethers.getSigners();

    expect(await wethMock.transfer(addr2.address,ethers.utils.parseEther("2"))).to.be.ok;
    expect(await wethMock.connect(addr2).approve(masterContract.address,ethers.utils.parseEther("1"))).to.be.ok;

    //await masterContract.acceptTokenOffer(addr2.address,_accountList[0].address,ethers.utils.parseEther("0.2"),1);

    /*
    for(let i=0;i<_accountList.length;i++) {
      expect(await nftMock.connect(_accountList[i]).approve(masterContract.address,(i+1))).to.be.ok;
    }
    */
  });

  it("Accept offer and transfer funds from buyer and token to buyer", async function () {
    const [owner,addr1,addr2] = await ethers.getSigners();

    expect(await masterContract.acceptTokenOffer(addr2.address,_accountList[0].address,ethers.utils.parseEther("0.2"),1)).to.be.ok;
  });

  it("Check Token balance and MasterContract Balance", async function () {
    const [owner,addr1,addr2] = await ethers.getSigners();

    const userBalance = await masterContract.userBalance(_accountList[0].address);
    console.log("User Balance = ", userBalance.toString());
  });

});
