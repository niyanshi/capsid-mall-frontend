import http, { prefix } from './http';
import { IResponseDto } from './types';

/**
 * 获取当前用户nft
 */
export const httpGetMyNFTs = async (params: Record<string, unknown>): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nft`, { params });
  return res.data;
};
