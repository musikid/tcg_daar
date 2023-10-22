import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('collection contract', () => {
  it('should have the defined name', async () => {
    const Collection = await ethers.getContractFactory('Collection')

    const name = 'test'
    const coll = await Collection.deploy(name, 1)
    expect(await coll.name()).to.equal(name)
  })
})
