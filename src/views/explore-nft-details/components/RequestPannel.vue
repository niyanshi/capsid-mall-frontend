<template>
  <div class="request-pannel">
    <div class="title">
      <img
        :src="ImageThumbtack"
        alt=""
      />
      {{ t('requests') }}
    </div>

    <div class="item-display">
      <NFRsDisplayItem
        v-for="item in nfrsListRef"
        :key="item.id"
        :data="item"
        :btn="
          !props.isOwner
            ? {}
            : {
                title: t('accept'),
                icon: IconAccept,
                event: handleAccpet,
              }
        "
        :is-request="true"
      ></NFRsDisplayItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageThumbtack from '@/assets/images/thumbtack.png';
import IconAccept from '@/assets/icons/accept.png';
import NFRsDisplayItem from './NFRsDisplayItem.vue';

import { useI18n } from 'vue-i18n';
import { INFRsType, INFTsType } from '@/types/nft';
import { watch, ref, onMounted, onUnmounted } from 'vue';
import { httpAcceptNFRsOrder, httpGetNFRsList } from '@/api/nfr';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import useSeaport from '@/hooks/useSeaport';
import emitter from '@/utils/event';
import { EV_RELOAD_NFR_LIST } from '@/utils/constant';

const { t } = useI18n();
const router = useRouter();
const { acceptNFRsRequest } = useSeaport();

const props = defineProps<{ data?: INFTsType; isOwner?: boolean }>();

const pageSize = 999;
const pageNumRef = ref(1);
const nfrsListRef = ref<INFRsType[]>([]);

const getNFRsList = async () => {
  const { address, id } = router.currentRoute.value.params;
  const res = await httpGetNFRsList({
    nftTokenAddress: String(address),
    nftTokenId: String(id),
    type: 'request',
    pageNum: pageNumRef.value,
    pageSize,
  });

  nfrsListRef.value = res.data.records.map((item: Record<string, string>) => ({
    id: item.id,
    avatar: props.data?.avatar,
    total: item.amount,
    price: item.totalPrice,
    name: `${t('nfr')}: ${item.name || ''}`,
    expire: dayjs(item.createdAt).add(Number(item.duration), 'day').valueOf(),
    order: item.order,
  }));
};

/** accept NFR */
const handleAccpet = async (data: INFRsType) => {
  if (!data?.order) return;
  const { order, id: orderId } = data;
  const res = await httpAcceptNFRsOrder(String(orderId));
  console.log({ res });
  // const ret = acceptNFRsRequest({ order, orderId });
  // if (!ret) return;
  // const res = await httpAcceptNFRsOrder(String(orderId));
  // if (res.code === 0) {
  //   // TODO: 刷新
  // }
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
    getNFRsList();
  });
});

onUnmounted(() => {
  emitter.off(EV_RELOAD_NFR_LIST);
});
</script>

<style scoped lang="scss">
.request-pannel {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 896px;
  min-height: 480px;
  padding: 0.1px 67px;

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
}
</style>
