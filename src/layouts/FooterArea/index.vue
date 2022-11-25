<template>
  <div class="footer-area">
    <div class="left">
      <div
        class="item"
        @click="handleOpen(URL_LIST.Terms)"
      >
        {{ t('footer-options[0]') }}
      </div>
      <div
        class="item"
        @click="handleOpen(URL_LIST.Privacy)"
      >
        {{ t('footer-options[1]') }}
      </div>
      <div
        class="item"
        @click="handleOpen(URL_LIST.FAQ)"
      >
        {{ t('footer-options[2]') }}
      </div>
      <div
        class="item"
        @click="handleOpen(URL_LIST.Careers)"
      >
        {{ t('footer-options[3]') }}
      </div>
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
import { URL_LIST } from '@/utils/constant';

const { t } = useI18n();
const { open } = window;
const yearRef = ref(new Date().getFullYear());

const handleOpen = (target: string) => {
  open(target);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
