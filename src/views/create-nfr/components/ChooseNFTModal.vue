<template>
  <base-overlay
    :visible="props.visible"
    :top="156"
    @close="handleClose"
  >
    <div class="choose-nft-modal">
      <div class="close">
        <img
          :src="IconClose"
          alt=""
          @click="handleClose"
        />
      </div>
      <div class="title">
        <img
          :src="ImageBallooon"
          alt=""
        />
        {{ t('choose-nft') }}
      </div>

      <!-- 选择区域 -->
      <div class="radio-area">
        <base-radio-group
          :data="collectionsListRef"
          :active-key="activeKeyRef"
          @select="handleSelect"
        ></base-radio-group>
      </div>

      <div class="main-area">
        <NFTAvatar
          v-for="item in nftListRef"
          :key="item.id"
          :active="selectNFTRef?.id === item.id"
          :avatar="item.avatar!"
          @click="handleSelectNFT(item)"
        ></NFTAvatar>
      </div>

      <!-- 按钮组 -->
      <div class="btn-area">
        <div
          class="item"
          @click="handleRequest"
        >
          {{ t('list') }}
          <img
            :src="SvgAddList"
            alt=""
          />
          <div class="tip">{{ (nftListRef?.length || 0) + ' ' }}{{ t('nfts') }}</div>
        </div>
      </div>
    </div>
  </base-overlay>
</template>

<script setup lang="ts">
import SvgAddList from '@/assets/svg/add-list.svg';
import ImageBallooon from '@/assets/images/balloon.png';
import BaseOverlay from '@/components/BaseOverlay/index.vue';
import BaseRadioGroup from '@/components/BaseRadioGroup/index.vue';
import NFTAvatar from './NFTAvatar.vue';
import IconClose from '@/assets/icons/close.png';
import { useI18n } from 'vue-i18n';
import { httpGetNFTCollectionsList } from '@/api/explore';
import { onMounted, ref } from 'vue';
import { ICollectionsItemDto, ICollectionsItemType } from '@/types/collection';
import useMetaMask from '@/hooks/useMetaMask';
import { httpGetMyNFTs } from '@/api/nft';
import { INFTsDto, INFTsType } from '@/types/nft';
import { nfrContractAddress } from '@/hooks/var';

const { t } = useI18n();
const { getAddress } = useMetaMask();
const activeKeyRef = ref('all');
const collectionsListRef = ref<ICollectionsItemType[]>([]);
const nftListRef = ref<INFTsType[]>();
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (event: 'close'): void; (event: 'list', e?: INFTsType): void }>();
/** 选中的nft */
const selectNFTRef = ref<INFTsType>();

/** request nfr */
const handleRequest = () => {
  emit('list', selectNFTRef.value);
};

/** 选择nft */
const handleSelectNFT = (e: INFTsType) => {
  selectNFTRef.value = e;
};

/** 关闭遮罩 */
const handleClose = () => {
  emit('close');
};

/** 获取nft collections列表 */
const gettNFTCollectionsList = async () => {
  const res = await httpGetNFTCollectionsList();
  collectionsListRef.value = res.data.map((item: ICollectionsItemDto) => ({
    title: item.name,
    id: item.slug,
  }));
  collectionsListRef.value = [{ title: t('all'), id: 'all' }, ...collectionsListRef.value];
};

/** 获取nft列表 */
const getNFTsList = async () => {
  let offset = 0;
  let empty = false;
  let list = [] as INFTsType[];

  const limit = 100;
  const size = 1000;
  const owner = await getAddress();

  while (list.length < size && !empty) {
    const res = await httpGetMyNFTs({
      owner,
      collection: activeKeyRef.value === 'all' ? '' : activeKeyRef.value,
      offset,
      limit,
    });
    offset += limit;
    if (res.data.length === 0) {
      empty = true;
      break;
    }
    const arr = res.data
      ?.filter(
        (item: INFTsDto) => item.contractAddress.toLowerCase() !== nfrContractAddress.toLowerCase(),
      )
      ?.map((item: INFTsDto) => ({
        avatar: item.imageUrl,
        id: item.tokenId,
        contractAddress: item.contractAddress,
      }));
    list = [...list, ...arr];
  }
  nftListRef.value = list;
};

/** radio select */
const handleSelect = (e: string | number) => {
  activeKeyRef.value = String(e);
  getNFTsList();
};

onMounted(() => {
  gettNFTCollectionsList();
  getNFTsList();
});
</script>

<style scoped lang="scss">
.choose-nft-modal {
  position: relative;
  box-sizing: border-box;
  width: 1280px;
  height: 688px;
  padding-top: 1px;
  background-color: #fff;
  border-radius: 32px;
  box-shadow: 2px 2px 20px 10px rgb(163 32 21 / 8%);

  & > .close {
    display: flex;
    flex-direction: row-reverse;

    img {
      width: 18px;
      height: 18px;
      margin-top: 34px;
      margin-right: 50px;
      cursor: pointer;
    }
  }

  & > .title {
    display: flex;
    align-items: center;
    margin-left: 55px;
    font-family: 'Quiet Sans', sans-serif;
    font-size: 32px;
    font-weight: 800;

    & > img {
      width: 32px;
      height: auto;
      margin-right: 16px;
    }
  }

  & > .radio-area {
    padding: 0 75px;
    margin-top: 40px;
  }

  & > .main-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    row-gap: 16px;
    height: 300px;
    padding: 0 75px;
    margin-top: 40px;
    overflow-y: scroll;
  }

  & > .btn-area {
    position: absolute;
    right: 64px;
    bottom: 0;
    margin-top: 129px;
    transform: translateY(50%);

    .item {
      position: relative;
      box-sizing: border-box;
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

      & > img {
        width: 24px;
        height: 24px;
        margin-left: 8px;
      }

      & > .tip {
        position: absolute;
        top: 0;
        left: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #1f263b;
        transform: translateY(-150%);
      }
    }
  }
}
</style>
