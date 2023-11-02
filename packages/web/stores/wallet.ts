import { configureChains, createConfig, getAccount, getContract, getNetwork, signMessage, connect as wagmiConnect, disconnect as wagmiDisconnect, watchAccount, watchWalletClient } from '@wagmi/core'
import { hardhat } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import type { GetAccountResult, GetWalletClientResult } from '@wagmi/core'
import hardhatContracts from '#build/contracts/localhost'

import 'viem/window'

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
  const { appName, appLogo } = useAppConfig() as Record<string, string>
  const walletConnectMetadata = {
    name: appName,
    description: `${appName} Connect`,
    url: baseURL,
    icons: [appLogo],
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
  const walletClient = ref(undefined as GetWalletClientResult | undefined)
  watchWalletClient({ chainId: hardhat.id }, (newWalletClient) => {
    walletClient.value = newWalletClient
  })

  const Booster = computed(() => getContract({ ...hardhatContracts.contracts.Booster, walletClient: walletClient.value! }))
  const Card = computed(() => getContract({ ...hardhatContracts.contracts.Card, walletClient: walletClient.value! }))
  const Main = computed(() => getContract({ ...hardhatContracts.contracts.Main, walletClient: walletClient.value! }))

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
    const { chain } = getNetwork()
    const data = {
      domain: window.location.host,
      address: account.address,
      statement: `Sign in to ${appName}`,
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce: toValue(_nonce),
      issuedAt: new Date().toISOString(),
    }
    const message = `${data.domain} wants you to sign in with your Ethereum account:
${data.address}

${data.statement}

URI: ${data.uri}
Version: ${data.version}
Chain ID: ${data.chainId}
Nonce: ${data.nonce}
Issued At: ${data.issuedAt}`
    const signature = await signMessage({ message })

    return { message, signature }
  }

  return {
    ...toRefs(account),
    connect,
    disconnect,
    prepareSiweMessage,
    publicClient: _config.publicClient,
    walletClient,
    Booster,
    Card,
    Main,
  }
})
