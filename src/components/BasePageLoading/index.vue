<!-- eslint-disable max-len -->
<template>
  <template v-if="props.loading">
    <img
      src="./loading.svg"
      alt=""
      class="base-page-loading-image"
      :style="{ marginTop: props.top + 'px' }"
    />
  </template>
  <template v-else>
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{ loading: boolean; top?: number | string }>();
</script>

<style scoped>
.base-page-loading-image {
  display: block;
  width: 40px;
  height: 40px;
  margin: auto;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
