<script setup lang="ts">
import IconTrophy from '@/assets/icons/trophy.png';
import IconSearch from '@/assets/icons/search.svg';
import { computed, onMounted, ref } from 'vue';
import BaseRadioGroup from '@/components/BaseRadioGroup/index.vue';
import { httpGetNFTCollectionsList } from '@/api/explore';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ICollectionsItemDto, ICollectionsItemType } from '@/types/collection';

const { t } = useI18n();
const router = useRouter();

const collectionsListRef = ref<ICollectionsItemType[]>([]);
const activeKeyRef = computed<string>(() => router.currentRoute.value.params.slug as string);
const activeOnlyRef = ref(false);

/** radio select */
const handleSelect = (e: string | number) => {
  router.push(`/explore/nft-collections-display/${e}`);
};

/** 获取collection类型 */
const fetchCollectionType = async () => {
  const res = await httpGetNFTCollectionsList();
  const list = res.data.map((item: ICollectionsItemDto) => ({
    title: item.name,
    id: item.slug,
  }));
  collectionsListRef.value = list;
};
onMounted(() => {
  fetchCollectionType();
});
</script>

<template>
  <div class="collections-display-view">
    <div class="title">
      <img
        :src="IconTrophy"
        alt=""
      />
      {{ t('explore-page.title') }}
    </div>
    <div class="radio-area">
      <base-radio-group
        :data="collectionsListRef"
        :active-key="activeKeyRef"
        @select="handleSelect"
      ></base-radio-group>
    </div>
    <div class="line"></div>

    <div class="tools-area">
      <div class="search">
        <input type="text" />
        <img
          :src="IconSearch"
          alt=""
        />
      </div>
      <div
        class="btn"
        :class="{ active: activeOnlyRef }"
        @click="activeOnlyRef = !activeOnlyRef"
      >
        {{ t('active-only') }}
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
