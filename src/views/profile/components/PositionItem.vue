<template>
  <div class="item-wrap">
    <template v-if="isNFR">
      <div class="image">
        <BaseNFRImage :src="prop.pic" />
      </div>
    </template>
    <template v-else>
      <img
        ref="imgRef"
        class="image"
        :src="prop.pic"
        @error="onError"
      />
    </template>

    <!--
     -->

    <div class="info" :title="prop.name">
      <p>{{ prop.name?.split('#')[0] }}</p>
      <p>{{ prop.name?.split('#')[1] ? `#${prop.name?.split('#')[1]}` : '' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageAlt from '@/assets/images/image-alt.png';

import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import { computed, ref } from 'vue';

const prop = defineProps<{
  pic: string;
  name: string;
}>();

const isNFR = computed(() => sessionStorage.getItem('profile-tab') === '1');

const imgRef = ref();
const onError = function () {
  if (!imgRef.value) return;
  imgRef.value.src = ImageAlt;
};
</script>

<style lang="scss" scoped>
.item-wrap {
  width: 176px;
  margin: 30px 21px 0 11px;
  cursor: pointer;

  .image {
    width: 176px;
    height: 176px;
    border-radius: 10px;
  }

  .info {
    width: 100%;
    margin-top: 16px;
    overflow: hidden;
    font-family: 'Quiet Sans', sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    font-feature-settings: 'pnum' on, 'lnum' on;
    line-height: 24px;
    color: #000;
    text-overflow: ellipsis;
    letter-spacing: 0.02em;

    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
  }
}
</style>
