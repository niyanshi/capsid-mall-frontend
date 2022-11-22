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
  localStorage.setItem(TOKEN, value);
};

/** 设置公钥 */
const setPublicKey = (value: string) => {
  localStorage.setItem(PUBLIC_KEY, value);
};
/** 设置用户id */
const setUserId = (value: string) => {
  localStorage.setItem(USER_ID, value);
};
/** 设置用户头像 */
const setUserAvartar = (value: string) => {
  localStorage.setItem(AVARTAR, value);
};

/**
 * 获取token
 * @returns token
 */
const getToken = () => localStorage.getItem(TOKEN);

/** 获取publicKey */
const getPublicKey = () => localStorage.getItem(PUBLIC_KEY);
/** 移除publicKey */
const removePublicKey = () => localStorage.removeItem(PUBLIC_KEY);

/**
 * 移除token
 * @returns
 */
const removeToken = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(PUBLIC_KEY);
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(AVARTAR);
};

/** 获取用户id */
const getUserId = () => localStorage.getItem(USER_ID);
/** 获取用户头像 */
const getUserAvartar = () => localStorage.getItem(AVARTAR);
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
