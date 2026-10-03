<script setup>
import ScrollVideo from './components/ScrollVideo.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <main>
    <ScrollVideo />
  </main>
  <!-- the footer enters normal document flow after the last frame of the journey -->
  <SiteFooter />
</template>
