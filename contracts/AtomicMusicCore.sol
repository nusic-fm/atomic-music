// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


interface AtomicMusicCore {
  function setChild(AtomicMusicCore childAddress, uint tokenId, uint childTokenId, bool pending) external;
  function nftOwnerOf(uint256 tokenId) external view returns (address, uint256);
  function ownerOf(uint256 tokenId) external view returns(address);
  function findRootOwner(uint id) external view returns(address);
  function isApprovedOrOwner(address addr, uint id) external view returns(bool);
  function removeChild(uint256 tokenId, address childAddress, uint256 childTokenId) external;
  function isAtomicMusicCore() external pure returns(bool);
}