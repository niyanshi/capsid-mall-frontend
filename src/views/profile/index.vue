<template>
  <div class="main">
    <div class="user-name">{{ profile.username }}</div>
    <div class="content">
      <div class="left-part">
        <img ref="imgRef" class="avatar" :src="profile.avartar" alt="" srcset="" @error="onError">
        <div v-if="String(userInfoStore.currentUser.userId) === String(profile.id)" class="edit" @click="handleEditClick">{{
            t('profile-page.editProfile')
        }}</div>
      </div>
      <div class="right-part">
        <div class="tab">
          <span :class="['tab-item', currentTab === 0 ? 'active' : '']" @click="handleTabChange(0)">{{
              t('profile-page.tabList[0]')
          }}</span>
          <span :class="['tab-item', currentTab === 1 ? 'active' : '']" @click="handleTabChange(1)">{{
              t('profile-page.tabList[1]')
          }}</span>
          <span :class="['tab-item', currentTab === 2 ? 'active' : '']" @click="handleTabChange(2)">{{
              t('profile-page.tabList[2]')
          }}</span>
          <span :class="['tab-item', currentTab === 3 ? 'active' : '']" @click="handleTabChange(3)">{{
              t('profile-page.tabList[3]')
          }}</span>
        </div>
        <div>
          <div class="operate">
            <span
              v-show="currentTab === 1 || currentTab === 2"
              :class="['operate-button', currentSecondTab === 0 ? 'active' : '']"
              @click="handleSecondTabChange(0)">{{t('profile-page.created')}}</span>
            <span
              v-show="currentTab === 1"
              :class="['operate-button', currentSecondTab === 1 ? 'active' : '']"
              @click="handleSecondTabChange(1)">{{ t('profile-page.owned') }}</span>
            <span
              v-show="currentTab === 2"
              :class="['operate-button', currentSecondTab === 2 ? 'active' : '']"
              @click="handleSecondTabChange(2)">{{ t('profile-page.received') }}</span>
          </div>
          <div v-show="currentTab !== 3 && !isEmpty()" ref="scrollListRef" class="position-list">
            <PositionItem v-for="(item, index) in NFTList" v-show="currentTab === 0" :key="index" :pic="String(item.imageUrl)" :name="String(item.name)" @click="goNFTDetail(item)">
            </PositionItem>
            <PositionItem
              v-for="(item, index) in NFRList"
              v-show="currentTab === 1"
              :key="index"
              :pic="String(item.image)"
              :name="`NFR:${item.templateId}`"
              @click="goNFRDetail(item)">
            </PositionItem>
            <PositionItem
              v-for="(item, index) in requestList"
              v-show="currentTab === 2"
              :key="index"
              :pic="String(item.image)"
              :name="`NFR:${item.templateId}`"
              @click="goNFRRequestDetail(item)">
            </PositionItem>
          </div>
          <div v-show="currentTab !== 3 && isEmpty()" class="empty">
            <span class="icon-empty"></span>
            <span>{{ t('emptyTips') }}</span>
          </div>
          <div v-show="currentTab === 3" class="activity">
            <BaseTable :columns="columns" :data="list" :empty-text="t('emptyTips')"></BaseTable>
            <Pagination v-model:current="pageNum" class="flexr" :total="total" @change="getActivty"></Pagination>
          </div>
        </div>
      </div>
    </div>
    <BaseDialog :visible="editDialogVisible" width="640" height="592" @close="handleDialogClose">
      <div class="dialog-content">
        <div class="dialog-title">
          <span>
            <img class="icon" src="../../assets/icons/memo.png">
            <span>{{ t('profile-page.editProfile') }}</span>
          </span>
          <p>{{ t('profile-page.editProfileDesc') }}</p>
        </div>
        <div class="middle">
          <div class="left-part">
            <form-item class="form-item" :title="t('profile-page.diaplayName')" :width="272">
              <base-input v-model="editProfile.username" style-type="line">
              </base-input>
            </form-item>
            <form-item class="form-item bottom-line" :title="t('profile-page.twitter')" :width="272">
              <img class="icon" src="@/assets/icons/twitter.png" />
              <base-input v-model="editProfile.twitter" :placeholder="t('profile-page.twitterPlaceholder')">
              </base-input>
            </form-item>
          </div>
          <div class="right-part">
            <span>{{ t('profile-page.profileImage') }}</span>
            <BaseImageSelect
              v-model="editProfile.avartar" width="160" height="160" icon-size="25"
              url="/account/upload">
            </BaseImageSelect>
            <span class="text-center">{{ t('uploadImage') }}</span>
          </div>
        </div>
        <form-item class="form-item" :title="t('profile-page.bio')" :width="568">
          <base-input
            v-model="editProfile.description" :placeholder="t('profile-page.bioPlaceholder')"
            style-type="line">
          </base-input>
        </form-item>
      </div>
      <template #button>
        <div class="dialog-button" @click="handleProfileEdit">
          <span>{{ t('ok') }}</span>
          <i class="icon-ok"></i>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BaseDialog from '@/components/BaseDialog/index.vue';
