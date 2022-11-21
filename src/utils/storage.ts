/**
 * @file 控制存储
 */
const TOKEN = 'token';
const PUBLIC_KEY = 'publicKey';
const USER_ID = 'userId';
const AVARTAR = 'avartar';
/**
 * 设置token到会话
 * @param value token值
 */
const setToken = (value: string) => {
  sessionStorage.setItem(TOKEN, value);
};

/** 设置公钥 */
const setPublicKey = (value: string) => {
  sessionStorage.setItem(PUBLIC_KEY, value);
};
/** 设置用户id */
const setUserId = (value: string) => {
  sessionStorage.setItem(USER_ID, value);
};
/** 设置用户头像 */
const setUserAvartar = (value: string) => {
  sessionStorage.setItem(AVARTAR, value);
};

/**
 * 获取token
 * @returns token
 */
const getToken = () => sessionStorage.getItem(TOKEN);

/** 获取publicKey */
const getPublicKey = () => sessionStorage.getItem(PUBLIC_KEY);
/** 移除publicKey */
const removePublicKey = () => sessionStorage.removeItem(PUBLIC_KEY);

/**
 * 移除token
 * @returns
 */
const removeToken = () => {
  sessionStorage.removeItem(TOKEN);
  sessionStorage.removeItem(PUBLIC_KEY);
  sessionStorage.removeItem(USER_ID);
  sessionStorage.removeItem(AVARTAR);
};

/** 获取用户id */
const getUserId = () => sessionStorage.getItem(USER_ID);
/** 获取用户头像 */
const getUserAvartar = () => sessionStorage.getItem(AVARTAR);
export default {
  setToken,
  getToken,
  removeToken,
  setPublicKey,
  getPublicKey,
  removePublicKey,

  setUserId,
  getUserId,

  setUserAvartar,
  getUserAvartar
};
