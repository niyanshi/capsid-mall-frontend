<template>
  <div class="base-textarea">
    <div
      ref="target"
      class="textarea"
      :style="{ maxHeight: props.max ? `${props.max}px` : '' }"
      contenteditable="true"
      maxlength="5"
      :placeholder="props.placeholder"
      @input="handleChange"
    ></div>

    <template v-if="props.errorTip">
      <div class="error-tip">
        <InfoCircleFilled :style="{ fontSize: '14px' }" />
        {{ props.errorTip }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { InfoCircleFilled } from '@ant-design/icons-vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  max?: number;
  errorTip?: string;
}>();
const emit = defineEmits(['update:modelValue']);
const target = ref<HTMLElement | null>(null);

const maxLen = 512;

const handleChange = (e: Event) => {
  const text = (e.target as HTMLTextAreaElement).innerText;
  if (text.length > maxLen) {
    (target.value as HTMLTextAreaElement).innerText = text.substring(0, maxLen);
    const curSelection = window.getSelection();
    curSelection?.selectAllChildren(target.value as HTMLTextAreaElement);
    curSelection?.collapseToEnd();
  }
  emit('update:modelValue', text.substring(0, maxLen));
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
