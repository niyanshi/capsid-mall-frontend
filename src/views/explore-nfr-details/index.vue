<template>
  <Spin :spinning="spinRef">
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
    <div :style="{ height: '89px' }"></div> </Spin
  >>
</template>

<script setup lang="ts">
import IconRemove from '@/assets/icons/remove.svg';
import IconBuy from '@/assets/icons/buy.png';
import {
  httpGetNFRsDetails,
  httpCancelNFRsOrder,
  httpBuyNFRs,
  httpAcceptNFRsOrder,
  httpNoticeStatus,
} from '@/api/nfr';
import BaseNFTsDetailsLayout from '@/components/BaseNFTsDetailsLayout/index.vue';
import InfoBox from './components/InfoBox.vue';
import { INFRsType, INFTsType } from '@/types/nft';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { IInfoBtnType } from '@/types/explore';
import { httpGetNFTsDetails } from '@/api/explore';
import dayjs from 'dayjs';
import useSeaport from '@/hooks/useSeaport';
import { message, Spin } from 'ant-design-vue';
import { useUserInfoStore } from '@/stores/user-info';
import { useControllerStore } from '@/stores/controller';

const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();
const { cancelNFRsOrder, acceptNFRsRequest, buyNFR } = useSeaport();
const { t } = useI18n();
const router = useRouter();

const spinRef = ref(false);
const nftDetalsRef = ref<INFTsType>();
const nfrDetalsRef = ref<INFRsType>();
/** 是否owner */
const isOwnerRef = ref(false);
/** 按钮配置 */
const btnsConfigRef = ref<IInfoBtnType[]>([]);

/** 取消订单 */
const execCancelOrder = async () => {
  if (!nfrDetalsRef.value?.order) return;
  const { order, id: orderId } = nfrDetalsRef.value;
  const ret = await cancelNFRsOrder({ order });
  if (!ret) return;
  const res = await httpCancelNFRsOrder(String(orderId));
  if (res.code === 0) {
    router.back();
  }
};

/** cancel NFR */
const handleCancelNFR = async () => {
  controllerStore.setGlobalLoading(true);
  try {
    await execCancelOrder();
  } catch (error) {
    console.error(error);
  }
  controllerStore.setGlobalLoading(false);
};

/** accept NFR Request */
const execAcceptRequest = async () => {
  if (!nfrDetalsRef.value?.order) return;
  const { order, id } = nfrDetalsRef.value;
  const res = await httpAcceptNFRsOrder(String(id));
  if (res.code !== 0) return;
  const orderId = res.data.nfrTrans.nfrTokenId;
  const ret = await acceptNFRsRequest({ order, orderId });
  await httpNoticeStatus(res.data.nfrTrans.id, 'submitted');
  if (!ret) {
    return;
  }
  router.back();
};

/** 购买nfr */
const execBuyNFR = async () => {
  try {
    if (!userInfoStore.currentUser.isLogin) {
      userInfoStore.setLoginModalVisible(true);
      return;
    }
    if (!nfrDetalsRef.value?.order) return;
    const { order, id } = nfrDetalsRef.value;
    const amount = 1;
    const res = await httpBuyNFRs(String(id), amount);
    if (res.code !== 0) return;

    const orderId = res.data.nfrTrans.nfrTokenId;
    const ret = await buyNFR({ order, orderId, amount });
    if (!ret) return;
    router.back();
  } catch (error) {
    message.error((error as Error).message);
  }
};

/** 获取nft详情 */
const getNFTsDetails = async (address: string, id: string) => {
  const res = await httpGetNFTsDetails(String(address), String(id));
  const myAddress = userInfoStore.currentUser.publicKey;
  const d = res.data;
  let name = `${t('nfr')} - ${d.name}`;
  // request页面
  if (router.currentRoute.value.path.indexOf('request') !== -1) {
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
    btnsConfigRef.value = [
      {
        title: t('buy'),
        icon: IconBuy,
        event: execBuyNFR,
      },
    ] as IInfoBtnType[];
  } else {
    // owner
    btnsConfigRef.value = [
      {
        title: t('delist'),
        type: 'vice',
        icon: IconRemove,
        event: execCancelOrder,
      },
    ] as IInfoBtnType[];
  }

  // request页面
  if (router.currentRoute.value.path.indexOf('request') !== -1) {
    btnsConfigRef.value = [];
    if (!isOwnerRef.value) {
      // 请求creater
      if ((nfrDetalsRef.value?.creator as string).toLowerCase() === myAddress.toLowerCase()) {
        btnsConfigRef.value = [
          {
            title: t('cancel'),
            type: 'vice',
            icon: IconRemove,
            event: handleCancelNFR,
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
    price: d.unitPrice,
    receive: d.receive,
    issued: d.issued,
    desc: d.description,
    detailsUrl: d.detailsUrl,
    remain: d.remain || 0,
    expire: dayjs(d.createdAt).add(Number(d.duration), 'day').valueOf(),
    order: d.orderOnChain,
    creator: d.creator,
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
