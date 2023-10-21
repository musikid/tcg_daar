// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Card
 * @dev Card contract
 */
contract Card is Ownable, ERC721URIStorage {
    // Card id counter
    uint256 private _idCounter = 0;

    constructor() ERC721("Card", "CARD") Ownable(_msgSender()) {}

    /**
     * @dev Mint a new card
     * @param _to   Address to mint to
     * @param cardUri  Card metadata URI
     * @return uint256  Card number
     */
    function mint(
        address _to,
        string memory cardUri
    ) public onlyOwner returns (uint256) {
        uint256 cardNumber = _idCounter;
        _idCounter++;

        _safeMint(_to, cardNumber);
        _setTokenURI(cardNumber, cardUri);

        return cardNumber;
    }
}
