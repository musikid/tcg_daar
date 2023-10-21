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
 * It is also used to transfer cards to other addresses, as such it is the original owner of all cards.
 * We assume that the Card contract has already been deployed and that its ownership has been transferred to this contract.
 */
contract Main is Ownable, ERC721Holder {
    Collection[] public collections;
    Card private _cardContract;
    mapping(string => Collection) private _collectionsByName;

    constructor(address cardContract) Ownable(_msgSender()) {
        _cardContract = Card(cardContract);
    }

    /**
     * @dev Create a new collection
     * @param _name  Collection name
     * @return Collection New collection
     */
    function createCollection(
        string memory _name,
        uint256 _expectedCount
    ) public onlyOwner returns (Collection) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(
            address(_collectionsByName[_name]) == address(0),
            "Collection already exists"
        );

        Collection newCollection = new Collection(_name, _expectedCount);
        collections.push(newCollection);
        _collectionsByName[_name] = newCollection;
        return newCollection;
    }

    /**
     * @dev Get a collection by name
     * @param _name  Collection name
     * @return Collection
     */
    function getCollectionByName(
        string memory _name
    ) public view returns (Collection) {
        return _collectionsByName[_name];
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
        Collection _collection,
        string memory _cardUri
    ) public onlyOwner returns (uint256) {
        // Mint a new card and add it to the collection
        uint256 cardId = _cardContract.mint(address(this), _cardUri);
        _collection.addCard(cardId);
        return cardId;
    }

    /**
     * @dev Mint multiple cards and add them to a collection
     * @return uint256
     */
    function mintCardsForCollection(
        Collection _collection,
        string[] memory _cardUris
    ) public onlyOwner returns (uint256[] memory) {
        uint256 count = _cardUris.length;
        uint256[] memory cardIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            cardIds[i] = mintCardForCollection(_collection, _cardUris[i]);
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

    /**
     * @dev Transfer multiple cards to an address
     * @param _to  Address to transfer to
     * @param _cardIds  Card ids
     */
    function transferCards(
        address _to,
        uint256[] memory _cardIds
    ) public onlyOwner {
        for (uint256 i = 0; i < _cardIds.length; i++) {
            transferCard(_to, _cardIds[i]);
        }
    }
}
