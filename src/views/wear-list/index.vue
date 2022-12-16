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
          :src="item.wearMeta?.image as string"
        ></BaseNFRImage>
        <PrivateImage
          v-else-if="item.wearMeta?.image"
          :src="item.wearMeta?.image"
        ></PrivateImage>
        <PrivateImage
          v-else
          :src="item.parentPic1"
        ></PrivateImage>
        <!-- <img v-else :src="item.parentPic1" alt="" srcset=""> -->
        <div class="status text">
          <span>{{ wearStatus[item.status] }}</span>
          <div v-if="(item.status === 0)" class="pay" @click.stop="handleItemPay(item)">PAY</div>
        </div>
      </div>
    </BaseScrollList>
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

// 重新支付
const handleItemPay = async (wearItem: IWear) => {
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.wear'));
  const mintRes = await mintAndPay(wearItem.fee,wearItem.tokenId,wearItem.id,wearItem.wearOrderId);
  controllerStore.setGlobalLoading(false);
  if(mintRes !== 'fail') {
    currentPageNum.value = 1;
    getWearList(true);
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
