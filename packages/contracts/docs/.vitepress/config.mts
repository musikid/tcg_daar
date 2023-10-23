import { defineConfig } from 'vitepress'
import { readdirSync } from 'fs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Contracts",
  description: "tcg_daar smart contracts' documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reference', link: '/reference/', activeMatch: '^/reference/' },
    ],

    sidebar: {
      '/reference/': [
        {
          text: 'Reference',
          base: '/reference/',
          items: [
            {
              text: 'Contracts',
              base: '/reference/contracts/',
              items: readdirSync('docs/reference/contracts').map(rawName => {
                const file = rawName.replace('.md', '')
                return {
                  text: file,
                  link: `${file}`
                }
              })
            }]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/musikid/tcg_daar' }
    ]
  }
})
