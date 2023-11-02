export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', 'nuxt-security', '@nuxt/image', '@vueuse/nuxt', 'nuxt-headlessui'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  app: {},
  appConfig: {
    appName: 'TCG',
    appLogo: '/favicon.ico',
  },
  postcss: {},
  security: {
    // Already handled by lucia
    csrf: false,
    corsHandler: {},
    // For DevTools
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: false,
    },
  },
  runtimeConfig: {
    pokemonTcgSdk: {
      apiKey: '',
    },
    public: {
      walletConnectProjectId: '',
    },
  },
})
