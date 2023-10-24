// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Card.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/**
 * @title Booster
 * @dev NFT booster.
 * @notice This contract is used to mint boosters of cards,
 * which are ERC721 tokens mapping to arrays of card ids.
 * It also allows to unpack a booster, which burns the booster
 * and transfers the cards to the caller.
 * The provided Card contract is assumed to has this contract
 * approved to transfer cards from the caller of minting functions.
 */
contract Booster is ERC721URIStorage, Ownable, ERC721Holder {
    // Booster id counter
    uint256 private _idCounter = 0;
    // Booster id => array of card ids
    mapping(uint256 => uint256[]) private _boosterCards;
    // Card contract
    IERC721 private _cardContract;

    /**
     * @notice Constructor
     * @param cardContract Card contract address
     */
    constructor(
        IERC721 cardContract
    ) ERC721("Booster", "BST") Ownable(_msgSender()) {
        _cardContract = cardContract;
    }

    /**
     * @notice Mint a booster of cards from `cardIds` for `_to`
     * while setting `_boosterUri` as its metadata URI.
     * Assume that the caller has already approved this contract to transfer the cards
     * owned by the caller.
     * @param _to   Address to mint to
     * @param boosterUri  Booster metadata URI
     * @param cardIds  Array of card ids to add to the booster
     * @return Booster id
     */
    function mint(
        address _to,
        string memory boosterUri,
        uint256[] memory cardIds
    ) public onlyOwner returns (uint256) {
        require(cardIds.length > 0, "Booster: must contain at least one card");
        uint256 boosterNumber = _idCounter;
        _idCounter++;

        _safeMint(_to, boosterNumber);
        _setTokenURI(boosterNumber, boosterUri);

        for (uint256 i = 0; i < cardIds.length; i++) {
            _boosterCards[boosterNumber].push(cardIds[i]);
            _cardContract.safeTransferFrom(
                _msgSender(),
                address(this),
                cardIds[i]
            );
        }

        return boosterNumber;
    }

    /**
     * @notice Get the array of card ids of a booster.
     * @param boosterId  Booster id
     * @return Array of card ids
     */
    function getCards(
        uint256 boosterId
    ) public view returns (uint256[] memory) {
        require(
            ownerOf(boosterId) == _msgSender(),
            "Booster: caller is not the owner of the booster"
        );

        return _boosterCards[boosterId];
    }

    /**
     * @notice Unpack a booster of cards for the caller 
     * if the caller is the owner of the booster, by 
     * burning the booster and transferring the cards.
     * @param boosterId  Booster id
     */
    function unpack(uint256 boosterId) public {
        require(
            ownerOf(boosterId) == _msgSender(),
            "Booster: caller is not the owner of the booster"
        );

        uint256[] memory cardIds = _boosterCards[boosterId];
        for (uint256 i = 0; i < cardIds.length; i++) {
            _cardContract.safeTransferFrom(
                address(this),
                _msgSender(),
                cardIds[i]
            );
        }

        _burn(boosterId);

        delete _boosterCards[boosterId];
    }
}
