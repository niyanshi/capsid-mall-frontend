<template>
  <div class="side-bar">
    <img
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
    />
  </div>
</template>

<script setup lang="ts">
import ImageDiscord from '@/assets/svg/discord.svg';
import ImageMirror from '@/assets/svg/mirror.svg';
import ImageTwitter from '@/assets/svg/twitter.svg';
import { URL_LIST } from '@/utils/constant';
const { open } = window;

const handleOpen = (target: string) => {
  open(target);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
