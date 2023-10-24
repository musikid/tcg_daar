// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Mintable.sol";

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
contract Card is Ownable, ERC721URIStorage, Mintable {
    // Card id counter
    uint256 private _idCounter = 0;

    constructor() ERC721("Card", "CRD") Ownable(_msgSender()) {}

    /**
     * @notice Mint a card for an address while setting its metadata URI.
     * @return Card id
     * @inheritdoc Mintable
     */
    function mint(
        address _to,
        string memory cardUri
    ) public override onlyOwner returns (uint256) {
        uint256 cardNumber = _idCounter;
        _idCounter++;

        _safeMint(_to, cardNumber);
        _setTokenURI(cardNumber, cardUri);

        return cardNumber;
    }
}
