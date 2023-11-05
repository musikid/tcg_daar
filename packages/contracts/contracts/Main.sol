// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";
import "./Booster.sol";
import "./Card.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/**
 * @title Main
 * @dev Main contract, used to create collections and mint cards.
 * @notice This contract is used to create collections, mint cards
 * and also used to transfer cards to other addresses,
 * since we assume it's the owner of the Card contract
 * and therefore is the original owner of all cards.
 */
contract Main is AccessControl, ERC721Holder {
    /**
     * @dev Array of all collections
     */
    Collection[] public collections;
    /**
     * @dev Card contract
     */
    Card private _cardContract;
    /**
     * @dev Booster contract
     */
    Booster private _boosterContract;
    /**
     * @dev Mapping of collection names to collections
     */
    mapping(string => Collection) private _collectionsByName;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COLLECTION_ROLE = keccak256("COLLECTION_ROLE");

    /**
     * @notice Constructor, which takes the address of the Card contract.
     * @param cardContract Card contract address
     */
    constructor(
        address cardContract,
        address boosterContract
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(COLLECTION_ROLE, _msgSender());

        _cardContract = Card(cardContract);
        _boosterContract = Booster(boosterContract);
        _cardContract.setApprovalForAll(boosterContract, true);
    }

    /**
     * @notice Create a new collection of cards.
     * @param _name  Collection name
     * @param _expectedCount  Expected number of cards in the collection
     * @return  The created collection
     */
    function createCollection(
        string calldata _name,
        uint256 _expectedCount
    ) external onlyRole(COLLECTION_ROLE) returns (Collection) {
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
     * @notice Check if a collection exists.
     * @param _name Collection name
     * @return Whether if the collection exists
     */
    function hasCollection(string calldata _name) external view returns (bool) {
        return address(_collectionsByName[_name]) != address(0);
    }

    /**
     * @notice Get a collection by name.
     * @param _name  Collection name
     * @return  The collection
     */
    function getCollectionByName(
        string calldata _name
    ) external view returns (Collection) {
        Collection collection = _collectionsByName[_name];
        require(address(collection) != address(0), "Collection does not exist");
        return collection;
    }

    /**
     * @notice Get a collection by index.
     * @param _collectionId  Collection id
     * @return The collection
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
     * @notice Get all collections available.
     * @return All available collections
     */
    function getCollections() external view returns (Collection[] memory) {
        return collections;
    }

    /**
     * @notice Mint a new card and add it to the provided collection.
     * @return  Card token id
     */
    function mintCardForCollection(
        Collection _collection,
        string memory _cardUri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        // Mint a new card and add it to the collection
        uint256 cardId = _cardContract.mint(address(this), _cardUri);
        _collection.addCard(cardId);
        return cardId;
    }

    /**
     * @notice Mint multiple cards and add them to the provided collection.
     * @return  Array of card token ids
     */
    function mintCardsForCollection(
        Collection _collection,
        string[] memory _cardUris
    ) external onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        uint256 count = _cardUris.length;
        uint256[] memory cardIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            cardIds[i] = mintCardForCollection(_collection, _cardUris[i]);
        }
        return cardIds;
    }

    /**
     * @notice Transfer a card to an address.
     * @param _to  Address to transfer to
     * @param _cardId  Card id
     */
    function transferCard(address _to, uint256 _cardId) public onlyRole(MINTER_ROLE) {
        _cardContract.safeTransferFrom(address(this), _to, _cardId);
    }

    /**
     * @notice Transfer multiple cards to an address.
     * @param _to  Address to transfer to
     * @param _cardIds  Card ids
     */
    function transferCards(
        address _to,
        uint256[] calldata _cardIds
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < _cardIds.length; i++) {
            transferCard(_to, _cardIds[i]);
        }
    }

    /**
     * @notice Mint a booster of cards with `_boosterUri` as the token URI
     * and add the cards `_cardIds` to the booster while transferring them
     * to `_to`.
     * @param _to  Address to mint the booster to
     * @param _boosterUri  Booster metadata URI
     * @param _cardIds  Array of card ids to add to the booster
     * @return Booster id
     */
    function mintBooster(
        address _to,
        string calldata _boosterUri,
        uint256[] calldata _cardIds
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        return _boosterContract.mint(_to, _boosterUri, _cardIds);
    }
}
