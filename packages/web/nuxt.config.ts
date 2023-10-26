import { presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetDaisy } from 'unocss-preset-daisy'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  css: ['@unocss/reset/tailwind.css'],
  postcss: {},
  runtimeConfig: {
    public: {
      chain: {
        network: 'localhost',
        chainId: 31337,
      }
    }
  },
  unocss: {
    presets: [
      presetUno(),
      presetDaisy({
        styled: false,
      }),
      presetIcons(),
      presetWebFonts({
        fonts: {
          serif: ['Rokkitt'],
          sans: ['Titillium Web'],
          pixel: ['Handjet']
        }
      }),
    ],
  }
})
