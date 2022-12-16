<template>
  <div class="side-bar">
    <div
      class="item"
      @click="handleOpen(URL_LIST.Discord)"
    >
      <i class="side-bar-icon discord"></i>
    </div>
    <div
      class="item"
      @click="handleOpen(URL_LIST.Twitter)"
    >
      <i class="side-bar-icon twitter"></i>
    </div>
    <div
      class="item"
      @click="handleOpen(URL_LIST.Mirror)"
    >
      <i class="side-bar-icon mirror"></i>
    </div>

    <!-- <img
      :src="ImageDiscord"
      alt=""
      @click="handleOpen(URL_LIST.Discord)"
    />
    <img
      :src="ImageTwitter"
      alt=""
      @click="handleOpen(URL_LIST.Twitter)"
    />
    <img
      :src="ImageMirror"
      alt=""
      @click="handleOpen(URL_LIST.Mirror)"
    /> -->
  </div>
</template>

<script setup lang="ts">
// import ImageDiscord from '@/assets/svg/discord.svg';
// import ImageMirror from '@/assets/svg/mirror.svg';
// import ImageTwitter from '@/assets/svg/twitter.svg';
import { URL_LIST } from '@/utils/constant';
const { open } = window;

const handleOpen = (target: string) => {
  open(target);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
