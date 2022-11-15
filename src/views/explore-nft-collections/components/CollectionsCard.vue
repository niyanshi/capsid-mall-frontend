<template>
  <div
    class="collections-card"
    @click="skipTo(`/explore/nft-collections-display/${props.data.id}`)"
  >
    <div class="avatar">
      <img
        :src="props.data.avatar"
        alt=""
      />
    </div>
    <div class="info">
      <div class="title">{{ props.data.title }}</div>
      <div class="option">
        <div class="key">{{ t('explore-page.options[0]') }}</div>
        <div class="val">{{ props.data.nfrs }}</div>
      </div>
      <div class="option">
        <div class="key">{{ t('explore-page.options[1]') }}</div>
        <div class="val">{{ props.data.floorPrice }}</div>
        <img
          :src="IconCompass"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCompass from '@/assets/icons/compass.png';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ICollectionsItemType } from '@/types/collection';

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{ data: ICollectionsItemType }>();

/**
 * 跳转路由
 * @param to 目标路由
 */
const skipTo = (to: string) => {
  router.push(to);
};
</script>

<style lang="scss" scoped>
.collections-card {
  display: flex;
  aspect-ratio: 624/292;
  overflow: hidden;

  .avatar {
    height: 100%;

    img {
      height: 100%;
      aspect-ratio: 1/1;
      border-radius: 8px;
    }

    cursor: pointer;
  }

  .info {
    margin-left: 32px;

    .title {
      font-family: 'Quiet Sans', sans-serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .option {
      display: flex;
      align-items: center;
      margin-top: 16px;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0.02em;

      &:first-child {
        margin-top: 0;
      }

      .key {
        font-weight: 400;
        color: $main-font-color;
      }

      .val {
        margin-left: 9px;
        font-weight: 700;
        color: #ea423c;
      }

      img {
        width: 10px;
        height: auto;
        margin-left: 8px;
      }
    }
  }
}
</style>
