<template>
  <base-overlay
    :visible="props.visible"
    :z-index="2999"
  >
    <div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';

// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();

const props = defineProps<{ visible: boolean }>();
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
