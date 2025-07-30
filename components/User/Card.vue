<!-- components/UserProfileCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '~/types/user.interface';

const props = defineProps<{
  user: User | null
}>();

const fullName = computed(() => `${props.user?.name} ${props.user?.surname}`);
const nameInitial = computed(() => props.user?.name ? props.user?.name[0].toUpperCase() : '');
// const avatarUrl = computed(() => props.user.avatars?.[0] || null);

</script>

<template>
  <v-card class="mx-auto" max-width="450" elevation="4" rounded="lg" v-if="user?._id">
    <v-card-title class="d-flex align-center pa-4">
      <!-- Аватар пользователя -->
      <v-avatar color="primary" size="56" class="mr-4">
        <span class="text-h5 text-white">{{ nameInitial }}</span>
      </v-avatar>

      <!-- Имя и Фамилия -->
      <div>
        <div class="text-h6">{{ fullName }}</div>
        <div class="text-subtitle-1 text-grey-darken-1">Профиль пользователя</div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Список контактной информации (теперь без @click) -->
    <v-list density="compact">
      <!-- Электронная почта -->
      <v-list-item :title="user.email" subtitle="Электронная почта">
        <template v-slot:prepend>
          <v-icon color="grey-darken-1" icon="mdi-email-outline"></v-icon>
        </template>
      </v-list-item>

      <v-divider inset></v-divider>

      <!-- Телефон -->
      <v-list-item :title="user.phone" subtitle="Телефон">
        <template v-slot:prepend>
          <v-icon color="grey-darken-1" icon="mdi-phone-outline"></v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <slot />
    </v-card-actions>
  </v-card>
</template>