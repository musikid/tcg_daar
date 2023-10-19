// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Card is ERC721 {
    uint256 public cardNumber;
    string public img;
    uint256 public collectionIndex;

    constructor(
        uint256 _cardNumber,
        string memory _img,
        uint256 _collectionIndex
    ) ERC721("Card", "CARD") {
        cardNumber = _cardNumber;
        img = _img;
        collectionIndex = _collectionIndex;
    }
}