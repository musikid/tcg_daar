import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

async function init() {
  const Card = await ethers.getContractFactory('Card')
  const card = await Card.deploy()

  await card.deploymentTransaction()?.wait()

  return { card }
}

describe('card contract', () => {
  it('should have the defined URI', async () => {
    const [owner] = await ethers.getSigners()

    const { card } = await loadFixture(init)

    const uri = 'https://example.com/'
    await card.mint(owner.address, uri)
    const tokenId = 0
    expect(await card.tokenURI(tokenId)).to.equal(uri)
  })

  it('should be able to mint cards', async () => {
    const [owner] = await ethers.getSigners()

    const { card } = await loadFixture(init)

    await expect(card.mint(owner.address, '')).to.emit(card, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 0)
    await expect(card.mint(owner.address, '')).to.emit(card, 'Transfer').withArgs(ethers.ZeroAddress, owner.address, 1)
  })
})
