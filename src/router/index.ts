/* eslint-disable sonarjs/no-duplicate-string */
import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserInfoStore } from '@/stores/user-info';

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index/index.vue'),
    meta: {
      title: 'title',
    },
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/explore/index.vue'),
    children: [
      {
        name: 'explore-nft-collections',
        path: '',
        component: () => import('@/views/explore-nft-collections/index.vue'),
      },
      {
        name: 'explore-nft-collections-display',
        path: 'nft-collections-display/:slug',
        component: () => import('@/views/explore-nft-collections-display/index.vue'),
      },
      {
        name: 'explore-nft-details',
        path: 'nft-details/:address/:id',
        component: () => import('@/views/explore-nft-details/index.vue'),
      },
      {
        name: 'explore-nfr-details',
        path: 'nfr-details/:id',
        component: () => import('@/views/explore-nfr-details/index.vue'),
      },
      {
        name: 'explore-nfr-details-request',
        path: 'nfr-details/:id/request',
        component: () => import('@/views/explore-nfr-details/index.vue'),
      },
    ],
    meta: {
      title: 'explore-title',
    },
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: () => import('@/views/campaign/index.vue'),
    children: [
      {
        name: 'campaign-list',
        path: '',
        component: () => import('@/views/campaign-list/index.vue'),
      },
      {
        name: 'campaign-create',
        path: 'campaign-create',
        component: () => import('@/views/campaign-create/index.vue'),
      },
      {
        name: 'campaign-detail',
        path: 'campaign-detail',
        component: () => import('@/views/campaign-detail/index.vue'),
      },
      {
        name: 'campaign-nft-edit',
        path: 'campaign-nft-edit/:id',
        component: () => import('@/views/campaign-nft-edit/index.vue'),
      },
      {
        name: 'campaign-nft-details',
        path: 'campaign-nft-details/:id',
        component: () => import('@/views/campaign-nft-details/index.vue'),
      },
    ],
    meta: {
      title: 'campaign-title',
    },
  },
  {
    path: '/create-nfr',
    name: 'create-nfr-editable',
    component: () => import('@/views/create-nfr/index.vue'),
    meta: {
      title: 'create-nfr-title',
    },
  },
  {
    path: '/create-nfr/:address/:id',
    name: 'create-nfr',
    component: () => import('@/views/create-nfr/index.vue'),
    meta: {
      title: 'create-nfr-title',
    },
  },
  {
    path: '/profile/:address',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: 'profile-title',
    },
  },
  {
    path: '/wear',
    name: 'wear',
    component: () => import('@/views/wear/index.vue'),
    meta: {
      title: 'wear-title',
    },
  },
];

const Router = createRouter({
  history: createWebHashHistory(),
  routes,
});
Router.beforeEach((to) => {
  const userInfoStore = useUserInfoStore();
  if(to.name === 'campaign-create' && !userInfoStore.currentUser.isLogin) {
    userInfoStore.setLoginModalVisible(true);
    return false;
  }
  return true;
});
export default Router;
