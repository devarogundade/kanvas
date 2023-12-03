<template>
  <main>
    <RouterView />

    <SnackbarPop />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import SnackbarPop from './components/SnackbarPop.vue';
</script>
