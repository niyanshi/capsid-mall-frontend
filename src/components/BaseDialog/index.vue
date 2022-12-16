<template>
  <BaseOverlay
    v-if="dialogVisible"
    :visible="dialogVisible"
    @close="handleMaskClose"
  >
    <div
      class="dialog-content"
      :style="{ width: prop.width + 'px', height: prop.height + 'px' }"
    >
      <div
        class="icon-close"
        @click="handleClose"
      ></div>
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
  visible: boolean;
  width?: number | string;
  height?: number | string;
  // 禁止通过点击mask关闭弹窗
  maskDisable?: boolean;
}
const prop = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 500,
});
const emit = defineEmits(['close']);
const dialogVisible = ref(false);
watch(
  () => prop.visible,
  (value) => {
    dialogVisible.value = value;
  },
  {
    immediate: true,
  },
);
const handleClose = () => {
  emit('close');
};
const handleMaskClose = () => {
  if (prop.maskDisable) return;
  emit('close');
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
