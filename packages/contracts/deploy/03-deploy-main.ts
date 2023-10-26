import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments: { deploy, get: getDeployment }, getNamedAccounts, ethers } = hre

  const { deployer } = await getNamedAccounts()

  const Card = await getDeployment('Card')
  const CardAddress = Card.address

  const Booster = await getDeployment('Booster')
  const BoosterAddress = Booster.address

  const result = await deploy('Main', {
    from: deployer,
    args: [CardAddress, BoosterAddress],
    log: true,
    autoMine: true,
  })

  const card = await ethers.getContractAt('Card', CardAddress)
  const booster = await ethers.getContractAt('Booster', BoosterAddress)
  await card.transferOwnership(result.address)
  await booster.transferOwnership(result.address)
}
export default deploy
