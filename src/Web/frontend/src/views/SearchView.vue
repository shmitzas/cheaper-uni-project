<script setup>
import Search from "../components/Search.vue";
</script>

<template>
  <main>
    <Search />
  </main>
</template>


<script>
export default {
  props: ['query']
}
</script>