import { defineConfig, presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetDaisy } from 'unocss-preset-daisy'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        serif: 'Rokkitt',
        sans: 'Titillium Web',
        mono: 'Handjet',
      },
    }),
    presetIcons(),
    presetDaisy({
      styled: true,
      themes: [{
        dark: {
          'primary': '#7BC0F5',
          'secondary': '#9747FF',
          'accent': '#333',
          'neutral': '#1E1E1E',
          'base-100': '#161616',
        },
      }, {
        light: {
          'primary': '#7BC0F5',
          'secondary': '#9747FF',
          'accent': '#333',
          'neutral': '#1E1E1E',
          'base-100': '#161616',
        },
      }],
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
