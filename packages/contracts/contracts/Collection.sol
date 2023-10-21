// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Collection
 * @dev Collection of cards
 */
contract Collection is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    // Collection name
    string public name;
    // Set of card ids in the collection
    EnumerableSet.UintSet private cardsIds;

    /**
     * @dev Constructor
     * @param _name   Collection name
     */
    constructor(string memory _name) Ownable(_msgSender()) {
        name = _name;
    }

    /**
     * @dev Add a card to the collection
     * @param _cardId   Card id
     */
    function addCard(uint256 _cardId) public onlyOwner {
        cardsIds.add(_cardId);
    }

    /**
     * @dev Get all the cards in the collection
     * @return uint256[] memory
     */
    function getCards() public view returns (uint256[] memory) {
        return cardsIds.values();
    }

    /**
     * @dev Check if a card is in the collection
     * @param _cardId   Card id
     * @return bool
     */
    function hasCard(uint256 _cardId) public view returns (bool) {
        return cardsIds.contains(_cardId);
    }

    /**
     * @dev Get the number of cards in the collection
     * @return uint256
     */
    function count() public view returns (uint256) {
        return cardsIds.length();
    }
}
