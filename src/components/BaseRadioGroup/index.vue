<template>
  <div class="base-radio-group">
    <div
      v-for="item in props.data"
      :key="item.id"
      class="radio"
      :class="{ active: activeRef === item.id }"
      @click="handleClick(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface IDataType {
  id: number | string;
  title: string;
  [key: string]: unknown;
}

const props = defineProps<{ data: IDataType[]; activeKey?: string | number }>();
const emit = defineEmits<{ (event: 'select', data: number | string): void }>();

const activeRef = ref<number | string>();

const handleClick = (e: IDataType) => {
  activeRef.value = e.id;
  emit('select', e.id);
};

watch(props, (newVal) => {
  if (newVal.activeKey) activeRef.value = newVal.activeKey;
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
