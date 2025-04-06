<script setup lang="ts">
defineProps<{
  match: any,
  status: string,
}>()

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
      {{ 12 }} лет
    </div>
    <v-tooltip activator="parent" location="bottom">{{ status }}</v-tooltip>
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
</style>