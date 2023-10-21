import { expect } from 'chai'
import { ethers } from 'hardhat'

async function init(uri: string = 'https://example.com/card/') {
  const Card = await ethers.getContractFactory('Card')
  const card = await Card.deploy(uri)

  await card.deploymentTransaction()?.wait()

  return card
}

describe('card contract', () => {
  it('should have the defined base URI', async () => {
    const [owner] = await ethers.getSigners()

    const uri = 'https://example.com/card/'
    const card = await init(uri)

    const tokenId = (await card.mint(owner.address)).value
    expect(await card.tokenURI(tokenId)).to.equal(`${uri}${tokenId}`)
  })

  it('should be able to mint multiple cards', async () => {
    const [owner] = await ethers.getSigners()

    const card = await init()

    const tokenId1 = (await card.mint(owner.address)).value
    const tokenId2 = (await card.mint(owner.address)).value
    expect(tokenId1).to.not.equal(tokenId2)
  })
})
