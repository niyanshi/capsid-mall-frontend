<template>
  <div
    class="base-nfr-image"
    :class="{ 'base-nfr-image-scale': props.isScale }"
  >
    <img
      ref="imageRef"
      class="main-image"
      :src="props.src"
      alt=""
      @error="onError"
      @load="onLoad"
    />
    <template v-if="!nft">
      <img
        class="frame"
        :style="{
          width: tagInfoObj.width + 'px',
          top: tagInfoObj?.top + 'px',
          left: tagInfoObj.left + 'px',
        }"
        :src="ImageFrame"
        alt=""
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import ImageAlt from '@/assets/images/image-alt.png';
import ImageFrame from '@/assets/images/frame.png';

const props = defineProps<{ src: string; isScale?: boolean; nft?: boolean }>();

const imageRef = ref();
const tagInfoObj = reactive<{
  width?: number;
  top?: number;

  left?: number;
}>({});

const onError = () => {
  imageRef.value.src = ImageAlt;
};
const onLoad = (e: Event) => {
  const cof = 0;
  tagInfoObj.width = (e.target as HTMLImageElement).width - cof;
  tagInfoObj.top = (e.target as HTMLImageElement).offsetTop - 1;
  tagInfoObj.left = (e.target as HTMLImageElement).offsetLeft - cof;
};
</script>

<style scoped lang="scss">
.base-nfr-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 0;
  border: none;

  & > .main-image {
    max-width: 100%;
    max-height: 100%;
  }

  & > .frame {
    position: absolute;

    // top: 0;
    width: 100%;
    height: auto;
  }

  &-scale {
    img {
      transition: all 0.3s ease;
    }

    &:hover {
      img {
        transform: scale(1.07, 1.07);
      }
    }
  }
}
</style>
