import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { getTokenIds } from './utils'

async function init() {
  const Card = await ethers.getContractFactory('Card')
  const card = await Card.deploy()
  await card.deploymentTransaction()?.wait()

  const Booster = await ethers.getContractFactory('Booster')
  const booster = await Booster.deploy(card.target)
  await booster.deploymentTransaction()?.wait()

  const Main = await ethers.getContractFactory('Main')
  const main = await Main.deploy(card.target, booster.target)
  await main.deploymentTransaction()?.wait()

  await card.transferOwnership(await main.getAddress())
  await booster.transferOwnership(await main.getAddress())

  return { card, main, booster }
}

describe('main contract', () => {
  it('should create a collection', async () => {
    const { main } = await loadFixture(init)
    const emptyColls = await main.getCollections()
    expect(emptyColls.length).to.equal(0)
    const collName = 'test'

    const tx = await main.createCollection(collName, 1)
    await tx.wait()

    const colls = await main.getCollections()
    expect(colls.length).to.equal(1)
    const coll = await ethers.getContractAt('Collection', colls[0])
    expect(await coll.name()).to.equal(collName)
  })

  it('should not create a collection if not authorized', async () => {
    const [, notOwner] = await ethers.getSigners()
    const { main } = await loadFixture(init)
    const collName = 'test'

    await expect(main.connect(notOwner).createCollection(collName, 1)).to.be.revertedWithCustomError(main, 'AccessControlUnauthorizedAccount')
  })

  it('should mint a card for a collection', async () => {
    const { main, card } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await expect(main.mintCardForCollection(coll, uri)).to.emit(card, 'Transfer').withArgs(ethers.ZeroAddress, mainAddr, 0)

    const tokenId = (await getTokenIds(card, main.target))[0]
    const collContract = await ethers.getContractAt('Collection', coll)
    expect(await card.tokenURI(tokenId)).to.equal(uri)
    expect(await collContract.hasCard(tokenId)).to.be.true
  })

  it('should mint cards for a collection', async () => {
    const { main, card } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'test'
    await (await main.createCollection(collName, 2)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    const uri2 = 'https://example2.com/'
    const tx = await main.mintCardsForCollection(coll, [uri, uri2])
    await tx.wait()

    const tokenIds = await getTokenIds(card, main.target)

    for (const tokenId of tokenIds)
      await expect(tx).to.emit(card, 'Transfer').withArgs(ethers.ZeroAddress, mainAddr, tokenId)

    const collContract = await ethers.getContractAt('Collection', coll)
    expect(await card.tokenURI(tokenIds[0])).to.equal(uri)
    expect(await collContract.hasCard(tokenIds[0])).to.be.true
    expect(await card.tokenURI(tokenIds[1])).to.equal(uri2)
    expect(await collContract.hasCard(tokenIds[1])).to.be.true
  })

  it('should not mint card for a collection if not authorized', async () => {
    const [, notOwner] = await ethers.getSigners()
    const { main } = await loadFixture(init)
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await expect(main.connect(notOwner).mintCardForCollection(coll, uri)).to.be.revertedWithCustomError(main, 'AccessControlUnauthorizedAccount')
  })

  it('should transfer a card', async () => {
    const { main, card } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await (await main.mintCardForCollection(coll, uri)).wait()

    const tokenId = (await getTokenIds(card, main.target))[0]
    const [, to] = await ethers.getSigners()
    const tx = (await main.transferCard(to.address, tokenId))
    await tx.wait()

    expect(await card.ownerOf(tokenId)).to.equal(to.address)
    expect(tx).to.emit(card, 'Transfer').withArgs(mainAddr, to.address, tokenId)
  })

  it('should not transfer a card if not authorized', async () => {
    const [, notOwner] = await ethers.getSigners()
    const { main, card } = await loadFixture(init)
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await (await main.mintCardForCollection(coll, uri)).wait()

    const tokenId = (await getTokenIds(card, main.target))[0]
    await expect(main.connect(notOwner).transferCard(notOwner.address, tokenId)).to.be.revertedWithCustomError(main, 'AccessControlUnauthorizedAccount')
  })

  it('should not transfer a card if not owner of card', async () => {
    const [owner, notOwner] = await ethers.getSigners()
    const { main, card } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)
    const uri = 'https://example.com/'
    await (await main.mintCardForCollection(coll, uri)).wait()

    const tokenId = (await getTokenIds(card, main.target))[0]
    await expect(main.transferCard(notOwner.address, tokenId)).to.emit(card, 'Transfer').withArgs(mainAddr, notOwner.address, tokenId)

    await expect(main.transferCard(owner.address, tokenId)).to.be.revertedWithCustomError(card, 'ERC721InsufficientApproval')
  })

  it('should transfer cards', async () => {
    const { main, card } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'testa'
    await (await main.createCollection(collName, 2)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    const uri2 = 'https://example2.com/'
    await (await main.mintCardsForCollection(coll, [uri, uri2])).wait()

    const tokenIds = (await getTokenIds(card, main.target))
    const [, to] = await ethers.getSigners()
    const tx = (await main.transferCards(to.address, tokenIds))
    await tx.wait()

    expect(await card.ownerOf(tokenIds[0])).to.equal(to.address)
    expect(await card.ownerOf(tokenIds[1])).to.equal(to.address)
    expect(tx).to.emit(card, 'Transfer').withArgs(mainAddr, to.address, tokenIds[0])
    expect(tx).to.emit(card, 'Transfer').withArgs(mainAddr, to.address, tokenIds[1])
  })

  it('should mint booster of cards', async () => {
    const { main, card, booster } = await loadFixture(init)
    const mainAddr = await main.getAddress()
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await (await main.mintCardForCollection(coll, uri)).wait()

    const cardIds = (await getTokenIds(card, main.target))
    const [, to] = await ethers.getSigners()
    const tx = (await main.mintBooster(to, '', cardIds))
    await tx.wait()

    const boosterFilter = booster.filters.Transfer(undefined, to)
    const boosterId = await booster.queryFilter(boosterFilter).then(evs => evs[0].args?.tokenId)
    expect(await booster.ownerOf(boosterId)).to.equal(to.address)
    expect(tx).to.emit(card, 'Transfer').withArgs(mainAddr, to.address, cardIds)
  })

  it('should not mint booster of cards if not authorized', async () => {
    const [, notOwner] = await ethers.getSigners()
    const { main, card } = await loadFixture(init)
    const collName = 'test'
    await (await main.createCollection(collName, 1)).wait()
    const coll = await main.getCollectionByName(collName)

    const uri = 'https://example.com/'
    await (await main.mintCardForCollection(coll, uri)).wait()

    const cardIds = (await getTokenIds(card, main.target))
    await expect(main.connect(notOwner).mintBooster(notOwner.address, '', cardIds)).to.be.revertedWithCustomError(main, 'AccessControlUnauthorizedAccount')
  })
})
