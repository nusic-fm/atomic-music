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
        uint256 price;
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
   
    ERC20 public USDC;

    constructor(string memory _name, string memory _symbol, address _usdcAddress, string memory _defaultURI) ERC721(_name,_symbol){
        defaultURI = _defaultURI;
        baseURI = _defaultURI;
        USDC = ERC20(_usdcAddress);
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

    function addChildMetadata(uint256 rootTokenId, uint256 rootTokenPrice, TokenInfo[] memory _childrens) public onlyOwner {
        _rootTokens[rootTokenId] = true;
        _rootTokenInfo[rootTokenId] = TokenInfo({
            tokenId:rootTokenId,
            parentTokenId: 0,
            isMinted: false,
            price: rootTokenPrice
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

    function receiveFunds(address sender, uint256 price) private {
        uint256 allowance = USDC.allowance(sender, address(this));
        require(allowance >= price,"Insufficient approval for funds");
        USDC.transferFrom(sender, address(this), price);
    }
    function mintRoot(uint256 tokenId) public payable {
        require(!_exists(tokenId), "Token already minted");
        require(_rootTokens[tokenId], "Token Id is not for Root token");
        require(!isChildMinted(tokenId), "Child has already been minted for this token");
        receiveFunds(msg.sender, _rootTokenInfo[tokenId].price);
        _safeMint(msg.sender, tokenId);
        _rootTokenInfo[tokenId].isMinted = true;
        totalMinted++;
    }

    function mint(uint256 tokenId, uint256 parentTokenId) public payable {
        require(!_exists(tokenId), "Token already minted");
        require(!_exists(parentTokenId), "Parent token already minted");
        require(!isParentMinted(parentTokenId), "Parent has already been minted for this token");

        for (uint256 i = 0; i < _childrenMetadata[parentTokenId].length; i++) {
            if(_childrenMetadata[parentTokenId][i].tokenId == tokenId) {
                receiveFunds(msg.sender, _childrenMetadata[parentTokenId][i].price);
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
        USDC.transfer(ownerAddress, USDC.balanceOf(address(this)));
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function setPrice(uint256 tokenId, uint256 parentTokenId, uint256 price) public onlyOwner{
        bool found = false;
        for (uint256 i = 0; i < _childrenMetadata[parentTokenId].length; i++) {
            if(_childrenMetadata[parentTokenId][i].tokenId == tokenId) {
                require(!_childrenMetadata[parentTokenId][i].isMinted, "Token already minted");
                _childrenMetadata[parentTokenId][i].price = price;
                found = true;
            }
        }
        require(found, "Parent and Child token id mismatch");
    }

    function setRootPrice(uint256 rootTokenId, uint256 price) public onlyOwner{
        require(!_rootTokenInfo[rootTokenId].isMinted, "Token already minted");
        require(_rootTokens[rootTokenId], "Not a Root tokens");
        _rootTokenInfo[rootTokenId].price = price;
    }

    function getPrice(uint256 tokenId, uint256 parentTokenId) public view returns (uint256) {
        for (uint256 i = 0; i < _childrenMetadata[parentTokenId].length; i++) {
            if(_childrenMetadata[parentTokenId][i].tokenId == tokenId) {
                return _childrenMetadata[parentTokenId][i].price;
            }
        }
        revert("Parent and Child token id mismatch");
    }   
}