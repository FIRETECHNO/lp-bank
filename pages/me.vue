<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import type { User, LangLevel } from "~/types/user.interface";

const authStore = useAuth();
const router = useRouter(); // Для навигации

const user = computed<User | null>(() => authStore.user as User | null);

function formatLangLevels(levels: LangLevel[] | undefined): string {
  if (!levels || levels.length === 0) return "Не указано";
  return levels.map((level) => level.name).join(", ");
}

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

const hasPersonalInfo = computed(() => {
  return //(
     user.value //&&
  //   (user.value.gender ||
  //     user.value.age ||
  //     user.value.langLevel ||
  //     user.value.idealPartnerDescription)
  // );
});

const hasPartnerFilters = computed(() => {
  return //(
     user.value //&&
  //   user.value.partnerFilters &&
  //   (user.value.partnerFilters.gender ||
  //     (user.value.partnerFilters.minAge && user.value.partnerFilters.maxAge) ||
  //     (user.value.partnerFilters.langLevel &&
  //       user.value.partnerFilters.langLevel.length > 0))
  // );
});
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
                <span
                  class="text-h5 text-primary-darken-2"
                  v-if="user.name && user.surname"
                >
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
          <v-col
            cols="12"
            md="auto"
            class="d-flex justify-start justify-md-end mt-4 mt-md-0"
          >
            <v-btn
              variant="outlined"
              color="grey-darken-2"
              @click="handleLogout"
              class="mr-2"
              prepend-icon="mdi-logout"
            >
              Выйти
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="router.push('/about-me-form')"
              prepend-icon="mdi-pencil-outline"
            >
              Редактировать
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6 my-md-8"></v-divider>

        <!-- Секция: Личная информация -->
        <section class="mb-8">
          <h2
            class="text-h5 font-weight-medium mb-4 d-flex align-center text-grey-darken-3"
          >
            <v-icon start color="primary">mdi-account-details-outline</v-icon>
            Личная информация
          </h2>
          <v-card flat color="transparent">
            <v-card-text class="pa-0">
              <div v-if="hasPersonalInfo" class="profile-grid">
                <div v-if="user.gender" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">Пол</div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ formatGender(user.gender) }}
                  </div>
                </div>
                <div v-if="user.age" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">Возраст</div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ user.age }}
                  </div>
                </div>
                <div v-if="user.langLevel" class="profile-grid-item">
                  <div class="text-subtitle-2 text-grey-darken-2">
                    Мой уровень языка
                  </div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ user.langLevel.name }}
                    <span class="text-caption text-grey-darken-1"
                      >({{ user.langLevel.description }})</span
                    >
                  </div>
                </div>
                <div
                  v-if="user.idealPartnerDescription"
                  class="profile-grid-item full-width"
                >
                  <div class="text-subtitle-2 text-grey-darken-2">
                    Описание идеального партнера
                  </div>
                  <p
                    class="text-body-1 text-grey-darken-4"
                    style="white-space: pre-wrap"
                  >
                    {{ user.idealPartnerDescription }}
                  </p>
                </div>
              </div>
              <v-alert
                v-else
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-information-outline"
              >
                Личная информация не заполнена.
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  @click="router.push('/about-me-form')"
                  class="ml-2"
                  >Заполнить</v-btn
                >
              </v-alert>
            </v-card-text>
          </v-card>
        </section>

        <!-- Секция: Предпочтения по партнеру -->
        <section>
          <h2
            class="text-h5 font-weight-medium mb-4 d-flex align-center text-grey-darken-3"
          >
            <v-icon start color="primary">mdi-account-search-outline</v-icon>
            Предпочтения по партнеру
          </h2>
          <v-card flat color="transparent">
            <v-card-text class="pa-0">
              <div v-if="hasPartnerFilters" class="profile-grid">
                <div
                  v-if="user.partnerFilters?.gender"
                  class="profile-grid-item"
                >
                  <div class="text-subtitle-2 text-grey-darken-2">
                    Предпочитаемый пол
                  </div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ formatGender(user.partnerFilters.gender) }}
                  </div>
                </div>
                <div
                  v-if="
                    user.partnerFilters?.minAge && user.partnerFilters?.maxAge
                  "
                  class="profile-grid-item"
                >
                  <div class="text-subtitle-2 text-grey-darken-2">
                    Предпочитаемый возраст
                  </div>
                  <div class="text-body-1 text-grey-darken-4">
                    От {{ user.partnerFilters.minAge }} до
                    {{ user.partnerFilters.maxAge }}
                  </div>
                </div>
                <div
                  v-if="
                    user.partnerFilters?.langLevel &&
                    user.partnerFilters.langLevel.length > 0
                  "
                  class="profile-grid-item"
                >
                  <div class="text-subtitle-2 text-grey-darken-2">
                    Предпочитаемые уровни языка
                  </div>
                  <div class="text-body-1 text-grey-darken-4">
                    {{ formatLangLevels(user.partnerFilters.langLevel) }}
                  </div>
                </div>
              </div>
              <v-alert
                v-else
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-information-outline"
              >
                Предпочтения по партнеру не указаны.
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  @click="router.push('/about-me-form')"
                  class="ml-2"
                  >Указать</v-btn
                >
              </v-alert>
            </v-card-text>
          </v-card>
        </section>
      </v-container>

      <v-container
        v-else
        class="d-flex flex-column align-center justify-center fill-height"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
          class="mb-4"
        ></v-progress-circular>
        <p class="text-subtitle-1 text-grey-darken-2 mb-4">
          Загрузка данных пользователя...
        </p>
        <v-alert
          v-if="!user"
          type="warning"
          variant="tonal"
          width="100%"
          max-width="400px"
        >
          Не удалось загрузить данные или пользователь не аутентифицирован.
          <template v-slot:append>
            <v-btn to="/login" color="primary" variant="flat" class="mt-2"
              >Войти</v-btn
            >
          </template>
        </v-alert>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.profile-grid-item {
  padding-bottom: 16px;
}

.profile-grid-item.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 600px) {
  .profile-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  h1.text-h4 {
    font-size: 1.75rem !important;
  }

  h2.text-h5 {
    font-size: 1.25rem !important;
  }

  .v-container {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
