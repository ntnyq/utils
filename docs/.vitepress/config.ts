import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: '@ntnyq/utils',
  description:
    'Typed utility library for arrays, strings, objects, numbers, DOM helpers, and runtime checks.',
  themeConfig: {
    siteTitle: '@ntnyq/utils',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/ntnyq/utils' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Array', link: '/api/array' },
            { text: 'Color', link: '/api/color' },
            { text: 'DOM', link: '/api/dom' },
            { text: 'Environment', link: '/api/env' },
            { text: 'File', link: '/api/file' },
            { text: 'Function', link: '/api/fn' },
            { text: 'HTML', link: '/api/html' },
            { text: 'Type Guards', link: '/api/is' },
            { text: 'Misc', link: '/api/misc' },
            { text: 'Module', link: '/api/module' },
            { text: 'Number', link: '/api/number' },
            { text: 'Object', link: '/api/object' },
            { text: 'Proxy', link: '/api/proxy' },
            { text: 'String', link: '/api/string' },
            { text: 'Tree', link: '/api/tree' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/ntnyq/utils' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-PRESENT ntnyq',
    },
  },
})
