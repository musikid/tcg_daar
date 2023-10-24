import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

async function init() {
  const Card = await ethers.getContractFactory('Card')
  const card = await Card.deploy()

  await card.deploymentTransaction()?.wait()

  const CardAddress = card.target

  const Booster = await ethers.getContractFactory('Booster')
  const booster = await Booster.deploy(CardAddress)

  await booster.deploymentTransaction()?.wait()

  await card.setApprovalForAll(booster.target, true)

  return { booster, card }
}

async function initWithABooster() {
  const [owner] = await ethers.getSigners()

  const { booster, card } = await init()

  await card.mint(owner.address, '')
  await card.mint(owner.address, '')
  const filter = card.filters.Transfer(undefined, owner.address)
  const boosterCards = (await card.queryFilter(filter)).map(e => e.args.tokenId)

  await booster.mint(owner.address, '', boosterCards)

  return { booster, card, boosterCards, owner }
}

describe('booster contract', () => {
  it('should be able to mint a booster', async () => {
    const [owner] = await ethers.getSigners()

    const { booster, card } = await loadFixture(init)

    await card.mint(owner.address, '')
    await card.mint(owner.address, '')
    const filter = card.filters.Transfer(undefined, owner.address)
    const cards = (await card.queryFilter(filter)).map(e => e.args.tokenId)

    await expect(booster.mint(owner.address, '', cards)).to.emit(booster, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 0)

    const boosterCards = await booster.getCards(0)
    expect(boosterCards).to.eql(cards)
  })

  it('should be able to mint boosters', async () => {
    const [owner] = await ethers.getSigners()

    const { booster, card } = await loadFixture(init)

    await card.mint(owner.address, '')
    await card.mint(owner.address, '')
    const filter = card.filters.Transfer(undefined, owner.address)
    const cardsBooster1 = (await card.queryFilter(filter)).map(e => e.args.tokenId)

    const block = await ethers.provider.getBlockNumber()
    await card.mint(owner.address, '')
    await card.mint(owner.address, '')
    await card.mint(owner.address, '')
    const filter2 = card.filters.Transfer(undefined, owner.address)
    const cardsBooster2 = (await card.queryFilter(filter2, block + 1)).map(e => e.args.tokenId)

    const firstTx = await booster.mint(owner.address, '', cardsBooster1)
    await expect(firstTx).to.emit(booster, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 0)

    const secondTx = await booster.mint(owner.address, '', cardsBooster2)
    await expect(secondTx).to.emit(booster, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 1)
  })

  it('should return cards of a booster', async () => {
    const { booster, boosterCards: cards } = await loadFixture(initWithABooster)

    const boosterCards = await booster.getCards(0)
    expect(boosterCards).to.eql(cards)
  })

  it('should be able to let the owner of a booster to unpack a booster', async () => {
    const [owner] = await ethers.getSigners()

    const { booster, boosterCards: cards, card } = await loadFixture(initWithABooster)

    const tx = await booster.unpack(0)
    await expect(tx).to.emit(booster, 'Transfer').withArgs(owner.address, ethers.ZeroAddress, 0)

    for (const id of cards)
      await expect(tx).to.emit(card, 'Transfer').withArgs(booster.target, owner.address, id)

    await expect(booster.getCards(0)).to.be.revertedWithCustomError(booster, 'ERC721NonexistentToken')
  })

  it('should stop unpacking a booster if not owner', async () => {
    const [, notOwner] = await ethers.getSigners()

    const { booster } = await loadFixture(initWithABooster)

    await expect(booster.connect(notOwner).unpack(0)).to.be.revertedWith('Booster: caller is not the owner of the booster')
  })

  it('should not show cards of a booster if not owner', async () => {
    const [, notOwner] = await ethers.getSigners()

    const { booster } = await loadFixture(initWithABooster)

    await expect(booster.connect(notOwner).getCards(0)).to.be.revertedWith('Booster: caller is not the owner of the booster')
  })
})
