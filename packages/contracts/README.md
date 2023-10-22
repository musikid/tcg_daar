# Contracts

In this directory you can find all the smart contracts that are used in the
project.

## Contracts

### [Card](./contracts/Card.sol)

The Card contract is the main contract of the project. It is used to create
cards and to manage the ownership of the cards.
It is based on the [ERC721](https://docs.openzeppelin.com/contracts/5.x/erc721)
standard.

### [Collection](./contracts/Collection.sol)

The Collection contract is used to manage collections of cards.

### [Main](./contracts/Main.sol)

The Main contract is used to manage the Card and Collection contracts.
All the calls to the Card and Collection contracts should be done through the
Main contract.