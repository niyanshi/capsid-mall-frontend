<template>
  <div ref="scrollListRef" class="scrollList" :style="{ height: `${height || 700}px` }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface PropType {
  height: number | string,
  disabled: boolean
}
const prop = defineProps<PropType>();
const emit = defineEmits(['scroll']);
const scrollListRef = ref();
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.scrollTop + target.clientHeight === target.scrollHeight) {
    emit('scroll');
  }
};
// 监听滚动区域，加载出来后挂载滚动方法
watch(scrollListRef, (val) => {
  if(val) {
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  }
});
watch(() => prop.disabled, () => {
  // 根据条件添加删除滚动函数
  if (!prop.disabled) {
    window.console.log('add listen');
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  } else {
    window.console.log('remove listen');
    scrollListRef.value?.removeEventListener('scroll', handleScroll);
  }
},{immediate: true});
</script>

<style lang="scss" scoped>
.scrollList {
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { width: 0 !important }
}
</style>
