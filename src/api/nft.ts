import http, { prefix } from './http';
import { IResponseDto } from './types';

/**
 * 获取当前用户nft
 */
export const httpGetMyNFTs = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nft`, { params: { ...params } });
  return res.data;
};
/**
 * 铸造nft
 */
export const httpMintNFT = async (data: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.post(`${prefix}/campaign-nft/minted`, { ...data });
  return res.data;
};
/**
 * buy nft
 */
export const httpBuyNFT = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/campaign-nft-order/buy`, { params: { ...params } });
  return res.data;
};
