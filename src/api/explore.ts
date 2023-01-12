import http, { prefix } from './http';
import { IResponseDto } from './types';
/**
 * 获取NFT Collections列表
 */
export const httpGetNFTCollectionsList = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/collections`);
  return res.data;
};

/**
 * 获取collection下的nfts
 * @param id collection的唯一标识
 * @returns
 */
export const httpGetNFTsByCollection = async (
  id: string,
  params?: { offset: number; limit: number; activeOnly: boolean },
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/collections/nfts/${id}`, { params });
  return res.data;
};

/**
 * 获取nft详情
 * @param assetContractAddress nft合约地址
 * @param tokenId nft的tokenId
 * @returns
 */
export const httpGetNFTsDetails = async (
  assetContractAddress: string,
  tokenId: string,
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nft/detail`, {
    params: {
      tokenId,
      assetContractAddress,
    },
  });
  return res.data;
};
