<template>
  <div class="list-wrap">
    <BaseScrollList class="content" :height="650" :disabled="noScroll" @scroll="handleScroll">
      <!-- <div
        class="add item-size"
        @click="handleWearClick"
      >
        <div class="icon">
          <img
            src="../../assets/icons/icon-add.png"
            alt=""
            srcset=""
          />
          <div class="text">{{ t('wear-page.createNew') }}</div>
        </div>
      </div> -->
      <div
        v-for="(item, index) in wearList"
        :key="index"
        class="wear-item item-size"
        @click="goDetail(item)"
      >
        <BaseNFRImage
          v-if="isCompleteNFR(item)"
          style="width: 244px; height: 244px"
          class="scale"
          :src="item.wearMeta?.image as string"
        ></BaseNFRImage>
        <PrivateImage
          v-else-if="item.wearMeta?.image"
          class="scale"
          :src="item.wearMeta?.image"
        ></PrivateImage>
        <PrivateImage
          v-else
          class="scale"
          :src="item.parentPic1"
        ></PrivateImage>
        <!-- <img v-else :src="item.parentPic1" alt="" srcset=""> -->
        <div class="status text">
          <span>{{ wearStatus[item.status] }}</span>
          <div v-if="(item.status === 0)" class="pay" @click.stop="handleItemPay(item)">PAY</div>
        </div>
      </div>
    </BaseScrollList>
    <base-alert
      :visible="resultDialogVisible"
      :title="t('wearSuccess')"
      :icon="ImagePostbox"
      layer-class-name="wear-dialog"
      @close="resultDialogVisible = false"
    >
      <template #desc>
        <div>The artist is working on the final. It might take a few days.</div>
        <!-- <div></div> -->
      </template>
    </base-alert>
    <base-alert
      :visible="resultError"
      title="ERROR"
      :icon="Bag"
      :h="270"
      layer-class-name="wear-dialog error"
      @close="resultError = false"
    >
      <template #desc>
        <div>An error occurred in saving order: <span style="color: #ee8b49">{{resultHash}}</span></div>
        <div>Please contact the website administrator</div>
      </template>
    </base-alert>
    <base-alert
      :visible="resultPending"
      title="Time out"
      :icon="Bag"
      :h="300"
      layer-class-name="wear-dialog"
      @close="resultPending = false"
    >
      <template #desc>
        <div>Your transaction is still in the queue,please go to your wallet to check the transaction result.Your transaction hash: </div>
        <div style="color: #ee8b49">{{resultHash}}</div>
      </template>
    </base-alert>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { httpGetWearList } from '@/api/wear';
import { useUserInfoStore } from '@/stores/user-info';
import { IWear } from '@/types/campaign';
import PrivateImage from '@/components/PrivateImage/index.vue';
import BaseNFRImage from '@/components/BaseNFRImage/index.vue';
import BaseScrollList from '@/components/BaseScrollList/index.vue';
import useContract from '@/hooks/useContract';
import { useControllerStore } from '@/stores/controller';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/BaseAlert/index.vue';
import ImagePostbox from '@/assets/icons/party-popper.png';
import Bag from '@/assets/icons/bag.png';

const { t } = useI18n();
const userInfoStore = useUserInfoStore();
const { mintAndPay } = useContract();
const controllerStore = useControllerStore();
const router = useRouter();

const tabIndex = ref(0);
const noScroll = ref<boolean>(false);
const currentPageNum = ref(1);
const SIZE = 10;
const currentPageSize = ref(SIZE);
const isCompleteNFR = (item: IWear) => {
  const completeStatus = 3;
  const nfr = 2;
  return item.resultType === nfr && item.status === completeStatus;
};

const wearStatus = ['waitingPay','minting','waitingWear','wearing','complete'];

const wearList = ref<IWear[]>([]);
/**
 * 获取wear的列表
 * @ accountId 用户ID
 * @ type 类型 1 已完成 2 制作中
 */
const getWearList = async (isNew=false) => {
  if(isNew) wearList.value = [];
  const res = await httpGetWearList({
    accountId: userInfoStore.currentUser.userId,
    type: tabIndex.value === 0 ? '' : tabIndex.value,
    pageNum: currentPageNum.value,
    pageSize: currentPageSize.value
  });
  if (res.code === 0) {
    if (res.data.records.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
      return;
    }
    wearList.value = wearList.value?.concat(...res.data.records);
  }
};
const handleScroll = () => {
  // 若当前list的数量不是size的整数倍，说明已经请求完了
  if (wearList.value.length % currentPageSize.value > 0) {
    noScroll.value = true;
    return;
  }
  currentPageNum.value++;
  getWearList();
};

const resultDialogVisible = ref(false);
const resultError = ref(false);
const resultPending = ref(false);
const resultHash = ref('');
// 重新支付
const handleItemPay = async (wearItem: IWear) => {
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.wear'));
  const mintRes = await mintAndPay(wearItem.fee,wearItem.tokenId,wearItem.id,wearItem.wearOrderId);
  controllerStore.setGlobalLoading(false);
  if(mintRes.message !== 'fail') {
    currentPageNum.value = 1;
    getWearList(true);
  }
  if(mintRes.message === 'success') {
    resultDialogVisible.value = true;
  } else if(mintRes.message === 'hashFail') {
    // 保存hash失败
    resultError.value = true;
    resultHash.value = mintRes.value;
  } else if(mintRes.message === 'pending') {
    // 前端轮询超时
    resultPending.value = true;
    resultHash.value = mintRes.value;
  }
};

// 详情页
const goDetail = (item: IWear) => {
  router.push(`/wear/detail/${item.id}`);
};
onMounted(() => {
  getWearList(true);
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang=scss>
.wear-dialog {
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0 auto;

    & > .icon {
      width: 64px;
      height: 64px;
    }

    & > .section {
      margin-left: 24px;

      .title {
        font-family: 'Quiet Sans', serif;
        font-size: 32px;
        font-weight: 800;
      }

      .desc {
        margin-top: 10px;
        font-family: Roboto, serif;
        font-size: 20px;
        font-weight: 700;
        color: $main-font-color;
        overflow-wrap: anywhere;
        a {
          font-size: 20px;
          font-style: italic;
          font-weight: 700;
          color: #ee8b49;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
</style>
