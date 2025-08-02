import { toast } from "vue3-toastify";

export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (isAuth) {
    if (!authStore.user?.rights) {
      toast("Получите права у администратора!", { type: "warning" })
      return abortNavigation();
    }
    if (authStore.user.rights.includes("can-start-lessons")) return true;
  }
  toast("Получите права у администратора!", { type: "warning" })
  return abortNavigation();
})