<template>
  <div
    class="form-item-details"
    :style="{ width: `${props.width}px` }"
  >
    <div class="title">
      {{ props.title }}
      <img
        :src="SvgLink"
        alt=""
      />
    </div>
    <div class="value">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgLink from '@/assets/svg/link-black.svg';

const props = defineProps<{ title: string; modelValue?: string; width?: number }>();
</script>

<style scoped lang="scss">
.form-item-details {
  display: flex;
  align-items: center;
  width: 260px;
  padding-bottom: 4px;
  border-bottom: 2px solid $main-color;

  & > .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;

    & > img {
      width: 24px;
      height: 24px;
    }
  }

  & > .value {
    display: flex;
    width: 100%;
  }
}
</style>