import BaseImageSelect from '@/components/BaseImageSelect/index.vue';
import BaseInput from '@/components/BaseInput/index.vue';
import BaseTable from '@/components/BaseTable/index.vue';
import FormItem from '@/components/BaseForm/FormItem.vue';
import PositionItem from './components/PositionItem.vue';
import { onMounted, reactive, ref, h, watch, onUnmounted } from 'vue';
import { httpGetAccount, httpEditAccount, httpGetActivity, httpGetNFR, httpGetRequest } from '@/api/profile';
import { useUserInfoStore } from '@/stores/user-info';
import { IProfile, IActivity, INFT, INFR } from '@/types/profile';
import compass from '../../assets/icons/compass.png';
import { httpGetMyNFTs } from '@/api/nft';
import dayjs from 'dayjs';
import { useRouter, useRoute } from 'vue-router';
import { message,Pagination } from 'ant-design-vue';
import { nfrContractAddress, nftContractAddress } from '@/hooks/var';
import { toNonExponential } from '@/utils/util';
import ImageAlt from '@/assets/images/image-alt.png';

const userInfoStore = useUserInfoStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const SESSION_KEY = 'profile-tab';
const currentTab = ref(Number(sessionStorage.getItem(SESSION_KEY)) || 0);

const currentAccount = ref<string>(userInfoStore.currentUser.publicKey as string);
// 当前的资料
const profile = reactive<IProfile>({
  id: -1,
  username: '',
  twitter: '',
  avartar: '',
  description: '',
  etherAddr: ''
});
// 编辑弹框的资料
const editProfile = ref<IProfile>({
  id: -1,
  username: '',
  twitter: '',
  avartar: '',
  description: '',
  etherAddr: ''
});
const editDialogVisible = ref(false);
const handleEditClick = () => {
  editProfile.value = {
    id: profile.id,
    username: profile.username,
    twitter: profile.twitter,
    avartar: profile.avartar,
    description: profile.description,
    etherAddr: profile.etherAddr
  };
  editDialogVisible.value = true;
};
const handleDialogClose = () => {
  editDialogVisible.value = false;
};

const currentSecondTab = ref(0);
const currentPageNum = ref(1);
const SIZE = 20;
const currentPageSize = ref(SIZE);
const currentList = ref<{
  name: string,
  imageUrl: string
}[]>([]);
const NFTList = ref<INFT[]>([]);
const NFRList = ref<INFR[]>([]);
const requestList = ref<INFR[]>([]);
const noScroll = ref<boolean>(false);
const isEmpty = () => {
  if(currentTab.value === 0) {
    return NFTList.value.length === 0;
  } else if(currentTab.value === 1) {
    return NFRList.value.length === 0;
  } else {
    return requestList.value.length === 0;
  }
};
const ERROR_MESSAGE = t('err-msg.request-fail');

/**
 * NFTs
 * @param isNew true-刷新列表，获取到的数据不会拼接到已有数据之后
 */
const getNFTList = async (isNew=false,length = 0) => {
  const res = await httpGetMyNFTs({
    owner: profile.etherAddr,
    limit: currentPageSize.value,
    offset: currentPageSize.value * (currentPageNum.value - 1 <= 0 ? 0 : currentPageNum.value - 1)
  });
  if (res.code === 0) {
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
      return;
    }
    // 筛选出规定合约的nft
    const filterList = res.data.filter((item: INFT) =>
      item.contractAddress.toLowerCase() !== nfrContractAddress.toLowerCase() &&
      item.contractAddress.toLowerCase() !== nftContractAddress.toLowerCase());
    // const list = res.data.map((item: INFT) => ({
    //   name: item.name,
    //   imageUrl: item.imageUrl
    // }));
    if(isNew) {
      NFTList.value = filterList;
    } else {
      NFTList.value = NFTList.value?.concat(...filterList);
    }
    // eslint-disable-next-line no-magic-numbers
    if(filterList.length + length < currentPageSize.value / 2) {
      // 如果筛选结果不足规定一半，重新请求一次
      const timeout = 1000;
      currentPageNum.value++;
      setTimeout(() => {
        getNFTList(false, filterList.length);
      }, timeout);
    }
  } else {
    message.error(ERROR_MESSAGE);
  }
};

