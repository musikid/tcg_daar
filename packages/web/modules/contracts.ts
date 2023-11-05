import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { copyFile } from 'node:fs/promises'
import { defineNuxtModule } from '@nuxt/kit'

interface ModuleOptions {
  /**
   * The network to export the contracts from.
   * Check the `networks` section of your `hardhat.config.ts` file.
   * @default 'localhost'
   * @example 'localhost'
   * @example ['localhost', 'rinkeby']
   * @see https://hardhat.org/config/#networks-configuration
   */
  network: string | string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'contracts',
    configKey: 'contracts',
  },
  defaults: {
    network: 'localhost',
    unexportedContracts: ['Collection'],
  },
  setup(options, nuxt) {
    const { network, unexportedContracts } = options

    nuxt.hook('build:before', async () => {
      const networks = Array.isArray(network) ? network : [network]

      // eslint-disable-next-line no-console
      console.info('Exporting contracts for network:', networks.join(', '))
      for (const network of networks) {
        const path = join(nuxt.options.buildDir, 'contracts', `${network}.ts`)
        const { error, status } = spawnSync('pnpm',
          ['--filter=contracts', 'exec', 'hardhat', 'export', '--export', path, '--network', network],
          { stdio: ['ignore', 'inherit', 'inherit'] })
        if (error || status !== 0) {
          throw error
        }
      }

      let { error, status } = spawnSync('pnpm',
        ['--filter=contracts', 'exec', 'hardhat', 'compile'],
        { stdio: ['ignore', 'inherit', 'inherit'] })
      if (error || status !== 0) {
        throw error
      }

      let res = spawnSync('pnpm', ['--filter=contracts', 'ls', '--depth', '-1', '--json'])
      if (res.error || res.status !== 0) {
        throw res.error
      }
      let { stdout } = res
      const rootFrom: string = JSON.parse(stdout?.toString('utf8') ?? '{}')[0].path

      console.info('Copying unexported contracts:', unexportedContracts.join(', '))
      for (const contract of unexportedContracts) {
        const to = join(nuxt.options.buildDir, 'contracts', `${contract}.json`)
        const from = join(rootFrom, 'artifacts', 'contracts', `${contract}.sol`, `${contract}.json`)
        console.info('Copying unexported contract:', contract, 'from', from, 'to', to)
        await copyFile(from, to)
      }
    })
  },
})
