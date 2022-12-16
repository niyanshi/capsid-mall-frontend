/**
 * profile相关接口
 */
import http, { prefix } from './http';
import { IResponseDto } from './types';

/**
 * 获取个人资料
 */
export const httpGetAccount = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/account`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 编辑个人资料
 */
export const httpEditAccount = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/account/edit`, { ...params });
  return res.data;
};
/**
 * 获取账号下activity数据
 */
export const httpGetActivity = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/activity`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 获取账号下nfr数据
 */
export const httpGetNFR = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nfr-request/profile/nfr`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 获取账号下request数据
 */
export const httpGetRequest = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nfr-request/profile/request`, {
    params: { ...params },
  });
  return res.data;
};
