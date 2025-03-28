export default defineNuxtRouteMiddleware(() => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (isAuth && authStore.user?.roles[0] == 'admin') {
    return setPageLayout('admin')
  } else if (isAuth && authStore.user?.roles[0] == 'student') {
    return setPageLayout('default')
  } else if (isAuth && authStore.user?.roles[0] == 'teacher') {
    return setPageLayout('teacher')
  }
})