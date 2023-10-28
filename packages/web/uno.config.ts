import { defineConfig, presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
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
  ],
  theme: {
    colors: {
      primary: '#7BC0F5',
    },
  },
  transformers: [
    transformerDirectives(),
  ],
  rules: [
    [/^bg-i-\[(--.*)\]/, ([, v]) => ({ 'background-image': `var(${v})` })],
  ],
})
