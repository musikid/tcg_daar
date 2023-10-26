import { createPublicClient, createWalletClient, custom, getContract, http } from 'viem'
import { hardhat } from 'viem/chains'
import type { Address } from 'viem'

// For window.ethereum typings
import 'viem/window'

import hardhatInfo from '#build/contracts/localhost'

const netConfigs = {
  hardhat: { chain: hardhat, contracts: hardhatInfo.contracts, url: 'http://localhost:8545' },
}

type Network = keyof typeof netConfigs

export const useWallet = defineStore('wallet', () => {
  const address = ref<Address>('0x0')
  const network = ref<Network>('hardhat')
  const netInfo = computed(() => netConfigs[network.value])

  const publicClient = computed(() => {
    const transport = unref(netInfo).url ? http(unref(netInfo).url) : custom(window.ethereum!)
    return createPublicClient({
      chain: unref(netInfo).chain,
      transport,
    })
  },
  )
  const walletClient = computed(() =>
    createWalletClient({
      chain: unref(netInfo).chain,
      transport: custom(window.ethereum!),
      account: unref(address),
    }),
  )

  const Booster = computed(() =>
    getContract({
      address: unref(netInfo).contracts.Booster.address,
      abi: unref(netInfo).contracts.Booster.abi,
      walletClient: unref(walletClient),
      publicClient: unref(publicClient),
    }),
  )
  const Card = computed(() =>
    getContract({
      address: unref(netInfo).contracts.Card.address,
      abi: unref(netInfo).contracts.Card.abi,
      walletClient: unref(walletClient),
      publicClient: unref(publicClient),
    }),
  )
  const Main = computed(() =>
    getContract({
      address: unref(netInfo).contracts.Main.address,
      abi: unref(netInfo).contracts.Main.abi,
      walletClient: unref(walletClient),
      publicClient: unref(publicClient),
    }),
  )

  const changeAccount = (account: Address[]) => {
    address.value = account[0]
  }

  const changeNetwork = (net: Network) => {
    network.value = net
  }

  const connect = async (net: Network = 'hardhat') => {
    const { ethereum } = window
    if (!ethereum)
      throw new Error('No ethereum provider')

    const requestClient = createWalletClient({
      chain: netConfigs[net].chain,
      transport: custom(ethereum),
    })

    const [account] = await requestClient.requestAddresses()

    network.value = net
    address.value = account

    ethereum.on('accountsChanged', changeAccount)
    ethereum.on('chainChanged', changeNetwork)
  }

  const disconnect = () => {
    const { ethereum } = window
    if (!ethereum)
      throw new Error('No ethereum provider')

    ethereum.removeListener('accountsChanged', changeAccount)
    ethereum.removeListener('chainChanged', changeNetwork)
  }

  return {
    Booster,
    Card,
    Main,
    client: walletClient,
    connect,
    disconnect,
  }
})
