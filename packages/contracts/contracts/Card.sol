// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Card
 * @dev NFT card with metadata URI.
 * @notice This contract (based on [ERC721](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721))
 * is used to mint cards
 * and store their metadata URIs
 * according to [ERC721URIStorage](https://docs.openzeppelin.com/contracts/5.x/api/token/erc721#ERC721URIStorage).
 */
contract Card is Ownable, ERC721URIStorage {
    // Card id counter
    uint256 private _idCounter = 0;

    constructor() ERC721("Card", "CRD") Ownable(_msgSender()) {}

    /**
     * @notice Mint a card for the address `_to` 
     * while setting its metadata URI to `cardUri`.
     * @param _to   Address to mint to
     * @param cardUri  Card metadata URI
     * @return Card id
     */
    function mint(
        address _to,
        string memory cardUri
    ) external onlyOwner returns (uint256) {
        uint256 cardNumber = _idCounter;
        _idCounter++;

        _safeMint(_to, cardNumber);
        _setTokenURI(cardNumber, cardUri);

        return cardNumber;
    }
}
