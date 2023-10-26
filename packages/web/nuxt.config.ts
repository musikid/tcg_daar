import { presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetDaisy } from 'unocss-preset-daisy'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  contracts: {
    network: ['localhost'],
  },
  css: ['@unocss/reset/tailwind.css'],
  postcss: {},
  runtimeConfig: { },
  unocss: {
    presets: [
      presetUno(),
      presetDaisy({
        styled: true,
        themes: [{

        }],
      }),
      presetIcons(),
      presetWebFonts({
        fonts: {
          serif: ['Rokkitt'],
          sans: ['Titillium Web'],
          pixel: ['Handjet'],
        },
      }),
    ],
  },
})
