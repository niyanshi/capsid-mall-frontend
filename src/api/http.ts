import axios from 'axios';
import storage from '@/utils/storage';
import { RELOGIN_CODE } from '@/utils/constant';
import { useUserInfoStore } from '@/stores/user-info';
import { pinia } from '@/stores';
import { message } from 'ant-design-vue';
import Router from '@/router';

const userInfoStore = useUserInfoStore(pinia);

const http = axios.create({
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  if (storage.getToken()) {
    config.headers = {
      Authorization: `Bearer${storage.getToken()}`,
      'Accept-Language': 'en-us',
    };
  }

  return config;
});
http.interceptors.response.use(
  (config) => {
    const { data } = config;
    if (data.code === RELOGIN_CODE) {
      userInfoStore.logout();
      Router.push('/');
      message.warn(`CODE ${data.code}: ${data.message || data.msg}`);
    }
    return config;
  },
  (err) => err,
);

export default http;

export const prefix = import.meta.env.VITE_PREFIX;
