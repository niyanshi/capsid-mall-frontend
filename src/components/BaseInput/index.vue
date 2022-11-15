<template>
  <div class="base-input">
    <input
      :type="props.type"
      :class="props.styleType"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: string;
    styleType?: 'none' | 'line' | 'border';
    modelValue: unknown;
    placeholder?: string;
  }>(),
  {
    type: 'text',
    styleType: 'none',
    placeholder: '',
  },
);

const emit = defineEmits(['update:modelValue']);

const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
