export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (isAuth) {
    if (!authStore.user?.roles) return abortNavigation();

    for (let role of authStore.user?.roles) {
      if (role == "student")
        return true;
    }
  }
  return abortNavigation();
})