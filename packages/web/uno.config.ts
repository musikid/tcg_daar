import { defineConfig, presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        serif: 'Rokkitt',
        sans: ['Titillium Web:300,400,500,600'],
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
    transformerVariantGroup(),
  ],
  rules: [
    [/^bg-i-\[(--.*)\]/, ([, v]) => ({ 'background-image': `var(${v})` })],
  ],
})