/**
 * NFRs
 */
const getNFRList = async (isNew=false) => {
  const res = await httpGetNFR({
    accountAdr: profile.etherAddr,
    type: currentSecondTab.value === Number('1') ? 'owned' : 'created',
    pageSize: currentPageSize.value,
    pageNum: currentPageNum.value
  });
  if (res.code === 0) {
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
    }
    // const list = res.data?.records.map((item: INFR) => ({
    //   name: 'NFR:',
    //   imageUrl: item.image
    // }));
    if(isNew) {
      NFRList.value = res.data?.records;
    } else {
      NFRList.value = NFRList.value?.concat(...res.data.records);
    }
  } else {
    message.error(ERROR_MESSAGE);
  }
};
/**
 * request
 */
const getRequestList = async (isNew = false) => {
  const res = await httpGetRequest({
    accountAdr: profile.etherAddr,
    type: currentSecondTab.value === Number('2') ? 'received' : 'created',
    pageSize: currentPageSize.value,
    pageNum: currentPageNum.value
  });
  if (res.code === 0) {
    if (res.data.length === 0) {
      // 没有值说明已经请求完毕
      noScroll.value = true;
    }
    // const list = res.data.records.map((item: INFR) => ({
    //   name: 'NFR:',
    //   imageUrl: item.image
    // }));
    if(isNew) {
      requestList.value = res.data.records;
    } else {
      requestList.value = requestList.value?.concat(...res.data.records);
    }
  } else {
    message.error(ERROR_MESSAGE);
  }
};

/**
 * activity
 */
const pageNum = ref(1);
const total = ref(0);
const columns = [
  {
    label: t('activityTableLabel[0]'),
    prop: 'item',
    width: 200,
    type: 'image',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cellRender: (val: any) => h(
      'div',
      {
        style: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
      },
      [
        h(
          'img',
          {
            src: val.image,
            style: {
              width: '50px',
              height: '50px',
              'margin-right': '7px',
              'border-radius': '10px'
            }
          }
        ),
        h(
          'div',
          {
            style: {
              'max-width': '140px',
              'text-overflow': 'ellipsis',
              'overflow': 'hidden',
            }
          },
          val.name || '--'
        ),
      ]
    ),
  },
  {
    label: t('activityTableLabel[1]'),
    prop: 'price',
    width: 100,
    cellRender: (val: {value: string}) => h(
      'div',
      {
        style: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center'
        }
      },
      [
        h(
          'img',
          {
            src: compass,
            style: {
              width: '10px',
              height: '16px',
              'margin-right': '7px'
            }
          }
        ),
        h(
          'span',
          toNonExponential(Number(val.value)) || '--'
        ),
      ]
    )
  },
  { label: t('activityTableLabel[2]'), prop: 'quantity', width: 100 },
  {
    label: t('activityTableLabel[3]'), prop: 'sourceFrom', width: 200, cellRender: (val: {value: string}) => h(
      'span',
      {
        style: {
          color: '#ffb080'
        },
        onClick: () => {
          if(val.value) router.push(`/profile/${val.value}`);
        }
      },
      // eslint-disable-next-line no-magic-numbers
      val.value === userInfoStore.currentUser.publicKey ? 'you' : val.value?.slice(2,8) || '--'
    )
  },
  {
    label: t('activityTableLabel[4]'),
    prop: 'sourceTo',
    width: 200,
    cellRender: (val: {value: string}) => h(
      'span',
      {
        style: {
          color: '#ffb080'
        },
        onClick: () => {
          if(val.value) router.push(`/profile/${val.value}`);
        }
      },
      // eslint-disable-next-line no-magic-numbers
      val.value === userInfoStore.currentUser.publicKey ? 'you' : val.value?.slice(2,8) || '--'
    )
  },
  { label: t('activityTableLabel[5]'), prop: 'activityType', width: 100 },
  {
    label: t('activityTableLabel[6]'),
    prop: 'transTime',
    width: 160,
    cellRender: (val: {value: string}) => {
      const time = dayjs(new Date(val.value)).format('YYYY-MM-DD HH:mm:ss');
      return h(
        'span',
        time
      );
    }
  },
];
const list = ref<IActivity[]>([]);
const getActivty = async () => {
  const accountAddr = currentAccount.value;
  const res = await httpGetActivity({
    accountAddr,
    pageNum:pageNum.value,
    pageSize: 10
  });
  if (res.code === 0) {
    list.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error(ERROR_MESSAGE);
  }
};

