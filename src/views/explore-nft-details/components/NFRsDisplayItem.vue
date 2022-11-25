<template>
  <div class="nfrs-display-item">
    <div class="image">
      <BaseNFRImage
        :src="props.data.avatar!"
        alt=""
        @click="skipTo"
      />
    </div>

    <div class="main-area">
      <div class="title">
        {{ props.data.name }}
      </div>

      <div class="expire">
        <img
          :src="IconCalender"
          alt=""
        />
        {{ dayjs(props.data.expire).format('MM/DD/YYYY') + ' ' + t('expires') }}
      </div>

      <div class="info">
        <div class="item">
          <img
            :src="IconBookmark"
            alt=""
          />
          {{ props.data.total + ' ' + t('total') }}
        </div>
        <div class="item">
          <img
            :src="IconCompass"
            alt=""
          />
          {{ props.data.price }}
        </div>
      </div>
    </div>

    <div
      v-if="props.btn && Object.keys(props.btn).length !== 0"
      class="btn"
      @click="props.btn?.event?.(props.data)"
    >
      {{ props.btn.title }}
      <img
        :src="props.btn.icon"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import { INFRsType } from '@/types/nft';
import IconCalender from '@/assets/icons/calender.png';
import IconBookmark from '@/assets/icons/bookmark.png';
import IconCompass from '@/assets/icons/compass.png';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

interface IBtn {
  title?: string;
  icon?: string;
  event?: (e: INFRsType) => void;
}

const { t } = useI18n();
const router = useRouter();
const props = defineProps<{ data: INFRsType; btn?: IBtn; isRequest?: boolean }>();
const skipTo = () => {
  if (props.isRequest) {
    router.push(`/explore/nfr-details/${props.data.id}/request`);
    return;
  }
  router.push(`/explore/nfr-details/${props.data.id}`);
};
</script>

<style scoped lang="scss">
.nfrs-display-item {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 363px;
  height: 130px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 12px rgb(163 32 21 / 12%);

  & > .image {
    max-width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px 0 0 8px;
  }

  & > .btn {
    position: absolute;
    right: 15px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 32px;
    padding: 0 21px;
    font-size: 16px;
    font-weight: 700;
    color: $vice-color;
    cursor: pointer;
    background-color: $main-color;
    border-radius: 32px;
    transform: translateY(50%);

    & > img {
      width: 24px;
      height: auto;
      margin-left: 8px;
    }
  }

  & > .main-area {
    width: 185px;
    margin-left: 16px;

    .title {
      margin-top: 11px;
      overflow: hidden;
      font-size: 16px;
      font-weight: 800;
      font-feature-settings: 'pnum' on, 'lnum' on;
      line-height: 32px;
      color: #1f263b;
      text-overflow: ellipsis;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    .expire {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;

      & > img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 23px;
      overflow: hidden;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;

      .item {
        display: flex;
        align-items: center;

        // max-width: 50%;

        img {
          width: auto;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
