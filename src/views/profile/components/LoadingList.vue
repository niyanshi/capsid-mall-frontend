<template>
  <LoadingItem
    v-for="(item,index) in loadingList"
    :key="index"
  ></LoadingItem>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LoadingItem from './LoadingItem.vue';

const props = defineProps<{loading: boolean}>();
const loadingList = computed(() => props.loading ? ['','','','','','','',''] : []);
</script>

<style lang="scss" scoped>

</style>
