<template>
  <div class="base-tooltip">
    <img
      :src="IconTooltip"
      alt=""
    />

    <span
      class="tooltiptext"
      :style="{ width: props.width + 'px' }"
      >{{ props.tips }}
    </span>
  </div>
</template>

<script setup lang="ts">
import IconTooltip from '@/assets/svg/tooltip.svg';

const props = defineProps<{ tips: string; width?: string | number }>();
</script>

<style scoped lang="scss">
.base-tooltip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;

  .tooltiptext {
    position: absolute;
    bottom: 125%;
    left: 50%;
    z-index: 1;
    min-width: 120px;
    padding: 5px;
    font-size: 12px;
    font-weight: 400;
    color: $vice-color;
    text-align: center;
    visibility: hidden;
    background-color: $main-color;
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.3s;
    transform: translateX(-50%);

    &::after {
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      content: '';
      border-color: $main-color transparent transparent;
      border-style: solid;
      border-width: 5px;
    }
  }

  &:hover {
    .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>
