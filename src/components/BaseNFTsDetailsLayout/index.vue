<template>
  <div class="base-nfts-details-layout">
    <div class="title">
      <img
        :src="IconMedal"
        alt=""
      />
      {{ props.data.name }}
    </div>
    <div class="mian-area">
      <div class="left">
        <div class="image">
          <template v-if="isAtNFR">
            <BaseNFRImage
              :src="props.data.avatar"
              alt=""
            />
          </template>
          <template v-else>
            <img
              :src="props.data.avatar"
              alt=""
            />
          </template>
        </div>
        <div class="props-name">{{ t('properties') }}</div>

        <div class="props">
          <div
            v-for="(item, index) in props.data.props"
            :key="index"
            class="props-item"
          >
            <span>
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <div class="right">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import { INFTsType } from '@/types/nft';
import IconMedal from '@/assets/icons/medal.png';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const { t } = useI18n();
const isAtNFR = computed(() => router.currentRoute.value.path.indexOf('nfr-details') !== -1);

const props = defineProps<{ data: INFTsType }>();
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
