module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Seoul Bike',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'description', name: '서울시 자전거 따릉이 거치대 찾기 서비스', content: 'Seoul Bike' },
      { property: "og:title",
        content: "Seoul Bike" },
      { property: "og:description",
        content: "서울시 자전거 따릉이 거치대 찾기 서비스" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: "seoul-bike" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Nanum+Gothic" },
      { rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css",
        integrity: "sha256-7GAtDQ79wTEOjhBKf70uBQG7A5yyb+8rigu07atXWDY=",
        crossorigin: "anonymous" },
      { rel: "apple-touch-icon", href: "/img/icons/apple-touch-icon-152x152.png" },
      { rel: "mask-icon", href: "/img/icons/safari-pinned-tab.svg", color: "#4DBA87" },
    ]
  },
  /**
   * Loading Indicator
   */
  loading: { color: "#4DBA87" },
  /**
   * Modules
   */
  modules: [
    ['@nuxtjs/sitemap', {
      path: '/sitemap.xml',
      hostname: process.env.HOST,
      cacheTime: 1000 * 60 * 15,
      gzip: true,
      generate: true, // Enable me when using nuxt generate
      exclude: [],
      routes: [
        '',
        '/about',
      ]
    }],
    ['@nuxtjs/google-analytics', {
      id: "UA-117936764-1",
    }],
    // ['nuxt-i18n'],
  ],
  /**
   * Custom Plugins
   */
  plugins: [
    { src: '~/plugins/google-map.js', ssr: false },
  ],
  /**
   * Enviroment variables
   */
  env: {
    HOST: "https://bike.sympathique.me",
    RELEASE_DATE: Date.now(),
  },
  /**
   * Build configuration
   */
  build: {
    /**
     * Run ESLint on save
     */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
