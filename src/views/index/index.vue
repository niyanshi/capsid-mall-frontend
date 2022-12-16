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
        <i class="icon-done"></i>
        <!-- <img
          :src="IconDone"
          alt=""
        /> -->
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
        :image-lists="[
          { url: ImageGoogle },
          { url: ImageYoutube },
          { url: ImageChigago },
          { url: ImageNorth },
        ]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[1]')"
        :image-lists="[
          { url: ImageBit },
          { url: ImagSpring, h: '50px' },
          { url: ImageGlobal, h: '68px' },
          { url: ImageXoogler, h: '68px' },
          { url: ImageMask, h: '68px' },
        ]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[2]')"
        :filter="true"
        :image-lists="[
          { url: Image1 },
          { url: Image2 },
          { url: Image3 },
          { url: Image4 },
          { url: ImageGoogle },
          { url: Image5 },
          { url: Image6 },
        ]"
      ></sponsor-show>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageBanner from '@/assets/images/banner.png';
import ImageSellTitle from '@/assets/images/sell-title.png';
import ImageGoogle from '@/assets/investors/google.png';
import ImageYoutube from '@/assets/investors/youtube.png';
import ImageChigago from '@/assets/investors/chigago.png';
import ImageNorth from '@/assets/investors/north.png';

import ImageBit from '@/assets/investors/bit.png';
import ImagSpring from '@/assets/investors/spring-wind.png';
import ImageGlobal from '@/assets/investors/global.png';
import ImageXoogler from '@/assets/investors/xoogler.png';
import ImageMask from '@/assets/investors/mask.png';

import Image1 from '@/assets/investors/1.jpg';
import Image2 from '@/assets/investors/2.jpg';
import Image3 from '@/assets/investors/3.jpg';
import Image4 from '@/assets/investors/4.jpg';
import Image5 from '@/assets/investors/5.jpg';
import Image6 from '@/assets/investors/6.jpg';

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
