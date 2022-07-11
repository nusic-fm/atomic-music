// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./AtomicMusicCore.sol";
import "hardhat/console.sol";

contract AtomicMusicYBNFT is ERC721Pausable, Ownable {
    using Address for address;
    using Strings for uint256;

    struct TokenInfo {
        uint256 tokenId;
        uint256 parentTokenId;
        bool isMinted;
    }

    struct Child {
        address contractAddress;
        uint256 tokenId;
        address baseAddr;
        bytes8 equipSlot;
        bool pending;
    }

    struct RoyaltyData {
        address royaltyAddress;
        uint32 numerator;
        uint32 denominator;
    }

    mapping(uint256 => TokenInfo[]) public _childrenMetadata;
    mapping(uint256 => TokenInfo) public _rootTokenInfo;
    mapping(uint256 => bool) public _rootTokens;
    
    string public baseURI;
    string public defaultURI;
    uint256 public totalTokens;
    uint256 public totalMinted;

    address public admin;
    address public manager;

    uint256 public minPrice = 50e15; // 0.05
    uint256 public maxPrice = 100e15; // 0.1

    constructor(string memory _name, string memory _symbol, uint256 _minPrice, uint256 _maxPrice, string memory _defaultURI) ERC721(_name,_symbol){
        minPrice = _minPrice;
        maxPrice = _maxPrice;
        defaultURI = _defaultURI;
        baseURI = _defaultURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory URI) public onlyOwner {
		baseURI = URI;
	}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exists");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : defaultURI;
    }

    function childrenMetadataOf (uint256 parentTokenId) internal view returns (TokenInfo[] memory) {
        TokenInfo[] memory children = _childrenMetadata[parentTokenId];
        return children;
    }

    function addChildMetadata(uint256 rootTokenId, TokenInfo[] memory _childrens) public onlyOwner {
        _rootTokens[rootTokenId] = true;
        _rootTokenInfo[rootTokenId] = TokenInfo({
            tokenId:rootTokenId,
            parentTokenId: 0,
            isMinted: false
        });
        totalTokens++;
        for (uint256 i = 0; i < _childrens.length; i++) {
            _childrenMetadata[_childrens[i].parentTokenId].push(_childrens[i]);
            totalTokens++;
        }
    }

    function getChildrenMetadata(uint256 tokenId) public view returns(TokenInfo[] memory) {
        return _childrenMetadata[tokenId];
    }

    function mintRoot(uint256 tokenId) public payable {
        require(!_exists(tokenId), "ERC721: token already minted");
        require(_rootTokens[tokenId], "Token Id is not for Root token");
        require(!isChildMinted(tokenId), "Child has already been minted for this token");
        require(msg.value >= minPrice && msg.value <= maxPrice, "Insufficient Funds Sent" );
        _safeMint(msg.sender, tokenId);
        if(_rootTokens[tokenId]) {
            _rootTokenInfo[tokenId].isMinted = true;
        }
        totalMinted++;
    }

    function mint(uint256 tokenId, uint256 parentTokenId) public payable {
        require(!_exists(tokenId), "ERC721: token already minted");
        require(!_exists(parentTokenId), "Parent token already minted");
        require(!isParentMinted(parentTokenId), "Parent has already been minted for this token");
        require(msg.value >= minPrice && msg.value <= maxPrice, "Insufficient Funds Sent" );

        for (uint256 i = 0; i < _childrenMetadata[parentTokenId].length; i++) {
            if(_childrenMetadata[parentTokenId][i].tokenId == tokenId) {
                _safeMint(msg.sender, tokenId);
                _childrenMetadata[parentTokenId][i].isMinted = true;
                totalMinted++;
                return;
            }
        }
        revert("Token Id provided is not valid child of Parent Id provided");
    }

    function isParentMinted(uint256 parentTokenId) public view returns (bool) {
        if(_rootTokens[parentTokenId] && _rootTokenInfo[parentTokenId].isMinted) {
            return true;
        }
        return false;
    }

    function isChildMinted(uint256 tokenId) public view returns (bool) {
        TokenInfo[] memory children = _childrenMetadata[tokenId];
        for (uint256 i = 0; i < children.length; i++) {
            if(children[i].isMinted) {
                return true;
            }
            if(_childrenMetadata[children[i].tokenId].length>0) {
                bool childMinted = isChildMinted(children[i].tokenId);
                if(childMinted){
                    return true;
                }
            }
        }
        return false;
    }

    function setManager(address _manager) public {
        manager = _manager;
    }
    
    function setAdmin(address _admin) public {
        admin = _admin;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdraw() public onlyOwner {
        address ownerAddress = owner(); 
        require(ownerAddress != address(0),"NULL Address Provided");
        (bool sent, ) = ownerAddress.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw Ether");
    }

    function setMinPrice(uint256 _minPrice) public onlyOwner {
        minPrice = _minPrice;
    }

    function setMaxPrice(uint256 _maxPrice) public onlyOwner {
        maxPrice = _maxPrice;
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
    
}