/**
 * 控制数据获取
 */
const getData = (isNew = false) => {
  const index = currentTab.value;
  if (index === Number('0')) {
    getNFTList(isNew);
  } else if (index === Number('1')) {
    currentSecondTab.value = 0;
    getNFRList(isNew);
  } else if (index === Number('2')) {
    currentSecondTab.value = 0;
    getRequestList(isNew);
  } else if (index === Number('3')) {
    getActivty();
  }
};

/** profile */
const getProfile = async () => {
  const accountAdr = currentAccount.value;
  const res = await httpGetAccount({ accountAdr });
  if (res.code === 0) {
    profile.id = res.data.id;
    profile.username = res.data.username;
    profile.avartar = res.data.avartar;
    profile.description = res.data.description;
    profile.twitter = res.data.twitter;
    profile.etherAddr = res.data.etherAddr;
    userInfoStore.setCurrentUser({
      avatar:res.data.avartar
    });
    getData(true);
  } else {
    message.error(res.msg);
  }
};
/** 资料编辑 */
const handleProfileEdit = async () => {
  const res = await httpEditAccount(editProfile.value);
  if (res.code === 0) {
    getProfile();
    editDialogVisible.value = false;
  }
};

/** tab切换 */
const handleTabChange = (index: number) => {
  currentTab.value = index;
  sessionStorage.setItem(SESSION_KEY, String(index));
  currentPageNum.value = 1;
  noScroll.value = false;
  getData(true);
};

/** 二级tab切换 */
const handleSecondTabChange = (index: number) => {
  currentSecondTab.value = index;
  noScroll.value = false;
  currentPageNum.value = 1;
  if (currentTab.value === 1) {
    NFRList.value = [];
    getNFRList(true);
  } else {
    requestList.value = [];
    getRequestList(true);
  }
};

const scrollListRef = ref();
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.scrollTop + target.clientHeight === target.scrollHeight) {
    // 若当前list的数量不是size的整数倍，说明已经请求完了
    if (currentList.value.length % currentPageSize.value > 0) return;
    currentPageNum.value++;
    getData();
  }
};
// 监听滚动区域，加载出来后挂载滚动方法
watch(scrollListRef, (val) => {
  if(val) {
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  }
});
watch(() => noScroll.value, () => {
  // 根据条件添加删除滚动函数
  if (!noScroll.value) {
    window.console.log('add listen');
    scrollListRef.value?.addEventListener('scroll', handleScroll);
  } else {
    window.console.log('remove listen');
    scrollListRef.value?.removeEventListener('scroll', handleScroll);
  }
},{immediate: true});
// 点击跳转到NFT详情页
const goNFTDetail = (NFT: INFT) => {
  router.push(`/explore/nft-details/${NFT.contractAddress}/${NFT.tokenId}`);
};
// 点击跳转到NFR详情页
const goNFRDetail = (NFR: INFR) => {
  router.push(`/explore/nfr-details/${NFR.id}`);
};
// 点击跳转到NFR requset详情页
const goNFRRequestDetail = (NFR: INFR) => {
  router.push(`/explore/nfr-details/${NFR.id}/request`);
};
onMounted(() => {
  currentAccount.value = route.params.address as string;
  getProfile();
});
onUnmounted(() => {
  sessionStorage.removeItem(SESSION_KEY);
});
// 图片错误处理
const imgRef = ref();
const onError = function () {
  if (!imgRef.value) return;
  imgRef.value.src = ImageAlt;
};
</script>

<style scoped lang="scss">
@import './index.scss';

</style>
<style>
.ant-pagination-prev:hover button,
.ant-pagination-item:hover a,
.ant-pagination-item-active a {
  color: #a32015;
}
.ant-pagination-item:hover,
.ant-pagination-item-active {
  border-color: #a32015;
}
</style>
