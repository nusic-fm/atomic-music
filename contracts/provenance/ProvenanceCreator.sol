// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";
import "./ProvenanceNFTProxy.sol";
import "./ProvenanceNFT.sol";


contract ProvenanceCreator is OwnableUpgradeable, UUPSUpgradeable {

    //Address for implementation of ProvenanceNFT
    address public immutable nftImplementation;

    address[] nftContractList;


    event ProvenanceNFTInfo(address provenanceNFT, address provenanceNFTProxy);

    constructor(address _newNftImplementation) {
        nftImplementation = _newNftImplementation;
        console.log("ProvenanceCreator::constructor - _newNftImplementation = ", _newNftImplementation);
    }

    /// @dev Initializes the proxy contract
    function initialize() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @dev Function to determine who is allowed to upgrade this contract.
    /// @param _newImplementation: unused in access check
    function _authorizeUpgrade(address _newImplementation)
        internal
        override
        onlyOwner
    {}

    function createProvenanceNFT(
        string memory name,
        string memory symbol,
        uint64 nftSize
    ) public returns (address) {
        console.log("ProvenanceCreator::createProvenanceNFT");
        ProvenanceNFTProxy newProvenance = new ProvenanceNFTProxy(nftImplementation, "");
        console.log("ProvenanceCreator::createProvenanceNFT - after proxy");
        address payable newProvenanceNFTAddress = payable(address(newProvenance));
        //newProvenance.initialize();

        ProvenanceNFT(newProvenanceNFTAddress).initialize(name, symbol);
        console.log("ProvenanceCreator::createProvenanceNFT - after initialize");
        nftContractList.push(newProvenanceNFTAddress);
        emit ProvenanceNFTInfo(nftImplementation,newProvenanceNFTAddress);

        return newProvenanceNFTAddress;
    }
    /*
    function createProvenanceNFT(
        string memory name,
        string memory symbol,
        uint64 nftSize,
        uint16 royaltyBPS,
        address payable fundsRecipient,
        address defaultAdmin,
        string memory description,
        string memory animationURI,
        string memory imageURI
    ) external returns (address) {
        ProvenanceNFTProxy newProvenance = new ProvenanceNFTProxy(nftImplementation, "");

        address payable newProvenanceNFTAddress = payable(address(newProvenance));
        //newProvenance.initialize();

        ProvenanceNFT(newProvenanceNFTAddress).initialize();
    }
    */
}