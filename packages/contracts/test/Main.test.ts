import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('main contract', () => {
  it('should be able to have card minting ownership', async () => {
    const Card = await ethers.getContractFactory('Card')
    const uri = 'https://example.com/card/'
    const card = await Card.deploy(uri)

    await card.deploymentTransaction()?.wait()

    const Main = await ethers.getContractFactory('Main')
    const main = await Main.deploy(await card.getAddress())

    await main.deploymentTransaction()?.wait()

    await card.transferOwnership(await main.getAddress())

    expect(await card.owner()).to.equal(await main.getAddress())
  })
})
