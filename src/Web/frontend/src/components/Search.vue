<template>
  <main>
    <div class="row justify-content-center">
      <div class="col-md-12 d-flex justify-content-center mt-5 mb-5">
        <h3>All products related to</h3>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md d-block mb-4" v-for="item in products" :key="item.pid">
        <ProductCard :prod="item" />
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md d-block mb-5 mt-5">
        <button class="load-more">Load more</button>
      </div>
    </div>
  </main>
</template>

<style>
@import "../assets/styles.css";
</style>

<script>
import ProductCard from "./ProductCard.vue";
export default {
  // props: ['query'],
  data() {
    return {
      products: [],
    };
  },
  components: {
    ProductCard,
  },
  mounted() {
    fetch("http://localhost:8081/search")
      .then((res) => res.json())
      .then((data) => (this.products = data))
      .catch((err) => console.log(err.message));
  },
};
</script>