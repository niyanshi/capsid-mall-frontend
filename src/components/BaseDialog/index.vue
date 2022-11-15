<template>
  <BaseOverlay v-if="dialogVisible" :visible="dialogVisible" @close="handleClose">
    <div class="dialog-content" :style="{ width: prop.width + 'px', height: prop.height + 'px' }">
      <div class="icon-close" @click="handleClose"></div>
      <slot></slot>
      <div class="bottom">
        <slot name="button"></slot>
      </div>
    </div>
  </BaseOverlay>
</template>

<script setup lang="ts">
import BaseOverlay from '@/components/BaseOverlay/index.vue';
import { ref, watch } from 'vue';

interface Props {
  visible: boolean
  width?: number | string
  height?: number | string
}
const prop = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 500
});
const emit = defineEmits(['close']);
const dialogVisible = ref(false);
watch(() => prop.visible, (value) => {
  dialogVisible.value = value;
});
const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
