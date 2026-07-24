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
            { text: 'Async', link: '/api/async' },
            { text: 'Color', link: '/api/color' },
            { text: 'Function', link: '/api/function' },
            { text: 'HTML', link: '/api/html' },
            { text: 'JSON', link: '/api/json' },
            { text: 'Logging', link: '/api/logging' },
            { text: 'Module', link: '/api/module' },
            { text: 'Number', link: '/api/number' },
            { text: 'Object', link: '/api/object' },
            { text: 'Path', link: '/api/path' },
            { text: 'Predicate', link: '/api/predicate' },
            { text: 'Proxy', link: '/api/proxy' },
            { text: 'String', link: '/api/string' },
            { text: 'Tree', link: '/api/tree' },
            { text: 'Types', link: '/api/types' },
            { text: 'Units', link: '/api/units' },
            { text: 'Web', link: '/api/web' },
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
