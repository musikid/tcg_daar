// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  appConfig: {
    appName: 'TCG',
  },
  postcss: {},
  runtimeConfig: {
    public: {
      walletConnectProjectId: '',
    },
  },
})
