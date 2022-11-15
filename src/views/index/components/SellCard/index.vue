<template>
  <div class="sell-card">
    <div class="block">
      <img
        class="icon"
        :src="IconVerify"
        alt=""
      />
      <div class="desc">{{ t('sell-slogan[0]') }}</div>
    </div>

    <img
      class="click"
      :src="IconClick"
      alt=""
    />

    <div class="block">
      <img
        class="icon"
        :src="IconMoney"
        alt=""
      />
      <div class="desc">{{ t('sell-slogan[1]') }}</div>
    </div>

    <div class="btn" @click="router.push('/create-nfr')">
      {{ t('go') }}
      <img
        :src="IconArrow"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconVerify from '@/assets/icons/verify.png';
import IconClick from '@/assets/icons/click.png';
import IconMoney from '@/assets/icons/money.png';
import IconArrow from '@/assets/icons/arrow.png';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
