<template>
  <div class="info-box">
    <div class="desc">
      {{ props.data?.desc }}
    </div>

    <div class="link">
      <a
        :href="props.data?.detailsUrl"
        target="_blank"
      >
        {{ t('details') }}
      </a>
      <img
        :src="IconLink"
        alt=""
      />
    </div>

    <div class="both">
      <div class="item">
        <div class="key">{{ t('issued-by') }}</div>
        <div
          class="val"
          :title="props.data?.issued"
          @click="router.push(`/profile/${props.data?.issued}`)"
        >
          {{ ' ' }}
          <span>{{ calcIssuedRole }}</span>
        </div>
      </div>

      <div class="item">
        <div class="key">{{ t('received-by') }}</div>
        <div class="val">
          {{ ' ' }}
          <span
            v-for="(item, index) in calcReceiveRole"
            :key="item.key"
            :title="item.key"
            @click="router.push(`/profile/${item.key}`)"
          >
            {{ item.val }}
            <span v-if="index + 1 !== calcReceiveRole?.length">{{ ',' }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="expire">
      <img
        :src="IconCalender"
        alt=""
        class="icon"
      />
      {{ dayjs(props.data?.expire).format('MM/DD/YYYY') + ' ' + t('expires') }}
    </div>

    <div class="info">
      <div class="item">
        <img
          :src="IconBookmark"
          alt=""
          class="icon"
        />
        {{ props.data?.remain + '/' + props.data?.total }}
        <img
          :src="IconInfo"
          alt=""
          class="icon-end"
        />
      </div>
      <div class="item">
        <img
          :src="IconCompass"
          alt=""
          class="icon"
        />
        {{ props.data?.price }}
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="btn-group">
      <div
        v-for="item in props.btns"
        :key="item.type"
        class="btn"
        :class="item.type"
        @click="item.event"
      >
        {{ item.title }}
        <img
          :src="item.icon"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconLink from '@/assets/icons/link.svg';
import IconCompass from '@/assets/icons/compass.png';
import IconCalender from '@/assets/icons/calender.png';
import IconInfo from '@/assets/icons/info.svg';
import IconBookmark from '@/assets/icons/bookmark.png';
import { INFRsType } from '@/types/nft';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { IInfoBtnType } from '@/types/explore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/user-info';

const { t } = useI18n();
const router = useRouter();
const userInfoStore = useUserInfoStore();
const props = defineProps<{
  data?: INFRsType;
  btns?: IInfoBtnType[];
}>();
const sliceStart = 2;
const sliceEnd = 8;

const isYou = (address?: string) =>
  address?.toLowerCase() === userInfoStore.currentUser.publicKey.toLowerCase();

const calcReceiveRole = computed(() =>
  props.data?.receive?.split(',').map((item) => ({
    val: isYou(item) ? 'you' : item.slice(sliceStart, sliceEnd),
    key: item,
  })),
);

const calcIssuedRole = computed(() =>
  isYou(props.data?.issued) ? 'you' : props.data?.issued?.slice(sliceStart, sliceEnd),
);
</script>

<style scoped lang="scss">
.icon {
  width: auto;
  height: 32px;
  margin-right: 10px;
}

.info-box {
  position: relative;
  box-sizing: border-box;
  width: 896px;
  height: 432px;
  padding: 51px 53px 0 72px;
  font-size: 18px;
  letter-spacing: 0.02em;
  background-color: #fff;
  border: 1.6px solid $main-color;
  border-radius: 32px;
  .desc {
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .link {
    display: inline-block;
    margin-top: 32px;
    line-height: 30px;
    border-bottom: 2px solid #ee8b49;

    & > a {
      font-size: 20px;
      font-style: italic;
      font-weight: 700;
      color: #ee8b49;
      text-decoration: none;
    }

    & > img {
      width: auto;
      height: 17px;
    }
  }

  .both {
    display: flex;
    margin-top: 32px;
    line-height: 30px;

    .item {
      display: flex;
      align-items: center;
      max-width: 50%;

      .val {
        // max-width: calc(100% - 110px);
        margin-left: 8px;
        overflow: hidden;
        font-size: 20px;
        font-style: italic;
        font-weight: 700;
        color: #ee8b49;
        text-overflow: ellipsis;
        white-space: nowrap;

        span {
          cursor: pointer;
        }
      }

      &:last-child {
        margin-left: 24px;
      }
    }
  }

  .expire {
    display: flex;
    align-items: center;
    margin-top: 24px;
    font-size: 20px;
    font-weight: 700;
    line-height: 23px;
    text-transform: lowercase;
  }

  .info {
    display: flex;
    align-items: center;
    margin-top: 41px;
    font-size: 20px;
    font-weight: 700;

    & > .item {
      display: flex;
      align-items: center;

      .icon-end {
        width: 24px;
        height: 24px;
        margin-left: 4px;
      }

      &:last-child {
        margin-left: 156px;
      }
    }
  }

  .btn-group {
    position: absolute;
    right: 53px;
    bottom: 0;
    display: flex;
    flex-direction: row-reverse;
    transform: translateY(50%);

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 188px;
      height: 56px;
      margin-right: 22px;
      font-size: 20px;
      font-weight: 700;
      color: $vice-color;
      cursor: pointer;
      background-color: $main-color;
      border-radius: 32px;

      &.vice {
        color: $main-color;
        background-color: #fff;
        border: 2px solid $main-color;
      }

      & > img {
        width: 24px;
        height: 24px;
        margin-left: 11px;
      }

      &:first-child {
        margin-right: 0;
      }
    }
  }
}
</style>
