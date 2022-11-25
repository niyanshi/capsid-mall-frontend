<template>
  <div class="base-nfr-image">
    <img
      ref="imageRef"
      class="main-image"
      :src="props.src"
      alt=""
      @error="onError"
    />
    <img
      class="frame"
      :src="ImageFrame"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageAlt from '@/assets/images/image-alt.png';
import ImageFrame from '@/assets/images/frame.png';

const props = defineProps<{ src: string }>();

const imageRef = ref();

const onError = () => {
  imageRef.value.src = ImageAlt;
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

  & > .main-image {
    max-width: 100%;
    max-height: 100%;
  }

  & > .frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
}
</style>
