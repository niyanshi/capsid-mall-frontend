<template>
  <div
    class="nft-avatar"
    :class="{ active: props.active }"
  >
    <img
      ref="imgRef"
      :src="props.avatar"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import ImageAlt from '@/assets/images/image-alt.png';
import { ref } from 'vue';
const props = defineProps<{ avatar: string; active: boolean }>();
const imgRef = ref();
const onError = function () {
  if (!imgRef.value) return;
  imgRef.value.src = ImageAlt;
};
</script>

<style scoped lang="scss">
.nft-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  cursor: pointer;
  border-radius: 10px;

  &.active {
    border: 2px dashed $main-color;
  }

  & > img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
