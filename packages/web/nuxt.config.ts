// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', '@use-wagmi/nuxt'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  ssr: false,
  postcss: {},
  runtimeConfig: {
    public: {
      walletConnectProjectId: '',
    },
  },
})
