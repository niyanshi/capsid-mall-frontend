<template>
  <BaseNFTsDetailsLayout
    v-if="nftDetalsRef"
    :data="nftDetalsRef"
  >
    <div class="explore-nft-details">
      <info-box
        :data="nfrDetalsRef"
        :btns="btnsConfigRef"
      ></info-box>
    </div>
  </BaseNFTsDetailsLayout>
  <div :style="{ height: '89px' }"></div>

  <!-- delist 确认框 -->
  <template v-if="delistVisibleRef">
    <cancel-confirm-model
      :visible="delistVisibleRef"
      title="Cancel Listing?"
      :icon="ImageCancel"
      @close="delistVisibleRef = false"
      @ok="handleConfirmDelistNFR"
    >
      <template #desc>
        <span>
          This will cancel your listing.You will also be asked to confirm this cancellation from you
          wallet.
        </span>
      </template>
    </cancel-confirm-model>
  </template>
</template>

<script setup lang="ts">
import IconRemove from '@/assets/icons/remove.svg';
import IconBuy from '@/assets/icons/buy.png';
import ImageCancel from '@/assets/images/cancel.png';
import {
  httpGetNFRsDetails,
  httpCancelNFRsOrder,
  httpAcceptNFRsOrder,
  httpNoticeStatus,
} from '@/api/nfr';
import BaseNFTsDetailsLayout from '@/components/BaseNFTsDetailsLayout/index.vue';
import CancelConfirmModel from '@/components/CancelConfirmModel/index.vue';
import InfoBox from './components/InfoBox.vue';
import { INFRsType, INFTsType } from '@/types/nft';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { IInfoBtnType } from '@/types/explore';
import { httpGetNFTsDetails } from '@/api/explore';
import dayjs from 'dayjs';
import useSeaport from '@/hooks/useSeaport';
import { message } from 'ant-design-vue';
import { useUserInfoStore } from '@/stores/user-info';
import { useControllerStore } from '@/stores/controller';
import { ERR } from '@/utils/constant';

const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();
const { cancelNFRsOrder, acceptNFRsRequest } = useSeaport();
const { t } = useI18n();
const router = useRouter();

const rejectMsg = t('err-msg.reject');

const nftDetalsRef = ref<INFTsType>();
const nfrDetalsRef = ref<INFRsType>();
/** 是否owner */
const isOwnerRef = ref(false);
/** 按钮配置 */
const btnsConfigRef = ref<IInfoBtnType[]>([]);
const delistVisibleRef = ref(false);
/** 判断是否在request页面 */
const isAtRequest = computed(() => router.currentRoute.value.path.indexOf('request') !== -1);

/** Delist NFR*/
const handleDelistNFR = async () => {
  delistVisibleRef.value = true;
};
const handleConfirmDelistNFR = async () => {
  delistVisibleRef.value = false;
  controllerStore.setGlobalLoading(true);
  if (isAtRequest.value) {
    controllerStore.setGlobalTip(t('wait-msg.cancel'));
  } else {
    controllerStore.setGlobalTip(t('wait-msg.delist'));
  }
  if (!nfrDetalsRef.value?.order) return;
  const { order, id: orderId } = nfrDetalsRef.value;
  try {
    await httpCancelNFRsOrder(String(orderId), 'pending');
    await cancelNFRsOrder({ order });
    const res = await httpCancelNFRsOrder(String(orderId), 'cancel');
    if (res.code !== 0) {
      await httpCancelNFRsOrder(String(orderId), 'active');
      message.error(res.msg);
      return;
    }
    router.back();
  } catch (error) {
    const { code } = error as IOpenseaErrorType;
    httpCancelNFRsOrder(String(orderId), 'active');
    if (code === ERR.RejectMessage) {
      message.error(rejectMsg);
    } else {
      message.error((error as Error).message);
    }
    console.error(error);
  }
  controllerStore.setGlobalLoading(false);
};

