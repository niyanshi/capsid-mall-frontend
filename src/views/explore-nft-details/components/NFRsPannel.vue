<template>
  <div class="nfrs-pannel">
    <div class="title">
      <img
        :src="IconTicket"
        alt=""
      />
      {{ t('nfrs') }}
    </div>

    <div class="item-display">
      <NFRsDisplayItem
        v-for="item in nfrsListRef"
        :key="item.id"
        :data="item"
        :btn="
          props.isOwner
            ? {}
            : {
                title: t('buy'),
                icon: IconBuy,
                event: handleBuy,
              }
        "
      ></NFRsDisplayItem>
    </div>

    <div
      v-if="totalRef > nfrsListRef.length"
      class="btn"
      @click="showMore"
    >
      {{ t('more') }}
      <img
        :src="IconSort"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconTicket from '@/assets/icons/ticket.png';
import IconSort from '@/assets/icons/sort.png';
import IconBuy from '@/assets/icons/buy.png';
import NFRsDisplayItem from './NFRsDisplayItem.vue';
import { useI18n } from 'vue-i18n';
import { INFRsType, INFTsType } from '@/types/nft';
import { watch, ref, onMounted, onUnmounted } from 'vue';
import { httpBuyNFRs, httpGetNFRsList } from '@/api/nfr';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import useSeaport from '@/hooks/useSeaport';
import { EV_RELOAD_NFR_LIST } from '@/utils/constant';
import emitter from '@/utils/event';
import { useUserInfoStore } from '@/stores/user-info';
import { useControllerStore } from '@/stores/controller';
import { message } from 'ant-design-vue';

const { t } = useI18n();
const router = useRouter();
const { buyNFR } = useSeaport();
const userInfoStore = useUserInfoStore();
const controllerStore = useControllerStore();

const props = defineProps<{ data?: INFTsType; isOwner?: boolean }>();
const pageSize = 4;
const pageNumRef = ref(1);
const totalRef = ref(0);

const nfrsListRef = ref<INFRsType[]>([]);

const getNFRsList = async () => {
  const { address, id } = router.currentRoute.value.params;
  const res = await httpGetNFRsList({
    nftTokenAddress: String(address),
    nftTokenId: String(id),
    type: 'listing',
    pageNum: pageNumRef.value,
    pageSize,
  });
  const arr = res.data.records.map((item: Record<string, string>) => ({
    id: item.id,
    avatar: props.data?.avatar,
    total: item.amount,
    price: item.unitPrice,
    name: `${t('nfr')}: ${item.name || ''}`,
    expire: dayjs(item.createdAt).add(Number(item.duration), 'day').valueOf(),
    order: item.orderOnChain,
  }));
  totalRef.value = res.data.total;
  nfrsListRef.value.push(...arr);
};

const showMore = async () => {
  pageNumRef.value = pageNumRef.value + 1;
  getNFRsList();
};
watch(
  () => props.data,
  () => {
    if (props.data?.id) getNFRsList();
  },
  { immediate: true },
);
onMounted(() => {
  emitter.on(EV_RELOAD_NFR_LIST, () => {
    nfrsListRef.value = [];
    pageNumRef.value = 1;
    getNFRsList();
  });
});

onUnmounted(() => {
  emitter.off(EV_RELOAD_NFR_LIST);
});

/** 购买nfr */
const handleBuy = async (data: INFRsType) => {
  controllerStore.setGlobalLoading(true);
  try {
    if (!userInfoStore.currentUser.isLogin) {
      userInfoStore.setLoginModalVisible(true);
      return;
    }
    if (!data?.order) return;
    const { order, id } = data;
    const amount = 1;
    const res = await httpBuyNFRs(String(id), amount);
    if (res.code !== 0) return;
    const orderId = res.data.nfrTrans.nfrTokenId;
    const ret = await buyNFR({ order, orderId, amount });
    if (!ret) return;
    emitter.emit(EV_RELOAD_NFR_LIST);
  } catch (error) {
    console.error(error);
    message.error((error as Error).message);
  }
  controllerStore.setGlobalLoading(false);
};
</script>

<style scoped lang="scss">
.nfrs-pannel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 896px;
  min-height: 480px;
  padding: 0.1px 67px;
  padding-bottom: 67px;
  background-color: #fff;
  border-radius: 32px;
  box-shadow: 2px 2px 20px 10px rgb(163 32 21 / 8%);

  & > .title {
    display: flex;
    align-items: center;
    margin-top: 37px;
    font-family: 'Quiet Sans', serif;
    font-size: 32px;
    font-weight: 800;

    img {
      width: 32px;
      height: 32px;
      margin-right: 11px;
    }
  }

  & > .item-display {
    display: grid;
    grid-template-columns: 1fr auto;
    row-gap: 40px;
    margin-top: 37px;
  }

  & > .btn {
    position: absolute;
    right: 60px;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 188px;
    height: 56px;
    font-size: 20px;
    font-weight: 700;
    color: $vice-color;
    cursor: pointer;
    background-color: $main-color;
    border-radius: 32px;
    transform: translateY(50%);

    img {
      width: 24px;
      height: auto;
      margin-left: 8px;
    }
  }
}
</style>
