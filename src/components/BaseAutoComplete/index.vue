<template>
  <div class="base-auto-complete-frame">
    <auto-complete
      v-model:value="value"
      :options="options"
      :style="`width: ${width}px`"
      class="base-auto-complete"
      dropdown-class-name="base-auto-complete-dropdown"
      :dropdown-match-select-width="width"
      @change="handleInputChange"
      @select="onSelect"
    >
      <Input>
        <template #suffix><search-outlined /></template>
      </Input>
    </auto-complete>
    <template v-if="props.errorTip">
      <div class="base-auto-complete-error-tip">
        <InfoCircleFilled :style="{ fontSize: '14px' }" />
        {{ props.errorTip }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { AutoComplete, Input } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';

type IProps = {
  width?: number;
  modelValue: string;
  options: Array<{ value: string }>;
  errorTip?: string;
};
const props = defineProps<IProps>();

// eslint-disable-next-line sonarjs/no-duplicate-string
const emit = defineEmits(['update:modelValue']);
const value = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v: string) => {
    value.value = v;
  },
);
const onSelect = (selectV: unknown) => {
  emit('update:modelValue', selectV);
};
const handleInputChange = () => {
  console.log(value.value);
  emit('update:modelValue', value.value);
};
</script>

<style lang="scss">
.base-auto-complete .ant-input-affix-wrapper {
  gap: 8px !important;
  padding: 8px !important;
  border: 1px solid #efefef !important;
  border-radius: 4px !important;
}

.base-auto-complete .ant-input-affix-wrapper:focus,
.ant-input-affix-wrapper-focused {
  border: 1px solid #a32015 !important;
  box-shadow: 0 0 0 2px #a32015;
}

.base-auto-complete .ant-input {
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

.base-auto-complete-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
  background-color: #f5f5f5;
}

.base-auto-complete-dropdown {
  background: #fff;
  border: 1px solid #efefef;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(225 225 225 / 10%);
}

.base-auto-complete-dropdown .ant-select-item {
  gap: 10px;
  padding: 12px;
}

.base-auto-complete-error-tip {
  position: absolute;
  bottom: 0;
  font-size: 16px;
  color: $main-color;
  white-space: nowrap;
  transform: translateY(110%);
}

.base-auto-complete-frame {
  position: relative;
}
</style>
