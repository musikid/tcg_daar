import { hardhat } from '@wagmi/core/chains'
import { configureChains, connect as wagmiConnect, disconnect as wagmiDisconnect } from '@wagmi/core'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'

export enum WalletConnector {
  WalletConnect = 'WalletConnect',
  MetaMask = 'MetaMask',
}

export const useWallet = defineStore('wallet', () => {
  // TODO: Add support for multiple chains (configureChains)
  const { chains, publicClient } = configureChains([hardhat], [jsonRpcProvider({
    rpc: () => ({ http: hardhat.rpcUrls.default.http[0] }),
  }), publicProvider()])
  const { public: { walletConnectProjectId: projectId }, app: { baseURL } } = useRuntimeConfig()
  const { appName } = useAppConfig()
  const walletConnectMetadata = {
    name: appName,
    description: `${appName} Connect`,
    url: baseURL,
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }
  const walletConnect = new WalletConnectConnector({
    options: {
      metadata: walletConnectMetadata,
      projectId,
      showQrModal: true,
    },
    chains,
  })
  const metamask = new MetaMaskConnector({
    chains,
  })
  const _config = createConfig({
    autoConnect: true,
    connectors: [walletConnect, metamask],
    publicClient,
  })

  const { isConnected, isConnecting } = useAccount()

  const connect = async (connectorType: WalletConnector = WalletConnector.MetaMask) => {
    let connector: WalletConnectConnector | MetaMaskConnector
    switch (connectorType) {
      case WalletConnector.MetaMask:
        connector = metamask
        break
      case WalletConnector.WalletConnect:
        connector = walletConnect
        break
      default:
        connector = walletConnect
    }

    await wagmiConnect({ connector })
  }

  const disconnect = async () => {
    await wagmiDisconnect()
  }

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
  }
})
