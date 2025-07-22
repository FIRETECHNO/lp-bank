<script setup lang="ts">

import type { User } from '~/types/user.interface';


definePageMeta({
  layout: "teacher-cabinet"
})

const authStore = useAuth();
const router = useRouter();

// let user = authStore.user;

const user = computed<User | null>(() => authStore.user as User | null);
const hasPersonalInfo = computed(() => {
  return user.value;
});

function formatGender(genderKey?: string): string {
  if (!genderKey) return "Не указан";
  switch (genderKey) {
    case "male":
      return "Мужчина";
    case "female":
      return "Женщина";
    case "any":
      return "Любой";
    default:
      return genderKey;
  }
}

async function handleLogout() {
  try {
    await authStore.logout();
    router.push("/");
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error);
  }
}

function accessReview() {
  //if user.value?.roles == 
}

</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" md="11" xl="10">
      <v-container v-if="user">
        <!-- Заголовок страницы и основные действия -->
        <v-row align="center" class="mb-6 mb-md-8">
          <v-col cols="12" md="auto">
            <div class="d-flex align-center">
              <v-avatar color="primary" variant="tonal" size="64" class="mr-4">
                <span class="text-h5 text-primary-darken-2" v-if="user.name && user.surname">
                  {{ user.name.charAt(0).toUpperCase()
                  }}{{ user.surname.charAt(0).toUpperCase() }}
                </span>
                <v-icon v-else color="primary">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">
                  {{ user.name }} {{ user.surname }}
                </h1>
                <p class="text-subtitle-1 text-grey-darken-1">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="auto" class="d-flex justify-start justify-md-end mt-4 mt-md-0">
            <v-btn variant="outlined" color="grey-darken-2" @click="handleLogout" class="mr-2"
              prepend-icon="mdi-logout">
              Выйти
            </v-btn>
            <v-btn color="primary" variant="flat" @click="router.push('/about-me-form')"
              prepend-icon="mdi-pencil-outline">
              Редактировать
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6 my-md-8"></v-divider>

        <!-- Секция: Резюме -->
        <section class="mb-8">
          <h2 class="text-h5 font-weight-medium mb-4 d-flex align-center text-grey-darken-3">
            <v-icon start color="primary">mdi mdi-account-card-outline</v-icon>
            Резюме
          </h2>
          <v-card flat color="transparent">
            <v-card-text class="pa-0">
              <div v-if="hasPersonalInfo" class="profile-grid">
                <div v-if="user.phone" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">Образование</div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ user.educationLevel }}
                  </div>
                </div>
              </div>
              <div v-if="hasPersonalInfo" class="profile-grid">
                <div v-if="user.phone" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">Опыт работы</div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ user.experience }}
                  </div>
                </div>
              </div>
              <div v-if="hasPersonalInfo" class="profile-grid">
                <div v-if="user.phone" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">Достижения, квалификация</div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ user.achievements }}
                  </div>
                </div>
              </div>
              <v-card flat color="transparent">
                <v-card-text class="pa-0">
                  <v-alert type="info" variant="tonal" density="compact" icon="mdi mdi-pencil-outline">
                    <v-row justify="start">
                      <v-btn variant="text" color="primary" to="/update-teacher-summary">Изменить</v-btn>
                    </v-row>
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </section>
        <!-- Секция: Мои уроки -->
        <section>
          <h2 class="text-h5 font-weight-medium mb-4 d-flex align-center text-grey-darken-3">
            <v-icon start color="primary">mdi-account-child-outline</v-icon>
            Предстоящие занятия
          </h2>
          <v-card flat color="transparent">
            <v-card-text class="pa-0">
              <v-alert type="info" variant="tonal" density="compact" icon="mdi-information-outline">
                Уроки не добавлены
                <v-btn variant="text" size="small" color="primary" to="/student-registration"
                  class="ml-2">Добавить</v-btn>
              </v-alert>
            </v-card-text>
          </v-card>
        </section>
      </v-container>

      <v-container v-else class="d-flex flex-column align-center justify-center fill-height">
        <v-progress-circular indeterminate color="primary" size="64" width="6" class="mb-4"></v-progress-circular>
        <p class="text-subtitle-1 text-grey-darken-2 mb-4">
          Загрузка данных пользователя...
        </p>
        <v-alert v-if="!user" type="warning" variant="tonal" width="100%" max-width="400px">
          Не удалось загрузить данные или пользователь не аутентифицирован.
          <template v-slot:append>
            <v-btn to="/login" color="primary" variant="flat" class="mt-2">Войти</v-btn>
          </template>
        </v-alert>
      </v-container>
    </v-col>
  </v-row>
</template>
