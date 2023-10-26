import { defineConfig, presetIcons, presetWebFonts } from 'unocss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons(),
        presetWebFonts({
            fonts: {
                serif: ['Rokkitt'],
                sans: ['Titillium Web'],
                pixel: ['Handjet']
            }
        }),
    ],
})