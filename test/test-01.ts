import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from '@ethersproject/wallet';
import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import { AtomicMusicMCNFT, AtomicMusicMCNFT__factory } from '../typechain';

var crypto = require('crypto');

describe("Nusic Wave Forms NFT Deployed: Before any Sales round started", function () {

  let atomicMusicMCNFT:AtomicMusicMCNFT;
  let _accountList:Wallet[] = [];
  before(async()=>{
    const [owner,addr1] = await ethers.getSigners();

    const AtomicMusicMCNFT:AtomicMusicMCNFT__factory =  await ethers.getContractFactory("AtomicMusicMCNFT");
    atomicMusicMCNFT = await AtomicMusicMCNFT.deploy("The Point of No Return","FERAL");
    await atomicMusicMCNFT.deployed(); 
  });

  it("All Constant parameters are properly set", async function () {
    const [owner,addr1] = await ethers.getSigners();
    expect((await atomicMusicMCNFT.connect(addr1).mintBlock())).to.be.equal(15744776);
    
  });

});
