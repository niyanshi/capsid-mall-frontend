<template>
  <div class="select-box" @click="handleImageSelect">
    <div class="img-box" :style="{ width: `${prop.width || 400}px`, height: `${prop.height || 400}px` }">
      <img v-show="src" :src='src' alt="">
      <div v-show="!src">
        <input ref="imageInput" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" style="display:none;" @change="handleImageChange">
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
import { message } from 'ant-design-vue';

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
const imageInput = ref<HTMLInputElement>();
// 图片选择
const handleImageSelect = () => {
  imageInput.value?.click();
};
watch(() => prop.modelValue, (val) => {
  if(src.value === '') src.value = val;
}, { immediate: true });
const handleImageChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    const url = prop.url || '/campaigns/upload';
    const res = await httpUploadload(url, formData);
    if (res.code === 0) {
      src.value = res.data.fullPath;
      emit('update:modelValue', res.data.path);
    } else {
      message.error(res.msg);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
