import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-solhint'
import 'solidity-docgen';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  namedAccounts: {
    deployer: 0,
  },
  docgen: {
    pages: 'items',
    outputDir: 'docs/reference/contracts',
  }
}

export default config
