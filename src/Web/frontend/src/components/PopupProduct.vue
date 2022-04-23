<template>
  <div class="col-md d-block mb-4">
    <div class="card pb-3">
      <div class="popup-store-img">
        <img :src=prod.shop_icon_url alt="">
      </div>
      <div class="popup-prod-name">
        <span>Lavaza 500g</span>
      </div>
      <div class="popup-prod-price"><span>5.59€</span></div>
      <div class="popup-store-btn">
        <button href="#">GO TO STORE</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prod', 'other']
};
</script>