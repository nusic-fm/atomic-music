// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AtomicMusicCore.sol";

contract AtomicMusicNFT is ERC721Enumerable, AtomicMusicCore, Ownable {
    using Address for address;
    using Strings for uint256;
    
    struct Child {
        address contractAddress;
        uint256 tokenId;
        address baseAddr;
        bytes8 equipSlot;
        bool pending;
    }

    struct NftOwner {
        address contractAddress;
        uint256 tokenId;
    }

    struct RoyaltyData {
        address royaltyAddress;
        uint32 numerator;
        uint32 denominator;
    }

    bytes32 private _nestFlag = keccak256(bytes("NEST"));
    RoyaltyData private _royalties;

    mapping(uint256 => NftOwner) private _nftOwners;
    mapping(uint256 => Child[]) private _children;
    uint256[] public rootTokens;

    event ParentRemoved(address parentAddress, uint parentTokenId, uint childTokenId);
    event ChildRemoved(address childAddress, uint parentTokenId, uint childTokenId);

    string public baseURI;
    string public defaultURI;
    uint256 public totalMinted;

    constructor(string memory _defaultURI) ERC721("AtomicMusicNFT","AMNFT"){
        defaultURI = _defaultURI;
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

    function nftOwnerOf(uint256 tokenId) public view override returns (address, uint256) {
        NftOwner memory owner = _nftOwners[tokenId];
        //require(owner.contractAddress != address(0), "ERC721: owner query for nonexistent token");
        return (owner.contractAddress, owner.tokenId);
    }

    function ownerOf(uint256 tokenId) public view virtual override(ERC721,AtomicMusicCore) returns (address) {
        return ERC721.ownerOf(tokenId);
    }

    // change to ERC 165 implementation of IRMRKCore
    function isAtomicMusicCore() public pure override returns (bool){
        return true;
    }

    function findRootOwner(uint id) public view override returns(address) {
        //sloads up the chain, each sload operation is 2.1K gas, not great
        //returns entry in 'owner' field in the event 'owner' does not implement isRMRKCore()
        //Currently not really functional, will probably be scrapped.
        //Currently returns `ownerOf` if 'owner' in struct is 0
        address root;
        address ownerAdd;
        uint ownerId;
        (ownerAdd, ownerId) = nftOwnerOf(id);

        if(ownerAdd == address(0)) {
        return ownerOf(id);
        }

        AtomicMusicCore nft = AtomicMusicCore(ownerAdd);

        try nft.isAtomicMusicCore() {
            nft.findRootOwner(id);
        }

        catch (bytes memory) {
            root = ownerAdd;
        }

        return root;
    }

    function childrenOf (uint256 parentTokenId) public view returns (Child[] memory) {
        Child[] memory children = _children[parentTokenId];
        return children;
    }

    function removeParent(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");

        delete(_nftOwners[tokenId]);
        (address owner, uint parentTokenId) = nftOwnerOf(tokenId);

        AtomicMusicCore(owner).removeChild(parentTokenId, address(this), tokenId);

        emit ParentRemoved(owner, parentTokenId, tokenId);
    }

    function removeChild(uint256 tokenId, address childAddress, uint256 childTokenId) public override{
        Child[] memory children = childrenOf(tokenId);
        uint i;
        while (i<children.length) {
        if (children[i].contractAddress == childAddress && children[i].tokenId == childTokenId) {
            //Remove item from array, does not preserve order.
            //Double check this, hacky-feeling set to array storage from array memory.
            _children[tokenId][i] = children[children.length-1];
            _children[tokenId].pop();
        }
        i++;
        }

        emit ChildRemoved(childAddress, tokenId, childTokenId);

    }

    function acceptChild(uint256 tokenId, address childAddress, uint256 childTokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "RMRKCore: Attempting to accept a child in non-owned NFT");
        Child[] memory children = childrenOf(tokenId);
        uint i = 0;
        while (i<children.length) {
            if (children[i].contractAddress == childAddress && children[i].tokenId == childTokenId) {
            _children[tokenId][i].pending = false;
            }
            i++;
        }
    }

    function mint(address to, uint256 tokenId, uint256 destId, string memory _data) public virtual {

        //Gas saving here from string > bytes?
        if (keccak256(bytes(_data)) == _nestFlag) {
            _mintNest(to, tokenId, destId);
        }
        else{
            _safeMint(to, tokenId);
            rootTokens.push(tokenId);
        }
    }

    function _mintNest(address to, uint256 tokenId, uint256 destId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");
        require(to.isContract(), "Is not contract");
        AtomicMusicCore destContract = AtomicMusicCore(to);
        //require(destContract.isRMRKCore(), "Not RMRK Core"); //Implement supportsInterface RMRKCore

        address rootOwner = destContract.ownerOf(destId);
        
        _safeMint(rootOwner, tokenId);
        

        _nftOwners[tokenId] = NftOwner({
            contractAddress: to,
            tokenId: destId
        });

        bool pending = !destContract.isApprovedOrOwner(msg.sender, destId);

        destContract.setChild(this, destId, tokenId, pending);
    }

    function _burn(uint256 tokenId) internal virtual override {
        
        super._burn(tokenId);
        delete _nftOwners[tokenId];
    }

    function setChild(AtomicMusicCore childAddress, uint parentTokenId, uint childTokenId, bool isPending) public override {
        (address parent, ) = childAddress.nftOwnerOf(childTokenId);
        require(parent == address(this), "Parent-child mismatch");

        //if parent token Id is same root owner as child
        Child memory child = Child({
            contractAddress: address(childAddress),
            tokenId: childTokenId,
            baseAddr: address(0),
            equipSlot: bytes8(0),
            pending: isPending
        });
        _children[parentTokenId].push(child);
    }

    function getRoyaltyData() public view returns(address royaltyAddress, uint256 numerator, uint256 denominator) {
        RoyaltyData memory data = _royalties;
        return(data.royaltyAddress, uint256(data.numerator), uint256(data.denominator));
    }

    function setRoyaltyData(address _royaltyAddress, uint32 _numerator, uint32 _denominator) external virtual {
        _royalties = RoyaltyData ({
            royaltyAddress: _royaltyAddress,
            numerator: _numerator,
            denominator: _denominator
        });
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address owner = this.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender);
    }

    //re-implement isApprovedForAll
    function isApprovedOrOwner(address spender, uint256 tokenId) public view override returns (bool) {
        bool res = _isApprovedOrOwner(spender, tokenId);
        return res;
    }

}