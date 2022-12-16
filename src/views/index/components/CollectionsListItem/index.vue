<template>
  <div
    class="collections-list-item"
    @click="router.push(`/explore/nft-collections-display/${props.data.id}`)"
  >
    <div class="image">
      <img
        :src="props.data.avatar"
        alt=""
      />
    </div>
    <div class="info">
      <div
        class="title"
        :title="props.data.title"
      >
        {{ props.data.title }}
      </div>

      <div class="option-group">
        <div class="option">
          <div class="key">{{ t('info-options[0]') }}</div>
          <div class="val">{{ props.data.listings || 0 }}</div>
        </div>
        <div class="option">
          <div class="key">{{ t('info-options[1]') }}</div>
          <div class="val">{{ props.data.floorPrice }}</div>
          <div class="icon">
            <img
              :src="IconCompass"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCompass from '@/assets/icons/compass.png';
import { ICollectionsItemType } from '@/types/collection';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{ data: ICollectionsItemType }>();
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
