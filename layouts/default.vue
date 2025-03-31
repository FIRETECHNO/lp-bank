<script setup lang="ts"></script>
<template>
  <v-app>
    <v-app-bar app>
      <v-btn>logo</v-btn>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-account" to="/me"></v-btn>
      <v-btn icon="mdi-chat-outline" to="/chats"></v-btn>
    </v-app-bar>

    <v-main>
      <slot /> <!-- This is where your page content will be rendered -->
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<style scoped lang="scss"></style>