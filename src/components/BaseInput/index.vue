<template>
  <div class="base-input">
    <input
      :type="props.type"
      :class="props.styleType"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :maxlength="(props.type === 'number' ? '' : props.limit)"
      @input="handleChange"
    />
    <span v-if="props.type !== 'number'" class="limit-text">{{ `${currentLength}/${props.limit}` }}</span>
  </div>
</template>

<script setup lang="ts">import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: string;
    styleType?: 'none' | 'line' | 'border';
    modelValue: unknown;
    placeholder?: string;
    limit?: number
  }>(),
  {
    type: 'text',
    styleType: 'none',
    placeholder: '',
    limit: 128
  },
);

const emit = defineEmits(['update:modelValue']);

const currentLength = ref(0);
const handleChange = (e: Event) => {
  const inputValue = (e.target as HTMLInputElement).value;
  currentLength.value = inputValue.length;
  emit('update:modelValue', inputValue);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
