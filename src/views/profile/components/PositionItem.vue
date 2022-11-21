<template>
  <div class="item-wrap">
    <img :src="prop.pic">
    <div class="info">
      <p>{{ prop.name?.split('#')[0] }}</p>
      <p>#{{ prop.name?.split('#')[1] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const prop = defineProps<{
  pic: string,
  name: string
}>();
</script>

<style lang="scss" scoped>
.item-wrap {
  margin: 30px 21px 0 11px;
  width: 176px;
  cursor: pointer;

  img {
    width: 176px;
    height: 176px;
    border-radius: 10px;
  }

  .info {
    width: 100%;
    margin-top: 16px;
    font-family: 'Quiet Sans';
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.02em;
    font-feature-settings: 'pnum' on, 'lnum' on;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;

    p {
      margin: 0;
    }
  }
}
</style>
