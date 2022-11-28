<template>
  <div
    class="form-item-price"
    :style="{ width: `${props.width}px` }"
  >
    <div class="title">
      {{ props.title }}
    </div>
    <div class="value">
      <div class="prefix">
        {{ props.currency || currencyRef }}
        <img
          :src="IconCompass"
          alt=""
        />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCompass from '@/assets/icons/compass.png';
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  modelValue?: string;
  width?: number;
  currency?: string;
}>();

const currencyRef = ref('ETH');
</script>

<style scoped lang="scss">
.form-item-price {
  width: 160px;

  & > .title {
    font-size: 16px;
    font-weight: 500;
  }

  & > .value {
    display: grid;
    grid-template-columns: 48px 136px;
    column-gap: 16px;
    margin-top: 14px;

    & > .prefix {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 48px;
      padding-bottom: 6px;
      border-bottom: 2px solid $main-color;

      img {
        width: auto;
        height: 16px;
        margin-left: 4px;
      }
    }
  }
}
</style>
