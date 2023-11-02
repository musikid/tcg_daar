import { defineConfig, presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetForms } from '@julr/unocss-preset-forms'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        serif: 'Rokkitt',
        sans: ['Titillium Web:300,400,500,600,700'],
        mono: 'Handjet',
      },
    }),
    presetIcons(),
    presetForms(),
  ],
  theme: {
    colors: {
      primary: '#7BC0F5',
      background: {
        main: '#161616',
        element: '#1E1E1E',
      },
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
