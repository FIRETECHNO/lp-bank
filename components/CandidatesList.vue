<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useMatching } from '~/stores/matching'; // Уточните путь, если нужно
// import type { User } from '~/types/user.interface'; // Уже не нужен здесь, т.к. тип приходит из store
import CandidateCard from '~/components/CandidateCard.vue'; // Предполагаемый путь к вашему компоненту карточки

const matchStore = useMatching();

// --- Обработчики действий для конкретного кандидата ---

async function handleLike(userId: string) {
  if (!userId) return;

  console.log(`Processing like for user ID: ${userId} from component`);
  try {
    const success = await matchStore.processLike(userId);
    if (success) {
      console.log("Like successful for:", userId);
      // Удаляем из локального списка в store для немедленного обновления UI
      matchStore.removeCandidateById(userId);

      // Опционально: подгрузить еще, если список стал коротким
      if (matchStore.candidates.length < 3 && !matchStore.isLoadingMatches) {
        console.log("Fetching more matches proactively...");
        matchStore.fetchMatches(); // Загрузка в фоне
      }
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
  // Показываем загрузку, если она активна И кандидатов еще нет
  return matchStore.isLoadingMatches && matchStore.candidates.length === 0;
});

const showEmpty = computed(() => {
  // Показываем "пусто", если не загрузка, нет ошибки И нет кандидатов
  return !matchStore.isLoadingMatches && !matchStore.errorLoadingMatches && matchStore.candidates.length === 0;
});

const showError = computed(() => {
  // Показываем ошибку, если есть ошибка И кандидатов нет (чтобы не показывать ошибку поверх старых данных)
  // И не идет загрузка (чтобы не показывать ошибку и спиннер одновременно)
  return !!matchStore.errorLoadingMatches && matchStore.candidates.length === 0 && !matchStore.isLoadingMatches;
});

</script>

<template>
  <v-container>
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
            {{ candidate }}
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
  </v-container>
</template>

<style scoped>
/* Опционально: если хотите, чтобы состояния загрузки/ошибки/пусто занимали высоту */
.fill-height {
  min-height: calc(60vh - 40px);
  /* 60vh минус паддинги v-container/v-col если есть */
}
</style>