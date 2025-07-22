export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (isAuth) {
    if (!authStore.user?.roles) return abortNavigation();

    for (let role of authStore.user?.roles) {
      if (role == "admin")
        return true;
    }
  }
  return abortNavigation();
})