<template>
  <div class="footer-area">
    <div class="left">
      <div class="item">{{ t('footer-options[0]') }}</div>
      <div class="item">{{ t('footer-options[1]') }}</div>
      <div class="item">{{ t('footer-options[2]') }}</div>
      <div class="item">{{ t('footer-options[3]') }}</div>
    </div>
    <div class="right">
      <div class="item">
        {{ `@ ${yearRef} Capsid, Inc` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const yearRef = ref(new Date().getFullYear());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
