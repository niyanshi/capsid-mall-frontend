<template>
  <div class="main">
    <div class="banner-frame">
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
      <div class="ip-image">
        <img
          src="@/assets/images/ip.jpg"
          alt=""
          style="width: 100%; height: 100%; border-radius: 10px"
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
        :image-lists="[
          { url: ImageGoogle, h: '40.16px' },
          { url: ImageYoutube, h: '40.16px' },
          { url: ImageChigago, h: '40.16px' },
          { url: ImageNorth, h: '40.16px' },
        ]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[1]')"
        :image-lists="[
          { url: ImageBit, h: '40.16px' },
          { url: ImageWeb3, h: '31.01px' },
          { url: ImageGlobal, h: '64.25px' },
          { url: ImageXoogler, h: '64.25px' },
          { url: ImageMask, h: '64.25px' },
        ]"
      ></sponsor-show>
      <sponsor-show
        :title="t('sponsor-titles[2]')"
        :image-lists="[
          { url: Image1, h: '64px' },
          { url: Image2, h: '73px' },
          { url: Image3, h: '74px' },
          { url: Image4, h: '68px' },
          { url: Image5, h: '68.44px' },
          { url: Image6, h: '43px' },
          { url: Image7, h: '62px' },
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
import ImageNorth from '@/assets/investors/north.svg';

import ImageBit from '@/assets/investors/bit.png';
import ImageWeb3 from '@/assets/investors/web3.svg';
import ImageGlobal from '@/assets/investors/global.png';
import ImageXoogler from '@/assets/investors/xoogler.png';
import ImageMask from '@/assets/investors/mask.png';

import Image1 from '@/assets/investors/31.svg';
import Image2 from '@/assets/investors/32.svg';
import Image3 from '@/assets/investors/33.svg';
import Image4 from '@/assets/investors/34.svg';
import Image5 from '@/assets/investors/35.svg';
import Image6 from '@/assets/investors/36.svg';
import Image7 from '@/assets/investors/37.svg';

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
