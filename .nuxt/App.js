import Vue from 'vue'

import {
  getMatchedComponentsInstances,
  promisify,
  globalHandleError
} from './utils'

import NuxtError from '..\\layouts\\error.vue'
import NuxtLoading from './components/nuxt-loading.vue'
import NuxtBuildIndicator from './components/nuxt-build-indicator'

import '..\\assets\\sass\\app.scss'

import '..\\node_modules\\plyr\\dist\\plyr.css'

import _6f6c098b from '..\\layouts\\default.vue'
import _52896aab from '..\\layouts\\help-center.vue'
import _557a961d from '..\\layouts\\instructor-register.vue'
import _7821a113 from '..\\layouts\\instructor.vue'
import _94faadd8 from '..\\layouts\\learning.vue'
import _ee7125b0 from '..\\layouts\\simple.vue'

const layouts = { "_default": _6f6c098b,"_help-center": _52896aab,"_instructor-register": _557a961d,"_instructor": _7821a113,"_learning": _94faadd8,"_simple": _ee7125b0 }

export default {
  head: {"title":"Heroacademy","titleTemplate":"%s | Heroacademy","htmlAttrs":{"lang":"en"},"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"Unlock opportunity, study any topic, anytime. Explore thousands of courses for the lowest price ever!"},{"hid":"keywords","name":"keywords","content":"e-learning, academy, learn, your time, value"},{"hid":"og:url","name":"og:url","content":"http:\u002F\u002Flocalhost:3000"},{"hid":"og:title","name":"og:title","content":"Online Courses - Anytime, Anywhere | Heroacademy"},{"hid":"og:site_name","name":"og:site_name","content":"Online Courses | Heroacademy"},{"hid":"og:image","name":"og:image","content":"https:\u002F\u002Fres.cloudinary.com\u002Fdl9phqhv0\u002Fimage\u002Fupload\u002Fc_scale,h_630,w_1200\u002Fv1573179687\u002FHQ%20Images\u002Falexis-brown-omeaHbEFlN4-unsplash_m9sxu6.jpg"},{"hid":"og:description","name":"og:description","content":"Unlock opportunity, study any topic, anytime. Explore thousands of courses for the lowest price ever!"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"Heroacademy"},{"hid":"theme-color","name":"theme-color","content":"#bc4e9c"},{"hid":"og:type","name":"og:type","property":"og:type","content":"website"}],"noscript":[{"innerHTML":"Body No Scripts","body":true}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ficon.png"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Open+Sans&display=swap"},{"rel":"stylesheet","href":"https:\u002F\u002Fuse.fontawesome.com\u002Freleases\u002Fv5.0.1\u002Fcss\u002Fall.css"},{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.556a0fa3.json"},{"rel":"shortcut icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_64.4d7f59.png"},{"rel":"apple-touch-icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_512.4d7f59.png","sizes":"512x512"}],"style":[],"script":[]},

  render (h, props) {
    const loadingEl = h('NuxtLoading', { ref: 'loading' })

    if (this.nuxt.err && NuxtError) {
      const errorLayout = (NuxtError.options || NuxtError).layout
      if (errorLayout) {
        this.setLayout(
          typeof errorLayout === 'function'
            ? errorLayout.call(NuxtError, this.context)
            : errorLayout
        )
      }
    }

    const layoutEl = h(this.layout || 'nuxt')
    const templateEl = h('div', {
      domProps: {
        id: '__layout'
      },
      key: this.layoutName
    }, [layoutEl])

    const transitionEl = h('transition', {
      props: {
        name: 'layout',
        mode: 'out-in'
      },
      on: {
        beforeEnter (el) {
          // Ensure to trigger scroll event after calling scrollBehavior
          window.$nuxt.$nextTick(() => {
            window.$nuxt.$emit('triggerScroll')
          })
        }
      }
    }, [templateEl])

    return h('div', {
      domProps: {
        id: '__nuxt'
      }
    }, [
      loadingEl,
      h(NuxtBuildIndicator),
      transitionEl
    ])
  },

  data: () => ({
    isOnline: true,

    layout: null,
    layoutName: ''
  }),

  beforeCreate () {
    Vue.util.defineReactive(this, 'nuxt', this.$options.nuxt)
  },
  created () {
    // Add this.$nuxt in child instances
    Vue.prototype.$nuxt = this
    // add to window so we can listen when ready
    if (process.client) {
      window.$nuxt = this

      this.refreshOnlineStatus()
      // Setup the listeners
      window.addEventListener('online', this.refreshOnlineStatus)
      window.addEventListener('offline', this.refreshOnlineStatus)
    }
    // Add $nuxt.error()
    this.error = this.nuxt.error
    // Add $nuxt.context
    this.context = this.$options.context
  },

  mounted () {
    this.$loading = this.$refs.loading
  },
  watch: {
    'nuxt.err': 'errorChanged'
  },

  computed: {
    isOffline () {
      return !this.isOnline
    }
  },

  methods: {
    refreshOnlineStatus () {
      if (process.client) {
        if (typeof window.navigator.onLine === 'undefined') {
          // If the browser doesn't support connection status reports
          // assume that we are online because most apps' only react
          // when they now that the connection has been interrupted
          this.isOnline = true
        } else {
          this.isOnline = window.navigator.onLine
        }
      }
    },

    async refresh () {
      const pages = getMatchedComponentsInstances(this.$route)

      if (!pages.length) {
        return
      }
      this.$loading.start()

      const promises = pages.map((page) => {
        const p = []

        if (page.$options.fetch) {
          p.push(promisify(page.$options.fetch, this.context))
        }

        if (page.$options.asyncData) {
          p.push(
            promisify(page.$options.asyncData, this.context)
              .then((newData) => {
                for (const key in newData) {
                  Vue.set(page.$data, key, newData[key])
                }
              })
          )
        }

        return Promise.all(p)
      })
      try {
        await Promise.all(promises)
      } catch (error) {
        this.$loading.fail()
        globalHandleError(error)
        this.error(error)
      }
      this.$loading.finish()
    },

    errorChanged () {
      if (this.nuxt.err && this.$loading) {
        if (this.$loading.fail) {
          this.$loading.fail()
        }
        if (this.$loading.finish) {
          this.$loading.finish()
        }
      }
    },

    setLayout (layout) {
      if(layout && typeof layout !== 'string') {
        throw new Error('[nuxt] Avoid using non-string value as layout property.')
      }

      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      this.layoutName = layout
      this.layout = layouts['_' + layout]
      return this.layout
    },
    loadLayout (layout) {
      if (!layout || !layouts['_' + layout]) {
        layout = 'default'
      }
      return Promise.resolve(layouts['_' + layout])
    }
  },

  components: {
    NuxtLoading
  }
}
