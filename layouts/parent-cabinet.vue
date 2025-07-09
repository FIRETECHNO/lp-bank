<script setup lang="ts">
let navigationItems = ref([
  {
    icon: "mdi-information-slab-circle-outline",
    text: "Обо мне",
    route: "/parent/me"
  },
  {
    icon: "mdi-cart",
    text: "Покупки",
    route: "/parent/orders"
  },
  {
    icon: "mdi-bell",
    text: "Уведомления",
    route: "/parent/inbox"
  },
])
</script>
<template>
  <v-app full-height>
    <MainLayoutHeader />

    <v-main>
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="11" xl="10">
            <v-list nav lines="one" class="d-flex" variant="tonal">
              <v-list-item v-for="(item, index) of navigationItems" :key="index" color="primary" :to="item.route"
                style="border-radius: 12px;" class="ma-1">
                <v-list-item-title class="text-subtitle-1	font-weight-medium d-flex align-center">
                  <v-icon :icon="item.icon" class="mr-3"></v-icon>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <slot /> <!-- This is where your page content will be rendered -->
      </v-container>
    </v-main>

    <MainLayoutFooter />
  </v-app>
</template>
<style scoped lang="scss"></style>