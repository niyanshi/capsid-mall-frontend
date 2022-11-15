/**
 * 登录等一些页面公共接口
 */

import http, { prefix } from './http';

/**
 * 获取用于签名的字符串
 * @returns
 */
export const httpGetRandomString = async (data: Record<string, unknown>) => {
  const res = await http.post(`${prefix}/api/v1/login/request`, { ...data });
  return res.data;
};

/**
 * 获取token
 * @param data 参数
 * @returns
 */
export const httpGetToken = async (data: Record<string, unknown>) => {
  const res = await http.post(`${prefix}/api/v1/login`, { ...data });
  return res.data;
};
