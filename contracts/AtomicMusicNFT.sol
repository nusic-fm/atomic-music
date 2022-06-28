// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AtomicMusicNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PER_TXT = 5; // Mint per Transaction
    uint256 public constant MINT_PER_ADDR = 10; // Mint per Address

    string public defaultURI;
    string public baseURI;
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

    function setDefaultRI(string memory _defaultURI) public onlyOwner {
		defaultURI = _defaultURI;
	}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exists");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : defaultURI;
    }


    function mint(uint256 tokenQuantity) public {
        //require((price * tokenQuantity) == msg.value, "Insufficient Funds Sent" ); // Amount sent should be equal to price to quantity being minted
        for(uint16 i=0; i<tokenQuantity; i++) {
            _safeMint(msg.sender, totalMinted);
            totalMinted++;
        }
    }

}