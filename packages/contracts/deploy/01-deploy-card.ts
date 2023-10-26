import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments: { deploy }, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  await deploy('Card', {
    from: deployer,
    log: true,
    autoMine: true,
  })
}
export default deploy
