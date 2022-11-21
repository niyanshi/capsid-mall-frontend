/**
 * campaign相关接口
 */
import http, { prefix } from './http';
import { IResponseDto } from './types';

/**
 * 分页获取campaigns
 */
export const httpGetCampaignList = async (
  params: Record<string, unknown>,
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaigns`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 创建、修改campaigns
 */
export const httpCreateCampaign = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/campaigns/create`, { ...data });
  return res.data;
};
/**
 * 生成NFR
 */
export const httpCreateWearNfr = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaigns/createWearNfr`);
  return res.data;
};
/**
 * 生成NFT
 */
export const httpCreateWearNft = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaigns/createWearNft`);
  return res.data;
};
/**
 * 获取单个campaign
 */
export const httpGetCampaignDetail = async (
  params: Record<string, unknown>,
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaigns/detail`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * download
 */
export const httpDownload = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaigns/download`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * upload
 */
export const httpUploadload = async (url: string, data: FormData): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}${url}`, data);
  return res.data;
};
/**
 * 获取wear请求
 */
export const httpGetWearList = async (
  params: Record<string, unknown>,
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/wear`, {
    params: { ...params },
  });
  return res.data;
};
/**
 * 创建wear
 */
export const httpCreateWear = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/wear/create`, { ...data });
  return res.data;
};
/**
 * 保存campaign-nft
 */
export const httpSaveNFT = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/campaign-nft/save`, { ...data });
  return res.data;
};
/**
 * 查询campaign待铸造的nft列表
 */
export const httpGetCampaignNFTList = async (
  id: number,
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaign-nft/mintingList/${id}`);
  return res.data;
};
/**
 * 下架campaign-nft
 */
export const httpRemoveCampaignNFT = async (nftId: number): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaign-nft/remove`, {params: { nftId }});
  return res.data;
};
/**
 * 关联id
 */
export const httpRelateOrder = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/campaign-nft/relateOrder`, { ...data });
  return res.data;
};
/**
 * 获取campaign Nft详情
 */
export const httpCampaignNFTDetail = async (campaignNftId: number): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaign-nft/detail/${campaignNftId}`);
  return res.data;
};
/**
 * 创建nft listing
 */
export const httpListNFT = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/campaign-nft-order/listing`, { ...data });
  return res.data;
};
