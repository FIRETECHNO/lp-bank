export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (!isAuth) {
    abortNavigation();
    // navigate to login page, now it's on /
    return navigateTo('/')
  }
})