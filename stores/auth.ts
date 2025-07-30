import { defineStore } from "pinia"
import AuthAPI from "../api/AuthApi"

import type { User, Role } from "../types/user.interface"

import { ref, computed } from "vue"
import MatchApi from "~/api/MatchApi"
import type { Lesson } from "~/types/lesson.interface"


export const useAuth = defineStore('auth', () => {
  let user = ref<User | null>()

  let role = computed<string>(() => {
    if (user.value?.roles.includes("student")) return "student"
    if (user.value?.roles.includes("parent")) return "parent"
    return user.value?.roles[0] ?? "user"
  })

  let lessons = ref<Lesson[]>([])

  async function registration(data: any, parentId?: string): Promise<boolean> {
    try {
      let response;
      if (parentId) {
        // Родитель регистрирует Ребенка
        response = await AuthAPI.registration(data, parentId)
      } else {
        // обычная регистрация
        response = await AuthAPI.registration(data)
      }

      if (response.status.value != "success") return false;

      if (response.data.value && !parentId) {
        user.value = response.data.value.user
      }
      return true
    } catch {
      return false
    }
  }


  async function login(email: string, password: string) {
    try {
      const response = await AuthAPI.login(email, password)
      if (response.data.value) {
        user.value = response.data.value.user
      }
      return response
    } catch {
      return false
    }
  }

  async function checkAuth(): Promise<boolean> {
    try {
      if (user.value?._id) {
        return true
      }
      const response = await AuthAPI.refresh()

      if (response.data.value?._id) {
        user.value = response.data.value
        return true
      } else {
        return false
      }
    } catch (error) {
      await logout()
      return false
    }
  }

  async function getAllUsers(): Promise<any> {
    try {
      return await AuthAPI.getAllUsers()
    } catch (error) {
      console.log(error);
    }
  }

  // async function checkAdmin(): Promise<boolean | undefined> {
  //   try {
  //     if (!user.value?._id) {
  //       const response = await AuthAPI.refresh()
  //       if (response.data.value?._id) {
  //         user.value = response.data.value
  //       }
  //     }

  //     //array.some() проверяет, удовлетворяет ли хотя бы один элемент массива условию
  //     const hasAdminRole = user?.value?.roles.some(role => role === 'admin');
  //     return hasAdminRole
  //   } catch (error) {
  //     await logout()
  //     return false
  //   }
  // }
  // async function checkManager(): Promise<boolean | undefined> {
  //   try {
  //     if (!user.value?._id) {
  //       const response = await AuthAPI.refresh()
  //       if (response.data.value?._id) {
  //         user.value = response.data.value
  //       }
  //     }

  //     //array.some() проверяет, удовлетворяет ли хотя бы один элемент массива условию
  //     const hasManagerRole = user?.value?.roles.some(role => role === 'manager');
  //     return hasManagerRole
  //   } catch (error) {
  //     await logout()
  //     return false
  //   }
  // }

  async function logout(): Promise<any> {
    try {
      let res = await AuthAPI.logout()

      user.value = null
      useRouter().push('/')
      return res
    } catch { }
  }

  async function updateUser(newUser: any, userId: string) {
    try {
      let res = await AuthAPI.updateUser(newUser, userId);

      if (res.status.value == 'success') {
        user.value = res.data.value;
      }

      return res
    } catch { }
  }

  async function sendResetLink(email: string): Promise<any> {
    try {
      return await AuthAPI.sendResetLink(email)
    } catch (error) {
      console.log(error);
    }
  }

  async function resetPassword(password: string, userId: string, token: string): Promise<any> {
    try {
      return await AuthAPI.resetPassword(password, userId, token)
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadAvatar(fd: FormData, userId: string) {
    try {
      return await AuthAPI.uploadAvatar(fd, userId);
    } catch (error) {
      console.log(error);
    }
  }

  function Equals(other: User): boolean {
    if (other == null) return false;

    return user.value?.email == other.email &&
      user.value.name == other.name &&
      user.value.surname == other.surname;
  }

  async function updateAboutMe(data: { personal?: any, partnerFilters?: any }): Promise<{ success: boolean }> {
    if (!user.value?._id)
      return { success: false };

    let result = await AuthAPI.updateAboutMe({ userId: user.value._id, ...data });

    if (result?.updatedUser != null) {
      user.value = result.updatedUser;
      return { success: true };
    }
    return { success: false };
  }

  async function getMyLessons() {
    let { user, role } = useAuth()
    if (!user?._id) return;

    lessons.value = await AuthAPI.getMyLessons(user._id, role);
  }

  return {
    // variables
    user, role, lessons,
    // functions
    registration, login, checkAuth, logout,
    updateUser, sendResetLink, resetPassword,
    getAllUsers, uploadAvatar, Equals, updateAboutMe, getMyLessons,
  }
})
