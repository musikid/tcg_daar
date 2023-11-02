export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt', '@nuxt/image', '@vueuse/nuxt'],
  css: ['@unocss/reset/tailwind.css'],
  contracts: {
    network: ['localhost'],
  },
  app: {},
  postcss: {},
  routeRules: {
    '/dashboard/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
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
