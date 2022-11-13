// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract MasterContract is Ownable {
    using Address for address;
    using Strings for uint256;


    address public manager;
    address public user;

    ERC20 WETH;
    ERC721 nftCollection;
    uint256 gasCharge = 0.01 ether;
    uint256 public marketPlaceShare = 2000; // 10000 = 100

    mapping(address => uint256) public userBalance;
    uint256 public marketPlanceBalance;

    event OfferAccepted(address buyer, address seller, uint256 amount, uint256 mareketPlaceShare, uint256 tokenId);

    modifier onlyOwnerOrManager() {
        require((owner() == msg.sender) || (manager == msg.sender), "Caller needs to Owner or Manager");
        _;
    }

    constructor(address _manager, address _wethAddress, address _nftCollectionAddress){
        manager = _manager;
        WETH = ERC20(_wethAddress);
        nftCollection = ERC721(_nftCollectionAddress);
    }

    function setManager(address _manager) public onlyOwner{
        manager = _manager;
    }

    function acceptTokenOffer(address buyer, address seller, uint256 amount, uint256 tokenId) public onlyOwnerOrManager {
        uint256 allowance = WETH.allowance(buyer, address(this));
        require(allowance >= amount,"Insufficient approval for funds");
        bool success = WETH.transferFrom(buyer, address(this), amount);

        uint256 share = calculateMarketPlaceShare(amount);
        userBalance[seller] = amount - share;
        marketPlaceShare+=share;


       address approvedOperator = nftCollection.getApproved(tokenId);
       require(approvedOperator != address(0) &&  approvedOperator == address(this),"Marketplace is has no approval token transfer");

       nftCollection.safeTransferFrom(seller, buyer, tokenId);
       //nftCollection.approve(to, tokenId);
       emit OfferAccepted(buyer, seller, amount, share, tokenId);

    }

    function calculateMarketPlaceShare(uint256 _amount) internal view returns (uint256){
        return _amount * marketPlaceShare/10000;
    }

    function withdraw() public onlyOwner {
        require(manager != address(0),"NULL Address Provided");
        WETH.transfer(manager, WETH.balanceOf(address(this)));
    }
}