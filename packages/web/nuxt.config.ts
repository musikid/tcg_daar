// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', 'nuxt-security'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  ssr: false,
  postcss: {},
  security: {
    csrf: {},
    corsHandler: {},
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
