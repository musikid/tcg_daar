// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

/**
 * @title Card
 * @dev Card contract
 */
contract Card is ERC721, Ownable {
    // Card id counter
    uint256 private _idCounter = 0;
    // Base URI
    string private _baseuri;

    /**
     * @dev Constructor
     * @param baseURI   Base URI
     */
    constructor(
        string memory baseURI
    ) ERC721("Card", "CARD") Ownable(_msgSender()) {
        _baseuri = baseURI;
    }

    /**
     * @dev Mint a new card
     * @param _to   Address to mint to
     */
    function mint(address _to) public onlyOwner returns (uint256) {
        uint256 cardNumber = _idCounter;
        _idCounter++;
        _safeMint(_to, cardNumber);
        console.log("Minted card %s", cardNumber);
        return cardNumber;
    }

    /**
     * @dev Get the base URI
     * @return string
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseuri;
    }
}
