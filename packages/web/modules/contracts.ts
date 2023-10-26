import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'

interface ModuleOptions {
  /**
   * The network to export the contracts from.
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
  },
  setup(options, nuxt) {
    const { network } = options

    nuxt.hook('build:before', async () => {
      const networks = Array.isArray(network) ? network : [network]

      // eslint-disable-next-line no-console
      console.info('Exporting contracts for network:', networks.join(', '))
      for (const network of networks) {
        const path = join(nuxt.options.buildDir, 'contracts', `${network}.ts`)
        const { stderr, error, status } = spawnSync('pnpm', ['--filter=contracts', 'exec', 'hardhat', 'export', '--export', path, '--network', network])
        if (error || status !== 0) {
          console.error(stderr?.toString('utf8'))
          throw error
        }
      }
    })
  },
})
