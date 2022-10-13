// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "hardhat/console.sol";

contract AtomicMusicMCNFT is ERC721Pausable, ERC2981, Ownable {
    using Address for address;
    using Strings for uint256;

    struct TokenInfo {
        string id;
        uint256 tokenId;
        uint256 parentTokenId;
        bool isMinted;
        uint256 price;
    }

    mapping(uint256 => TokenInfo[]) public _childrenMetadata;
    mapping(uint256 => TokenInfo) public _rootTokenInfo;
    mapping(uint256 => bool) public _rootTokens;

    mapping(uint256 => string) private _tokenURIs;
    
    string public baseURI;
    uint256 public totalTokens;
    uint256 public totalMinted;
    uint256 public mintBlock = 15744776;

    address public admin;
    address public manager;

    event Minted(address indexed to, string id, uint256 parentTokenId, uint256 tokenId);

    constructor(string memory _name, string memory _symbol) ERC721(_name,_symbol){
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC2981,ERC721) returns (bool) {
        return interfaceId == type(ERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exists");
        return _tokenURIs[tokenId];
    }

    function childrenMetadataOf (uint256 parentTokenId) internal view returns (TokenInfo[] memory) {
        TokenInfo[] memory children = _childrenMetadata[parentTokenId];
        return children;
    }

    function addChildMetadata(uint256 rootTokenId, uint256 rootTokenPrice, TokenInfo[] memory _childrens) public onlyOwner {
        _rootTokens[rootTokenId] = true;
        _rootTokenInfo[rootTokenId] = TokenInfo({
            id:"root",
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

    function mint(address _to, uint256 tokenId, uint256 parentTokenId, string memory _id, string memory uri) public payable {
        require(tokenId != 0, "Not mintable");
        require(block.number >= mintBlock, "Mint not started");
        require(!_exists(tokenId), "Token already minted");
        require(!_exists(parentTokenId), "Parent token already minted");
        // On Ethereum All
        require(msg.sender == 0xdAb1a1854214684acE522439684a145E62505233,"This function is for Crossmint only.");
        // On Polygon Testnet
        //require(msg.sender == 0xDa30ee0788276c093e686780C25f6C9431027234, "This function is for Crossmint only.");
        for (uint256 i = 0; i < _childrenMetadata[parentTokenId].length; i++) {
            if(_childrenMetadata[parentTokenId][i].tokenId == tokenId) {
                require(msg.value == _childrenMetadata[parentTokenId][i].price, "Insufficient Funds Sent");
                _safeMint(_to, tokenId);
                _childrenMetadata[parentTokenId][i].isMinted = true;
                _childrenMetadata[parentTokenId][i].id = _id;
                _tokenURIs[tokenId] = uri;
                totalMinted++;
                emit Minted(_to, _id, parentTokenId, tokenId);
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

    function setManager(address _manager) public onlyOwner{
        manager = _manager;
    }
    
    function setAdmin(address _admin) public onlyOwner{
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

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
    
    function setPrice(uint256 tokenId, uint256 parentTokenId, uint256 price) public onlyOwner {
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

    function setRootPrice(uint256 rootTokenId, uint256 price) public onlyOwner {
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

    function setTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
        require(_exists(tokenId), "Token does not exists");
        _tokenURIs[tokenId] = uri;
    } 

    function setMintBlock(uint256 _mintBlock) public onlyOwner {
        require(_mintBlock > block.number , "Older block provided");
        mintBlock = _mintBlock;
    }  

    // ERC2981
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public onlyOwner  {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function deleteDefaultRoyalty() public onlyOwner{
        _deleteDefaultRoyalty();
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public onlyOwner {
        _setTokenRoyalty(tokenId,receiver,feeNumerator);
    }

    function resetTokenRoyalty(uint256 tokenId) public onlyOwner {
        _resetTokenRoyalty(tokenId);
    }
}