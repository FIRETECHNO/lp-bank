<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
  layout: "admin-cabinet",
})

const authStore = useAuth();
const router = useRouter();

async function handleLogout() {
  try {
    await authStore.logout();
    router.push("/");
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error);
  }
}
</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="11" xl="10">
      <p class="text-h4">Страница Админа</p>
      <v-btn variant="outlined" color="grey-darken-2" @click="handleLogout" class="mr-2" prepend-icon="mdi-logout">
        Выйти
      </v-btn>
    </v-col>
  </v-row>
</template>