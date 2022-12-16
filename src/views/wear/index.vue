<template>
  <div class="wear-wrap">
    <div class="tab">
      <span
        :class="[tabIndex === 0 ? 'active' : '']"
        @click="handleTabChange(0)"
        >{{ t('wear-page.tab[0]') }}</span
      >
      <span
        :class="[tabIndex === 1 ? 'active' : '']"
        @click="handleTabChange(1)"
        >{{ t('wear-page.tab[1]') }}</span
      >
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const tabIndex = ref(0);
const handleTabChange = (index: number) => {
  tabIndex.value = index;
  if(index) {
    router.push('/wear/list');
  } else {
    router.push('/wear');
  }
};
watch(()=>route.path,(path:string) => {
  if(path.indexOf('list') !== -1) {
    tabIndex.value = 1;
  }
});
onMounted(() => {
  if(route.path.indexOf('list') !== -1) {
    tabIndex.value = 1;
  }
});
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
