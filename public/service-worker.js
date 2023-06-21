 // seo.config.js
export default {
  additionalLinkTags: [
    {
      rel: 'shortcut icon',
      href: '/favicon.ico',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
    // iOS
    {
      rel: 'apple-touch-icon',
      sizes: '192x192',
      href: '/logo192.png',
    },
  ],
  additionalMetaTags: [
    {
      name: 'application-name',
      content: 'vegimap',
    },
    // iOS
    {
      name: 'apple-mobile-web-app-title',
      content: 'vegimap',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'format-detection',
      content: 'telephone:no',
    },
    // Android
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#ff9e9c',
    },
  ],
};