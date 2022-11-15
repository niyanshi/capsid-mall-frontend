<template>
  <div class="base-textarea">
    <div
      class="textarea"
      :style="{ maxHeight: props.max ? `${props.max}px` : '' }"
      contenteditable="true"
      :placeholder="props.placeholder"
      @input="handleChange"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: string; placeholder?: string; max?: number }>();
const emit = defineEmits(['update:modelValue']);

const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).innerText);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
