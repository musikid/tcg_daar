export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', 'nuxt-security', '@nuxt/image', 'nuxt-headlessui'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  app: {},
  postcss: {},
  security: {
    csrf: false,
    corsHandler: false,
    headers: { crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp', },
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
