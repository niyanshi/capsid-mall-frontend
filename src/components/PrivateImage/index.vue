<template>
  <img
    ref="imgRef"
    :src="prop.src"
    alt=""
    @error="onError"
  />
</template>

<script setup lang="ts">
import ImageAlt from '@/assets/images/image-alt.png';
import { ref } from 'vue';

const prop = defineProps<{
  src: string;
}>();

const imgRef = ref();
const onError = function () {
  if (!imgRef.value || imgRef.value === 'null') return;
  imgRef.value.src = ImageAlt;
};
</script>