/** accept NFR Request */
const execAcceptRequest = async () => {
  if (!nfrDetalsRef.value?.order) return;
  const { order, id } = nfrDetalsRef.value;
  const res = await httpAcceptNFRsOrder(String(id));
  if (res.code !== 0) {
    message.error(res.msg);
    return;
  }
  controllerStore.setGlobalLoading(true);
  controllerStore.setGlobalTip(t('wait-msg.accept'));
  try {
    const orderId = res.data.nfrTrans.nfrTokenId;
    await acceptNFRsRequest({ order, orderId });
    await httpNoticeStatus(res.data.nfrTrans.id, 'submitted');
    message.info(t('info-msg.success'));
    router.back();
  } catch (error: unknown) {
    await httpNoticeStatus(res.data.nfrTrans.id, 'failed');
    const { code } = error as IOpenseaErrorType;
    if (code === ERR.RejectMessage) {
      message.error(rejectMsg);
    } else {
      message.error((error as Error).message);
    }
    console.error(error);
  } finally {
    controllerStore.setGlobalLoading(false);
  }
};

/** 购买nfr */
const execBuyNFR = async () => {
  if (!userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    return;
  }
  controllerStore.setModelVisibleForBuy(true);
  controllerStore.setOrderObjForBuy({
    id: String(nfrDetalsRef.value?.id),
    order: String(nfrDetalsRef.value?.order),
  });
};

/** 获取nft详情 */
const getNFTsDetails = async (address: string, id: string) => {
  const res = await httpGetNFTsDetails(String(address), String(id));
  const myAddress = userInfoStore.currentUser.publicKey;
  const d = res.data;
  let name = `${t('nfr')} - ${d.name}`;
  // request页面
  if (isAtRequest.value) {
    name = `${t('request-nfr')} -  ${d.name}`;
  }
  nftDetalsRef.value = {
    avatar: d.imageUrl,
    id: d.tokenId,
    contractAddress: d.contractAddress,
    name,
    props: d.traits?.map((item: { traitType: string; value: string }) => {
      const { traitType, value } = item;
      return `${traitType} ${value}`;
    }),
    owner: d.ownerAddressList,
  } as INFTsType;
  isOwnerRef.value = !nftDetalsRef.value?.owner?.every(
    (item) => item.toLowerCase() !== myAddress.toLowerCase(),
  );
  // 判断是否是owner
  if (!isOwnerRef.value) {
    // not owner
    if (nfrDetalsRef.value?.status === 'active') {
      btnsConfigRef.value = [
        {
          title: t('buy'),
          icon: IconBuy,
          event: execBuyNFR,
        },
      ] as IInfoBtnType[];
    }
  } else {
    // owner
    if (nfrDetalsRef.value?.status === 'active') {
      btnsConfigRef.value = [
        {
          title: t('delist'),
          type: 'vice',
          icon: IconRemove,
          event: handleDelistNFR,
        },
      ] as IInfoBtnType[];
    }
  }
  // request页面
  if (isAtRequest.value) {
    btnsConfigRef.value = [];
    if (!isOwnerRef.value) {
      // 请求creater
      if ((nfrDetalsRef.value?.creator as string).toLowerCase() === myAddress.toLowerCase()) {
        btnsConfigRef.value = [
          {
            title: t('cancel'),
            type: 'vice',
            icon: IconRemove,
            event: handleDelistNFR,
          },
        ] as IInfoBtnType[];
      }
    } else {
      btnsConfigRef.value = [
        {
          title: t('accept'),
          icon: IconBuy,
          event: execAcceptRequest,
        },
      ] as IInfoBtnType[];
    }
  }
};

/** 获取nfr详情 */
const getNFRsDetails = async () => {
  const { id } = router.currentRoute.value.params;
  const res = await httpGetNFRsDetails(String(id));
  const d = res.data;
  const { nftTokenAddress, nftTokenId } = d;
  nfrDetalsRef.value = {
    id: d.id,
    total: d.amount,
    price: d.unitPrice || d.totalPrice,
    receive: d.type === 'listing' ? d.receiver : d.nftOwnerAddress,
    issued: d.creator,
    desc: d.description,
    detailsUrl: d.detailsUrl,
    remain: d.amount - d.selledAmount || 0,
    expire: dayjs(d.createdAt).add(Number(d.duration), 'day').valueOf(),
    order: d.orderOnChain,
    creator: d.creator,
    status: d.status,
  };
  getNFTsDetails(nftTokenAddress, nftTokenId);
};

onMounted(() => {
  getNFRsDetails();
});
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
