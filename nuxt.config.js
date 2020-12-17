require('dotenv').config()
const { join } = require('path')
const { copySync, removeSync } = require('fs-extra')

module.exports = {
  // mode: 'spa', // Comment this for SSR

  srcDir: __dirname,

  env: {
    baseUrl: 'http://192.168.1.189:3000/',
    apiUrl: process.env.API_URL || process.env.APP_URL + '/api',
    appName: process.env.APP_NAME || 'Heroacademy',
    appLocale: process.env.APP_LOCALE || 'en',
    githubAuth: !!process.env.GITHUB_CLIENT_ID,
    facebookAuth: !!process.env.FACEBOOK_CLIENT_ID,
    googleAuth: !!process.env.GOOGLE_CLIENT_ID,
  },

  head: {
    title: process.env.APP_NAME,
    titleTemplate: '%s | ' + process.env.APP_NAME,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Descriptions and Keywords
      { hid: 'description', name: 'description', content: 'Unlock opportunity, study any topic, anytime. Explore thousands of courses for the lowest price ever!' },
      { hid: 'keywords', name: 'keywords', content: 'e-learning, academy, learn, your time, value'},

      // Facebook Metas
      { hid: 'og:url', name: 'og:url', content: process.env.CLIENT_URL },
      { hid: 'og:title', name: 'og:title', content: 'Online Courses - Anytime, Anywhere | Heroacademy' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'Online Courses | Heroacademy' },
      { hid: 'og:image', name: 'og:image', content: 'https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,h_630,w_1200/v1573179687/HQ%20Images/alexis-brown-omeaHbEFlN4-unsplash_m9sxu6.jpg' },
      { hid: 'og:description', name: 'og:description', content: 'Unlock opportunity, study any topic, anytime. Explore thousands of courses for the lowest price ever!' },

    ],
    noscript: [
      { innerHTML: 'Body No Scripts', body: true }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans&display=swap' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.1/css/all.css' }
    ]
  },

  loading: { color: '#007bff' },

  router: {
    middleware: ['locale', 'check-auth']
  },

  css: [
    { src: '~assets/sass/app.scss', lang: 'scss' },
    { src: 'plyr/dist/plyr.css' }
  ],

  plugins: [
    '~components/global',
    '~plugins/i18n',
    '~plugins/vform',
    '~plugins/axios',
    '~plugins/fontawesome',
    '~plugins/password-strength',
    '~plugins/flat-pickr',
    '~plugins/moment',
    '~plugins/pagination',
    '~plugins/vue-plyr',
    '~plugins/cloudinary',
    '~plugins/vue-draggable',
    { src: '~plugins/star-rating', mode: 'client' },

    // '~plugins/nuxt-client-init', // Comment this for SSR

    { src: '~plugins/tags-input', mode: 'client' },
    { src: '~plugins/social-share', mode: 'client' },
    { src: '~plugins/clipboard2', mode: 'client' },
    { src: '~plugins/carousel', mode: 'client' },
    { src: '~plugins/readmore', mode: 'client' },
    { src: '~plugins/offline-alert', mode: 'client' },
    { src: '~plugins/numerals', mode: 'client' },
    { src: '~plugins/recaptchaV3', mode: 'client' },
    { src: '~plugins/froala', mode: 'client' },
    { src: '~plugins/vue-sweetalert2', mode: 'client' },
    { src: '~plugins/bootstrap', mode: 'client' }
  ],

  modules: [
    '@nuxtjs/router',
    '@nuxtjs/pwa'
  ],

  icon: {
    iconSrc: './static/icon.png'
  },

  manifest: {
    short_name: 'HA',
    name: 'Heroacademy',
    start_url: '/',
    theme_color: '#bc4e9c'
  },

  // server: {
  //   port: 3000, // default: 3000
  //   host: '0.0.0.0' // default: localhost
  // },

  build: {
    extractCSS: true
  },

  hooks: {
    build: {
      done (builder) {
        // Copy dist files to public/_nuxt
        if (builder.nuxt.options.dev === false && builder.nuxt.options.mode === 'spa') {
          const publicDir = join(builder.nuxt.options.rootDir, 'public', '_nuxt')
          removeSync(publicDir)
          copySync(join(builder.nuxt.options.generate.dir, '_nuxt'), publicDir)
          copySync(join(builder.nuxt.options.generate.dir, '200.html'), join(publicDir, 'index.html'))
        }
      }
    }
  }
}
