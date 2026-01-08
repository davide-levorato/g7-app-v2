import _ from 'lodash'
import { boot  } from 'quasar/wrappers'

import { useServiceStore } from "stores/service"

const redirectToLogin = function (next, routeTo) {
  // Pass the original route to the login component
  next({ name: 'rtLogin', query: { redirectFrom: routeTo.fullPath } })
}

export default boot (({ router, store }) => {
  // Before each route evaluates ...
  router.beforeEach(async function (routeTo, _routeFrom, next) {
    const serviceStore = useServiceStore(store)

    // Check if auth is required on this route
    // (including nested routes).
    const authRequired = _.get(routeTo, 'meta.auth', '') === 'required'

    // If auth is required and the user is logged in...
    const loggedIn = serviceStore.loggedIn

    // If auth isn't required for the route, just continue.
    if (!authRequired) {
      /*
      se tento di entrare nella form di login essendo loggato faccio un redirect a main
      */
      if (routeTo.name === 'rtLogin' && loggedIn) {
        next({ name: "rtHome" })
        return
      } else {
        /*
          salvo la rotta corrente nello stato
        */
        serviceStore.routeSet(routeTo)
        next()
        return
      }
    }

    if (authRequired && loggedIn) {
      /* convalido il token */
      try {
        serviceStore.setBaseApiToken()
        const validToken = await serviceStore.validateToken()
        if (validToken) {
          const giRes = await serviceStore.getUserInfo()
          /*
          controllo che un utente non stia entrando in una rotta dove non può accedere
          */
          const userRole = _.get(giRes, 'role', '')
          const routeRoles = _.get(routeTo.meta.roles)
          serviceStore.routeSet(routeTo)
          if (routeTo.path === '/') {
            next({ name: "rtHome" })
            return
          } else {
            if (_.isEmpty(routeRoles)) {
              next()
              return
            } else {
              if (_.includes(routeRoles, userRole)) {
                next()
                return
              } else {
                next({ name: "rtHome" })
                return
              }
            }
          }
        } else {
          redirectToLogin(next, {})
          return
        }
      } catch (e) {
        console.error(e)
        redirectToLogin(next, {})
        return
      }
    }

    if (authRequired) {
      redirectToLogin(next, {})
      return
    }
  })

  router.beforeResolve(async (routeTo, routeFrom, next) => {
    // Create a `beforeResolve` hook, which fires whenever
    // `beforeRouteEnter` and `beforeRouteUpdate` would. This
    // allows us to ensure data is fetched even when params change,
    // but the resolved route does not. We put it in `meta` to
    // indicate that it's a hook we created, rather than part of
    // Vue Router (yet?).
    try {
      // For each matched route...
      for (const route of routeTo.matched) {
        await new Promise((resolve, reject) => {
          // If a `beforeResolve` hook is defined, call it with
          // the same arguments as the `beforeEnter` hook.
          if (route.meta && route.meta.beforeResolve) {
            route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
              // If the user chose to redirect...
              if (args.length) {
                // If redirecting to the same route we're coming from...
                /* if (routeFrom.name === args[0].name) {
                } */
                // Complete the redirect.
                next(...args);
                reject(new Error("Redirected"));
              } else {
                resolve();
              }
            });
          } else {
            // Otherwise, continue resolving the route.
            resolve();
          }
        });
      }
      // If a `beforeResolve` hook chose to redirect, just return.
    } catch (e) {
      console.error(e)
      return
    }

    // If we reach this point, continue resolving the route.
    next()
  })

  // When each route is finished evaluating...
  router.afterEach((/* routeTo, routeFrom */) => {
  })
})
