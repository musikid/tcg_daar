// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', '@use-wagmi/nuxt', 'nuxt-security', '@hebilicious/authjs-nuxt'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  ssr: false,
  postcss: {},
  security: {
    csrf: {},
  },
  alias: {
    cookie: 'cookie',
  },
  runtimeConfig: {
    authJs: {
      secret: '',
    },
    public: {
      walletConnectProjectId: '',
    },
  },
})
