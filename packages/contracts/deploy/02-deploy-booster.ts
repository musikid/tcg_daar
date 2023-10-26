import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments: { deploy, get: getDeployment }, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  const Card = await getDeployment('Card')
  const CardAddress = Card.address

  await deploy('Booster', {
    from: deployer,
    args: [CardAddress],
    log: true,
    autoMine: true,
  })
}

export default deploy
