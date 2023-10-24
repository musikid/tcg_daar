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

describe('booster contract', () => {
  it('should be able to mint a booster', async () => {
    const [owner] = await ethers.getSigners()

    const { booster, card } = await loadFixture(init)

    await card.mint(owner.address, '')
    await card.mint(owner.address, '')

    const filter = card.filters.Transfer(undefined, owner.address)
    const cards = (await card.queryFilter(filter)).map(e => e.args.tokenId)

    await expect(booster.mint(owner.address, '', cards)).to.emit(booster, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 0)
  })
})
