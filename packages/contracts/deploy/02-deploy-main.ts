import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments: { deploy, get: getDeployment }, getNamedAccounts, ethers } = hre

    const { deployer } = await getNamedAccounts()

    const Card = await getDeployment('Card')
    const CardAddress = Card.address

    const result = await deploy('Main', {
        from: deployer,
        args: [CardAddress],
        log: true,
        autoMine: true,
    })

    const card = await ethers.getContractAt('Card', CardAddress)

    await card.transferOwnership(result.address)
}
export default deploy
