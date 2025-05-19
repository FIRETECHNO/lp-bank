<script setup lang="ts">
defineProps<{
  match: any,
  status: string,
}>()
function getAge(age: number): string {
  if (age == 0) return "Возраст не указан";
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

// pending, accepted, denied
function getStatus(status: string) {
  if (status == "pending") return `<span class="mdi mdi-account-clock-outline"></span> в процессе`;
  if (status == "denied") return `<span class="mdi mdi-alert-circle-outline"></span> отклонено`;
  if (status == "accepted") return `<span class="mdi mdi-check-outline"></span> принято`;
}
</script>
<template>
  <div v-if="match._id" class="d-flex flex-column align-start cursor-pointer">
    <v-avatar color="surface-variant" size="50">
      {{ match?.name[0] }}
    </v-avatar>
    <div class="name">
      {{ match.name }}
      {{ match.surname }}
    </div>
    <div class="age">
      {{ getAge(match.age) }}
    </div>
    <span :class="status" v-html="getStatus(status)"></span>
  </div>
</template>
<style scoped>
.name {
  font-weight: 800;
  margin-top: 12px;
}

.age {
  font-weight: 800;
  color: grey;
}

/* pending, accepted, denied*/
.denied {
  color: red;
}

.accepted {
  color: green;
}

.pending {
  color: #FFAB00;
}

.pending,
.denied,
.accepted {
  text-align: center;
}
</style>