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
        :src="item.url"
        alt=""
        :class="{ filter: props.filter }"
        :style="{ width: item.w, height: item.h }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconDiamond from '@/assets/icons/diamond.png';

const props = defineProps<{
  title: string;
  imageLists?: { url: string; w?: string; h?: string }[];
  filter?: boolean;
}>();
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
