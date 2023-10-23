// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Collection
 * @dev Collection of cards.
 * @notice This contract is used to manage collections (sets) of cards
 * and store their ids.
 */
contract Collection is Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    /**
     * @dev Collection name
     */
    string public name;
    /**
     * @dev Collection cards ids
     */
    EnumerableSet.UintSet private cardsIds;
    /**
     * @dev Expected number of cards in the collection
     */
    uint public expectedCount;

    /**
     * @notice Constructor
     * @param _name   Collection name
     * @param _expectedCount  Expected number of cards in the collection
     */
    constructor(string memory _name, uint _expectedCount) Ownable(_msgSender()) {
        name = _name;
        expectedCount = _expectedCount;
    }

    /**
     * @notice Add a card to the collection.
     * @param _cardId   Card id
     */
    function addCard(uint256 _cardId) public onlyOwner {
        require(!cardsIds.contains(_cardId), "Card already in collection");
        require(cardsIds.length() < expectedCount, "Collection is full");
        cardsIds.add(_cardId);
    }

    /**
     * @notice Get all the cards in the collection.
     * @return  Array of card ids
     */
    function getCards() public view returns (uint256[] memory) {
        return cardsIds.values();
    }

    /**
     * @notice Check if a card is in the collection.
     * @param _cardId   Card id
     * @return Whether the card is in the collection
     */
    function hasCard(uint256 _cardId) public view returns (bool) {
        return cardsIds.contains(_cardId);
    }

    /**
     * @notice Get the actual number of cards in the collection.
     * @return  Number of cards in the collection
     */
    function count() public view returns (uint256) {
        return cardsIds.length();
    }
}
