<template>
  <teleport to="body">
    <template v-if="props.visible">
      <div
        class="base-overlay"
        :style="{ zIndex: props.zIndex }"
        @click="handleClose"
      >
        <div
          class="base-overlay-content"
          :style="{ marginTop: `${props.top ?? 301}px` }"
          @click.stop=""
        >
          <slot></slot>
        </div>
      </div>
    </template>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{ visible: boolean; top?: number; zIndex?: number }>();
const emit = defineEmits<{ (event: 'close'): void }>();

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

watch(props, (newVal) => {
  if (newVal?.visible) document.documentElement.style.overflow = 'hidden';
  else document.documentElement.style.overflow = '';
});

onMounted(() => {
  document.documentElement.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.documentElement.style.overflow = '';
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
