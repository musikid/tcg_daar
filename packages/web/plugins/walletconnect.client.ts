import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { hardhat } from '@wagmi/core/chains'

export default defineNuxtPlugin(() => {
  const { public: { walletConnectProjectId: projectId }, app: { baseURL } } = useRuntimeConfig()
  const { appName } = useAppConfig()
  const metadata = {
    name: appName,
    description: `${appName} Connect`,
    url: baseURL,
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }

  const chains = [hardhat]
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

  createWeb3Modal({ wagmiConfig, projectId, chains })
})
