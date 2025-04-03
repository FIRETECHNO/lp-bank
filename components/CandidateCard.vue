<script setup lang="ts">
const props = defineProps<{
  candidate: any
}>()

const emit = defineEmits(['like', 'dislike'])

let { candidate } = toRefs(props);
</script>
<template>
  <v-skeleton-loader class="card border" v-if="!candidate?._id" type="image, article"></v-skeleton-loader>

  <div v-else class="card border">
    {{ candidate }}
    <v-row>
      <v-col cols="12">

      </v-col>
      <v-col cols="12" class="d-flex justify-space-around">
        <v-btn icon="mdi-thumb-down-outline" variant="tonal" @click="emit('dislike')"></v-btn>
        <v-btn icon="mdi-heart-outline" color="primary" variant="tonal" @click="emit('like')"></v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped lang="scss">
.card {
  border-radius: 20px;
  padding: 20px;
  height: 100%;
}
</style>