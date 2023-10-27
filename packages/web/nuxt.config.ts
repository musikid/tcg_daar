// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  contracts: {
    network: ['localhost'],
  },
  postcss: {},
  runtimeConfig: {},
})
