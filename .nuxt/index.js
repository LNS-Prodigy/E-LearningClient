import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '..\\layouts\\error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_workbox_bc573d76 from 'nuxt_plugin_workbox_bc573d76' // Source: .\\workbox.js (mode: 'client')
import nuxt_plugin_nuxticons_2032607f from 'nuxt_plugin_nuxticons_2032607f' // Source: .\\nuxt-icons.js (mode: 'all')
import nuxt_plugin_router_3975f666 from 'nuxt_plugin_router_3975f666' // Source: .\\router.js (mode: 'all')
import nuxt_plugin_global_0a6ae274 from 'nuxt_plugin_global_0a6ae274' // Source: ..\\components\\global (mode: 'all')
import nuxt_plugin_i18n_56ca5e75 from 'nuxt_plugin_i18n_56ca5e75' // Source: ..\\plugins\\i18n (mode: 'all')
import nuxt_plugin_vform_f95cee7a from 'nuxt_plugin_vform_f95cee7a' // Source: ..\\plugins\\vform (mode: 'all')
import nuxt_plugin_axios_fb9c9a02 from 'nuxt_plugin_axios_fb9c9a02' // Source: ..\\plugins\\axios (mode: 'all')
import nuxt_plugin_fontawesome_773d88fd from 'nuxt_plugin_fontawesome_773d88fd' // Source: ..\\plugins\\fontawesome (mode: 'all')
import nuxt_plugin_passwordstrength_3503f83c from 'nuxt_plugin_passwordstrength_3503f83c' // Source: ..\\plugins\\password-strength (mode: 'all')
import nuxt_plugin_flatpickr_5e6d3f98 from 'nuxt_plugin_flatpickr_5e6d3f98' // Source: ..\\plugins\\flat-pickr (mode: 'all')
import nuxt_plugin_moment_4ffca6d2 from 'nuxt_plugin_moment_4ffca6d2' // Source: ..\\plugins\\moment (mode: 'all')
import nuxt_plugin_pagination_d793829e from 'nuxt_plugin_pagination_d793829e' // Source: ..\\plugins\\pagination (mode: 'all')
import nuxt_plugin_vueplyr_9c446a5a from 'nuxt_plugin_vueplyr_9c446a5a' // Source: ..\\plugins\\vue-plyr (mode: 'all')
import nuxt_plugin_cloudinary_349de125 from 'nuxt_plugin_cloudinary_349de125' // Source: ..\\plugins\\cloudinary (mode: 'all')
import nuxt_plugin_vuedraggable_f661f0e2 from 'nuxt_plugin_vuedraggable_f661f0e2' // Source: ..\\plugins\\vue-draggable (mode: 'all')
import nuxt_plugin_starrating_a4ecdd7e from 'nuxt_plugin_starrating_a4ecdd7e' // Source: ..\\plugins\\star-rating (mode: 'client')
import nuxt_plugin_tagsinput_07dd702d from 'nuxt_plugin_tagsinput_07dd702d' // Source: ..\\plugins\\tags-input (mode: 'client')
import nuxt_plugin_socialshare_50e912d6 from 'nuxt_plugin_socialshare_50e912d6' // Source: ..\\plugins\\social-share (mode: 'client')
import nuxt_plugin_clipboard2_8c86471a from 'nuxt_plugin_clipboard2_8c86471a' // Source: ..\\plugins\\clipboard2 (mode: 'client')
import nuxt_plugin_carousel_18037b92 from 'nuxt_plugin_carousel_18037b92' // Source: ..\\plugins\\carousel (mode: 'client')
import nuxt_plugin_readmore_7fb08a7c from 'nuxt_plugin_readmore_7fb08a7c' // Source: ..\\plugins\\readmore (mode: 'client')
import nuxt_plugin_offlinealert_162afb0a from 'nuxt_plugin_offlinealert_162afb0a' // Source: ..\\plugins\\offline-alert (mode: 'client')
import nuxt_plugin_numerals_f8ddea28 from 'nuxt_plugin_numerals_f8ddea28' // Source: ..\\plugins\\numerals (mode: 'client')
import nuxt_plugin_recaptchaV3_32a424e6 from 'nuxt_plugin_recaptchaV3_32a424e6' // Source: ..\\plugins\\recaptchaV3 (mode: 'client')
import nuxt_plugin_froala_678a3fac from 'nuxt_plugin_froala_678a3fac' // Source: ..\\plugins\\froala (mode: 'client')
import nuxt_plugin_vuesweetalert2_3d8b6ec8 from 'nuxt_plugin_vuesweetalert2_3d8b6ec8' // Source: ..\\plugins\\vue-sweetalert2 (mode: 'client')
import nuxt_plugin_bootstrap_0f900877 from 'nuxt_plugin_bootstrap_0f900877' // Source: ..\\plugins\\bootstrap (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp (ssrContext) {
  const router = await createRouter(ssrContext)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  const registerModule = store.registerModule
  store.registerModule = (path, rawModule, options) => registerModule.call(store, path, rawModule, Object.assign({ preserveState: process.client }, options))

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        const nuxt = this.nuxt || this.$options.nuxt
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  const inject = function (key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error('inject(key, value) has no value provided')
    }

    key = '$' + key
    // Add into app
    app[key] = value

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Plugin execution

  if (process.client && typeof nuxt_plugin_workbox_bc573d76 === 'function') {
    await nuxt_plugin_workbox_bc573d76(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxticons_2032607f === 'function') {
    await nuxt_plugin_nuxticons_2032607f(app.context, inject)
  }

  if (typeof nuxt_plugin_router_3975f666 === 'function') {
    await nuxt_plugin_router_3975f666(app.context, inject)
  }

  if (typeof nuxt_plugin_global_0a6ae274 === 'function') {
    await nuxt_plugin_global_0a6ae274(app.context, inject)
  }

  if (typeof nuxt_plugin_i18n_56ca5e75 === 'function') {
    await nuxt_plugin_i18n_56ca5e75(app.context, inject)
  }

  if (typeof nuxt_plugin_vform_f95cee7a === 'function') {
    await nuxt_plugin_vform_f95cee7a(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_fb9c9a02 === 'function') {
    await nuxt_plugin_axios_fb9c9a02(app.context, inject)
  }

  if (typeof nuxt_plugin_fontawesome_773d88fd === 'function') {
    await nuxt_plugin_fontawesome_773d88fd(app.context, inject)
  }

  if (typeof nuxt_plugin_passwordstrength_3503f83c === 'function') {
    await nuxt_plugin_passwordstrength_3503f83c(app.context, inject)
  }

  if (typeof nuxt_plugin_flatpickr_5e6d3f98 === 'function') {
    await nuxt_plugin_flatpickr_5e6d3f98(app.context, inject)
  }

  if (typeof nuxt_plugin_moment_4ffca6d2 === 'function') {
    await nuxt_plugin_moment_4ffca6d2(app.context, inject)
  }

  if (typeof nuxt_plugin_pagination_d793829e === 'function') {
    await nuxt_plugin_pagination_d793829e(app.context, inject)
  }

  if (typeof nuxt_plugin_vueplyr_9c446a5a === 'function') {
    await nuxt_plugin_vueplyr_9c446a5a(app.context, inject)
  }

  if (typeof nuxt_plugin_cloudinary_349de125 === 'function') {
    await nuxt_plugin_cloudinary_349de125(app.context, inject)
  }

  if (typeof nuxt_plugin_vuedraggable_f661f0e2 === 'function') {
    await nuxt_plugin_vuedraggable_f661f0e2(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_starrating_a4ecdd7e === 'function') {
    await nuxt_plugin_starrating_a4ecdd7e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_tagsinput_07dd702d === 'function') {
    await nuxt_plugin_tagsinput_07dd702d(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_socialshare_50e912d6 === 'function') {
    await nuxt_plugin_socialshare_50e912d6(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_clipboard2_8c86471a === 'function') {
    await nuxt_plugin_clipboard2_8c86471a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_carousel_18037b92 === 'function') {
    await nuxt_plugin_carousel_18037b92(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_readmore_7fb08a7c === 'function') {
    await nuxt_plugin_readmore_7fb08a7c(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_offlinealert_162afb0a === 'function') {
    await nuxt_plugin_offlinealert_162afb0a(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_numerals_f8ddea28 === 'function') {
    await nuxt_plugin_numerals_f8ddea28(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_recaptchaV3_32a424e6 === 'function') {
    await nuxt_plugin_recaptchaV3_32a424e6(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_froala_678a3fac === 'function') {
    await nuxt_plugin_froala_678a3fac(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuesweetalert2_3d8b6ec8 === 'function') {
    await nuxt_plugin_vuesweetalert2_3d8b6ec8(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_bootstrap_0f900877 === 'function') {
    await nuxt_plugin_bootstrap_0f900877(app.context, inject)
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, () => {
        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from, next) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
