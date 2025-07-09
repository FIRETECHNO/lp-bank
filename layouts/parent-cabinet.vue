<script setup lang="ts"></script>
<template>
  <v-app full-height>
    <MainLayoutHeader />

    <v-main>
      <v-container>
        <slot /> <!-- This is where your page content will be rendered -->
      </v-container>
    </v-main>

    <MainLayoutFooter />
  </v-app>
</template>
<style scoped lang="scss"></style>