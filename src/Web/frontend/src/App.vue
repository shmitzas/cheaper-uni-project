<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div id="app">
    <NavBar />
    <div class="container-fluid" >
      <router-view/>
    </div>
  </div>
</template>

<style>
@import "./assets/styles.css";
</style>

<script>
export default {
  name: 'app'
};
</script>