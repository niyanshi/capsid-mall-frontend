/**
 * campaign相关接口
 */
import http, { prefix } from './http';
import { IResponseDto } from './types';

/**
 * 获取wear请求
 */
export const httpGetWearList = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/wear`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * wear生成nft/nfr请求
 */
export const httpCreateWear = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/create`, { ...data });
  return res.data;
};
/**
 * wear生成订单
 */
export const httpCreateWearOrder = async (wearId: number | string): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/order`, { wearId });
  return res.data;
};
/**
 * wear保存交易数据
 */
export const httpSaveOrderData = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/saveOrderData`, { ...data });
  return res.data;
};
/**
 * wear保存交易结果
 */
export const httpsaveOrderResult = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/saveOrderResult`, { ...data });
  return res.data;
};
/**
 * 获取wear可选collection
 */
export const httpGetWearCollection = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/collections/wear`);
  return res.data;
};
/**
 * 获取wearcollection下nft
 */
export const httpGetWearCollectionNFT = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/collections/wear/${params.slug}`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 获取wear详情
 */
export const httpGetWearDetail = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/wear/detail`, {
    params: { ...params },
  });
  return res.data;
};

/**
 * 查询discord
 */
export const httpGetDiscord = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/wear/queryDiscord`);
  return res.data;
};

/**
 * 添加discord
 */
export const httpAddDiscord = async (data: FormData): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/addDiscord`, data);
  return res.data;
};

