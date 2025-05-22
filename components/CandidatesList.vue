<script setup lang="ts">
// import type { User } from '~/types/user.interface'; // Уже не нужен здесь, т.к. тип приходит из store

const matchStore = useMatching();

// --- Обработчики действий для конкретного кандидата ---

async function handleLike(userId: string) {
  if (!userId) return;

  console.log(`Processing like for user ID: ${userId} from component`);
  try {
    const success = await matchStore.processLike(userId);
    if (success) {
      console.log("Like successful for:", userId);
    } else {
      console.warn("Like processed but API indicated not successful for:", userId);
      // Возможно, показать временную ошибку пользователю (toast уже может быть показан плагином)
    }
  } catch (error) {
    console.error("Error during handleLike in component:", error);
  }
}

function handleDislike(userId: string) {
  if (!userId) return;
  console.log(`Disliking user ID: ${userId} from component`);
  // Если `processDislike` это просто удаление из списка без API запроса:
  matchStore.removeCandidateById(userId);

  // Если есть API для дизлайка, раскомментируйте и адаптируйте:
  /*
  try {
    // const success = await matchStore.processDislike(userId);
    // if (success) {
    //   matchStore.removeCandidateById(userId); // Уже сделано выше или в store
    // }
  } catch (error) {
    console.error("Error during handleDislike in component:", error);
  }
  */

  // Опционально: подгрузить еще
  if (matchStore.candidates.length < 3 && !matchStore.isLoadingMatches) {
    console.log("Fetching more matches proactively after dislike...");
    matchStore.fetchMatches();
  }
}

// --- Жизненный цикл и загрузка данных ---
onMounted(async () => {
  if (matchStore.candidates.length === 0 && !matchStore.isLoadingMatches) {
    console.log("No initial candidates in store, fetching...");
    await matchStore.fetchMatches();
  }
})

// --- Вычисляемые свойства для состояний UI ---
const showLoading = computed(() => {
  return matchStore.isLoadingMatches && matchStore.candidates.length === 0;
});

const showEmpty = computed(() => {
  return !matchStore.isLoadingMatches && !matchStore.errorLoadingMatches && matchStore.candidates.length === 0;
});

const showError = computed(() => {
  return !!matchStore.errorLoadingMatches && matchStore.candidates.length === 0 && !matchStore.isLoadingMatches;
});

function getAge(age: number): string {
  if (age == 0) return "не указан";
  let txt;
  let count = age % 100; // Получаем последние две цифры

  if (count >= 11 && count <= 19) { // Для чисел от 11 до 19 всегда "лет"
    txt = 'лет';
  } else {
    count = age % 10; // Получаем последнюю цифру
    if (count === 1) {
      txt = 'год';
    } else if (count >= 2 && count <= 4) {
      txt = 'года';
    } else {
      txt = 'лет';
    }
  }
  return age + " " + txt;
}

function getGender(gender: string): string {
  if (gender == "" || !gender) return "не указан"
  return gender === 'male' ? 'Мужской' : gender === 'female' ?
    'Женский' :
    gender;
}

</script>
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12">

      <!-- Состояние загрузки -->
      <div v-if="showLoading" class="text-center pa-5 fill-height d-flex flex-column justify-center align-center"
        style="min-height: 60vh;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Ищем пользователей...</p>
      </div>

      <!-- Состояние ошибки -->
      <div v-else-if="showError" class="text-center pa-5 fill-height d-flex flex-column justify-center align-center"
        style="min-height: 60vh;">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <p class="mt-4 text-h6">Ошибка при загрузке</p>
        <p class="body-1" v-if="matchStore.errorLoadingMatches">{{ matchStore.errorLoadingMatches.message }}</p>
        <v-btn @click="matchStore.fetchMatches()" :loading="matchStore.isLoadingMatches" color="primary" class="mt-4">
          Попробовать снова
        </v-btn>
      </div>

      <!-- Список кандидатов -->
      <!-- Показываем, если не загрузка, не ошибка, и есть кандидаты -->
      <v-row v-else-if="matchStore.candidates.length > 0" class="d-flex justify-start">
        <v-col cols="12" xl="6" v-for="(candidate) of matchStore.candidates" :key="candidate._id">
          <div class="card border">

            <v-btn icon variant="flat" :color="candidate.isLiked ? 'grey' : 'secondary2'" density="comfortable"
              class="like-button-top-right" :disabled="candidate.isLiked" @click.stop="handleLike(candidate._id)"
              aria-label="Лайкнуть">
              <v-icon size="small">mdi-heart</v-icon>
              <v-tooltip activator="parent" location="bottom">Познакомиться</v-tooltip>
            </v-btn>

            <v-row style="display: flex; flex-direction: column; justify-content: space-between !important;">
              <v-col cols="12" class="d-flex align-center">
                <v-avatar color="secondary" class="mr-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>

                <h3>
                  {{ candidate.name }} {{ candidate.surname }}
                </h3>
              </v-col>
              <v-col cols="12" v-if="candidate?.idealPartnerDescription">
                {{ candidate.idealPartnerDescription }}
              </v-col>
              <v-col cols="12">
                <div class="my-1">
                  <strong>Возраст:</strong> {{ getAge(candidate?.age ?? 0) }}
                </div>
                <div class="my-1">
                  <strong>Пол:</strong> {{ getGender(candidate?.gender ?? "") }}
                </div>
                <div class="my-1 d-flex">
                  <strong>Уровень языка:</strong>
                  <div class="cursor-pointer ml-1">
                    {{ candidate.langLevel?.name || "не указан" }}
                    <v-tooltip activator="parent" location="top">
                      {{ candidate.langLevel?.description || "не указано" }}
                    </v-tooltip>
                  </div>
                </div>
              </v-col>


              <!-- <v-col cols="12" class="pt-3 mt-auto">
                <div class="d-flex justify-space-around align-center ga-2">
                  <v-btn variant="outlined" color="blue-grey" @click="handleDislike(candidate._id)"
                    aria-label="Пропустить" size="large" icon>
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="top">Пропустить</v-tooltip>
                  </v-btn>
                  <v-btn variant="flat" color="pink-lighten-1" @click="handleLike(candidate._id)" aria-label="Лайкнуть"
                    size="large" icon>
                    <v-icon>mdi-heart</v-icon>
                    <v-tooltip activator="parent" location="top">Лайкнуть</v-tooltip>
                  </v-btn>
                </div>
              </v-col> -->
            </v-row>
          </div>
        </v-col>
      </v-row>

      <!-- Пустое состояние -->
      <div v-else-if="showEmpty" class="text-center pa-5 fill-height d-flex flex-column justify-center align-center"
        style="min-height: 60vh;">
        <v-icon size="64" color="grey">mdi-account-search-outline</v-icon>
        <p class="mt-4 text-h6">Нет кандидатов на сегодня</p>
        <v-btn @click="matchStore.fetchMatches()" :loading="matchStore.isLoadingMatches" color="primary" class="mt-4">
          Поискать ещё раз
        </v-btn>
      </div>

    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
/* Опционально: если хотите, чтобы состояния загрузки/ошибки/пусто занимали высоту */
.fill-height {
  min-height: calc(60vh - 40px);
  /* 60vh минус паддинги v-container/v-col если есть */
}

.card {
  border-radius: 20px;
  padding: 20px;
  height: 100%;
  position: relative;
}

.like-button-top-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}
</style>