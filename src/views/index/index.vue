<template>
  <div class="main">
    <div class="banner">
      <div class="question">
        {{ t('question') }}
      </div>
      <div class="image">
        <img
          :src="ImageBanner"
          alt=""
        />
      </div>
      <div class="description">
        {{ t('description') }}
      </div>
      <div
        class="btn"
        @click="router.push('/create-nfr')"
      >
        {{ t('quick-start') }}
        <img
          :src="IconDone"
          alt=""
        />
      </div>
    </div>
    <div class="card-section">
      <collections-list-card></collections-list-card>
    </div>
    <div class="sell-section">
      <img
        class="image"
        :src="ImageSellTitle"
        alt=""
      />
      <sell-card></sell-card>
    </div>
    <div class="sponsor-section">
      <sponsor-show
        :title="t('sponsor-titles[0]')"
        :image-lists="[ImageGoogle, ImageGoogle, ImageGoogle]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[1]')"
        :image-lists="[ImageGoogle, ImageGoogle, ImageGoogle, ImageGoogle, ImageGoogle]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[2]')"
        :image-lists="[
          ImageGoogle,
          ImageGoogle,
          ImageGoogle,
          ImageGoogle,
          ImageGoogle,
          ImageGoogle,
        ]"
      ></sponsor-show>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageBanner from '@/assets/images/banner.png';
import IconDone from '@/assets/icons/done.png';
import ImageSellTitle from '@/assets/images/sell-title.png';
import ImageGoogle from '@/assets/images/google.png';
import CollectionsListCard from './components/CollectionsListCard/index.vue';
import SellCard from './components/SellCard/index.vue';
import SponsorShow from './components/SponsorShow/index.vue';
import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter();
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
