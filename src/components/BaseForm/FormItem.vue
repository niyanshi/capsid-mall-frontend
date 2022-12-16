<template>
  <div
    class="form-item"
    :style="{ width: `${props.width}px` }"
  >
    <div class="title">
      {{ props.title }}
    </div>
    <div class="value">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; modelValue?: string; width?: number }>();
</script>

<style scoped lang="scss">
.form-item {
  width: 160px;

  & > .title {
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }

  & > .value {
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-top: 14px;
  }
}
</style>
