<template>
  <div
    ref="selectElemRef"
    class="base-select"
  >
    <div
      class="select"
      @click="optionsShowRef = !optionsShowRef"
    >
      <div
        class="value"
        :class="{ placeholder: !props.modelValue }"
      >
        {{ props.modelValue || props.placeholder }}
      </div>
      <img
        class="icon"
        :src="IconArrowDown"
        alt=""
      />
    </div>
    <div
      v-if="optionsShowRef"
      class="options"
    >
      <div
        v-for="item in props.options"
        :key="item.key"
        class="item"
        @click="handleSelect(item.value)"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconArrowDown from '@/assets/icons/arrow-down.svg';
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';

interface IOptions {
  key: string | number;
  value: string;
}

const props = defineProps<{ modelValue?: string; options?: IOptions[]; placeholder?: string }>();
const emit = defineEmits(['update:modelValue']);
const optionsShowRef = ref(false);
const selectElemRef = ref<HTMLElement | null>(null);

useEventListener(document, 'click', (e) => {
  if (selectElemRef.value?.contains(e.target as HTMLElement)) {
    return;
  }
  optionsShowRef.value = false;
});

const handleSelect = (e: unknown) => {
  emit('update:modelValue', e);
  optionsShowRef.value = false;
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
