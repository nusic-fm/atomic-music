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

    ERC20 public WETH;
    ERC721 public nftCollection;
    uint256 public marketPlaceShare = 5000; // 10000 = 100

    mapping(address => uint256) public userBalance;
    uint256 public marketPlaceBalance;

    bool public paused = false;

    event OfferAccepted(address buyer, address seller, uint256 amount, uint256 mareketPlaceShare, uint256 tokenId);
    event UserWithdrawal(address user, address to, uint256 amount);

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

    function setMarketPlaceShare(uint256 _marketPlaceShare) public onlyOwnerOrManager {
        require(_marketPlaceShare <= 10000,"Market Place Share can not be more than 100%");
        marketPlaceShare = _marketPlaceShare;
    }

    function setNFTCollection(address _nftCollectionAddress) public onlyOwnerOrManager {
        require(_nftCollectionAddress != address(0),"NULL Address Provided");
        nftCollection = ERC721(_nftCollectionAddress);
    }

    function setWETH(address _wethAddress) public onlyOwnerOrManager {
        require(_wethAddress != address(0),"NULL Address Provided");
        WETH = ERC20(_wethAddress);
    }

    function setPause(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function acceptTokenOffer(address buyer, address seller, uint256 amount, uint256 tokenId) public onlyOwnerOrManager {
        require(!paused,"Contract Paused");
        uint256 allowance = WETH.allowance(buyer, address(this));
        require(allowance >= amount,"Insufficient approval for funds");
        bool success = WETH.transferFrom(buyer, address(this), amount);

        uint256 share = calculateMarketPlaceShare(amount);
        userBalance[seller]+= (amount - share);
        marketPlaceBalance+=share;


       address approvedOperator = nftCollection.getApproved(tokenId);
       require(approvedOperator != address(0) &&  approvedOperator == address(this),"Marketplace is has no approval token transfer");

       nftCollection.safeTransferFrom(seller, buyer, tokenId);
       emit OfferAccepted(buyer, seller, amount, share, tokenId);

    }

    function calculateMarketPlaceShare(uint256 _amount) internal view returns (uint256){
        return _amount * marketPlaceShare/10000;
    }

    function withdraw() public onlyOwnerOrManager {
        require(!paused,"Contract Paused");
        require(manager != address(0),"NULL Address Provided");
        require(marketPlaceBalance != 0,"No Balance Available");
        //WETH.transfer(manager, WETH.balanceOf(address(this)));
        WETH.transfer(manager, marketPlaceBalance);
        marketPlaceBalance = 0;
    }

    function withdrawForUser(address _userAddress, address _to) public onlyOwnerOrManager {
        require(!paused,"Contract Paused");
        require(_userAddress != address(0) && _to != address(0),"NULL Address Provided");
        require(userBalance[_userAddress] != 0,"No balance available for user");
        WETH.transfer(_to, userBalance[_userAddress]);
        emit UserWithdrawal(_userAddress, _to, userBalance[_userAddress]);
        userBalance[_userAddress] = 0;
    }
}