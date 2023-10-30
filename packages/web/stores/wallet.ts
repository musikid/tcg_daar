import { configureChains, createConfig, getAccount, getNetwork, signMessage, connect as wagmiConnect, disconnect as wagmiDisconnect, watchAccount } from '@wagmi/core'
import { hardhat } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { SiweMessage } from 'siwe'

import 'viem/window'
import type { GetAccountResult } from '@wagmi/core'

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

  const account = reactive<Partial<GetAccountResult>>(getAccount())
  watchAccount((newAccount: Record<string, any>) => {
    const keys = Object.keys(newAccount) as (keyof GetAccountResult)[]
    for (const key of keys)
      account[key] = newAccount[key]
  })

  const connect = async (connectorType: WalletConnector = window.ethereum ? WalletConnector.MetaMask : WalletConnector.WalletConnect) => {
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

  const prepareSiweMessage = async (_nonce: MaybeRefOrGetter<string>) => {
    const nonce = toValue(_nonce)
    const { chain } = getNetwork()

    const message = new SiweMessage({
      domain: window.location.host,
      address: account.address,
      statement: `Sign in to ${appName}`,
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce,
    }).prepareMessage()
    const signature = await signMessage({ message })

    return { message, signature }
  }

  return {
    ...toRefs(account),
    connect,
    disconnect,
    prepareSiweMessage,
  }
})
