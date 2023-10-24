// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

abstract contract Mintable is Ownable, IERC721 {
    /**
     * @notice Mint a token for an address while setting its metadata URI.
     * @param _to   Address to mint to
     * @param _uri  Token metadata URI
     * @return Token id
     */
    function mint(address _to, string memory _uri) public virtual returns (uint256);
}
