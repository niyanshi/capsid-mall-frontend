<template>
  <div class="sponsor-show">
    <div class="title">
      <img
        :src="IconDiamond"
        alt=""
      />
      {{ props.title }}
    </div>
    <div class="sponsor-list">
      <img
        v-for="(item, index) in props.imageLists"
        :key="index"
        :src="item"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconDiamond from '@/assets/icons/diamond.png';

const props = defineProps<{ title: string; imageLists?: string[] }>();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
