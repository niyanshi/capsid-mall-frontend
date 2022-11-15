<template>
  <div
    class="nft-avatar"
    :class="{ active: props.active }"
  >
    <img
      :src="props.avatar"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ avatar: string; active: boolean }>();
</script>

<style scoped lang="scss">
.nft-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  cursor: pointer;
  border-radius: 10px;

  &.active {
    border: 2px dashed $main-color;
  }

  & > img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
