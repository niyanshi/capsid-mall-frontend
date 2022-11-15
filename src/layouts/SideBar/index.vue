<template>
  <div class="side-bar">
    <img
      :src="ImageDiscord"
      alt=""
    />
    <img
      :src="ImageTwitter"
      alt=""
    />
    <img
      :src="ImageMirror"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import ImageDiscord from '@/assets/icons/discord.png';
import ImageMirror from '@/assets/icons/mirror.png';
import ImageTwitter from '@/assets/icons/twitter.png';
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
