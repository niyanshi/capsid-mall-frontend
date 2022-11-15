<template>
  <div class="select-box">
    <div class="img-box" :style="{ width: `${prop.width || 400}px`, height: `${prop.height || 400}px` }">
      <img v-show="src" :src='`${basePath}${src}`' alt="" @click="handleImageSelect">
      <div v-show="!src" @click="handleImageSelect">
        <input ref="imageInput" type="file" style="display:none;" @change="handleImageChange">
        <img
          class="icon-add" src="@/assets/icons/icon-add.png"
          :style="{ width: `${prop.iconSize}px`, height: `${prop.iconSize}px` }" />
        <span>{{ prop.iconText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { httpUploadload } from '@/api/campaign';

const prop = defineProps<{
  width?: string | number,
  height?: string | number,
  iconSize?: string | number,
  iconText?: string,
  modelValue: string,
  url?: string
}>();
const emit = defineEmits(['update:modelValue']);
const src = ref('');
const basePath = import.meta.env.VITE_IMAGE_BASE_URL;
const imageInput = ref<HTMLInputElement>();
// 图片选择
const handleImageSelect = () => {
  imageInput.value?.click();
};
watch(()=> prop.modelValue, (val) => {
  src.value = val || '';
},{immediate: true});
const handleImageChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    const url = prop.url || '/campaigns/upload';
    const res = await httpUploadload(url, formData);
    if (res.code === 0) {
      src.value = res.data;
      emit('update:modelValue', res.data);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
