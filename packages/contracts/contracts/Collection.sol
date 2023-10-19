// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Collection {
    string public name;
    uint256 public cardCount;
    address[] public cards;

    constructor(string memory _name, uint256 _cardCount) {
        name = _name;
        cardCount = _cardCount;
    }

    function addCard(address _card) public {
        require(cards.length < cardCount, "Collection is full");
        cards.push(_card);
    }

    function getCards() public view returns (address[] memory) {
        return cards;
    }
}