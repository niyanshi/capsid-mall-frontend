<template>
  <base-overlay
    :visible="props.visible"
    :z-index="999"
  >
    <div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div>

    <div class="tip">{{ controllerStore.globalTip || t('wait-msg.loading') }}</div>
  </base-overlay>
</template>

<script setup lang="ts">
import BaseOverlay from '../BaseOverlay/index.vue';
import { useControllerStore } from '@/stores/controller';
import { useI18n } from 'vue-i18n';

const controllerStore = useControllerStore();
const { t } = useI18n();

const props = defineProps<{ visible: boolean }>();
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
