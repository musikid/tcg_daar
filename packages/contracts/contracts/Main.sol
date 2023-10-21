// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";
import "./Card.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "hardhat/console.sol";

/**
 * @title Main
 * @dev Main contract
 * @dev This contract is used to create collections and mint cards.
 * @dev It is also used to transfer cards to other addresses.
 * @dev It is the owner of all cards.
 * @dev Assumes that the Card contract has already been deployed and that it has ownership transferred to this contract.
 */
contract Main is Ownable, ERC721Holder {
    Collection[] public collections;
    Card private _cardContract;

    constructor(address cardContract) Ownable(_msgSender()) {
        _cardContract = Card(cardContract);
    }

    /**
     * @dev Create a new collection
     * @param _name  Collection name
     * @return Collection New collection
     */
    function createCollection(
        string memory _name
    ) public onlyOwner returns (Collection) {
        Collection newCollection = new Collection(_name);
        collections.push(newCollection);
        return newCollection;
    }

    /**
     * @dev Get a collection by index
     * @param _collectionId  Collection id
     * @return Collection
     */
    function getCollectionById(
        uint256 _collectionId
    ) public view returns (Collection) {
        require(
            _collectionId < collections.length,
            "Collection does not exist"
        );
        return collections[_collectionId];
    }

    /**
     * @dev Get all collections
     * @return Collection[] memory
     */
    function getCollections() public view returns (Collection[] memory) {
        return collections;
    }

    /**
     * @dev Mint a new card and add it to a collection
     * @return uint256
     */
    function mintCardForCollection(
        Collection _collection
    ) public onlyOwner returns (uint256) {
        // Mint a new card and add it to the collection
        uint256 cardId = _cardContract.mint(address(this));
        _collection.addCard(cardId);
        return cardId;
    }

    /**
     * @dev Mint multiple cards and add them to a collection
     * @return uint256
     */
    function mintCardsForCollection(
        Collection _collection,
        uint256 _count
    ) public onlyOwner returns (uint256[] memory) {
        uint256[] memory cardIds = new uint256[](_count);
        for (uint256 i = 0; i < _count; i++) {
            cardIds[i] = mintCardForCollection(_collection);
        }
        return cardIds;
    }

    /**
     * @dev Transfer a card to an address
     * @param _to  Address to transfer to
     * @param _cardId  Card id
     */
    function transferCard(address _to, uint256 _cardId) public onlyOwner {
        _cardContract.safeTransferFrom(address(this), _to, _cardId);
    }
}
