/**
 * @file nft数据定义
 */

export interface INFTsType {
  id: string | number;
  name: string;
  avatar: string;
  props?: string[];
  contractAddress?: string;
  owner?: string[];
  attributes?: unknown;
}

export interface INFTsDto {
  tokenId: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
  props?: string[];
}

export interface INFRsType {
  id: string | number;
  name?: string;
  avatar?: string;
  total?: number;
  price?: number;
  expire?: number;
  receive?: string;
  issued?: string;
  remain?: number;
  detailsUrl?: string;
  desc?: string;
  nftName?: string;
  nft?: INFTsType;
  order?: string;
  status?: string;
  duration?: number;
  expired?: boolean;
  [key: string]: unknown;
}

export interface INFRsDto {
  id: string | number;
  name: string;
  avatar: string;
  total: number;
  price: number;
  expire: number;
  receive?: string;
  issued?: string;
  remain?: number;
  detailsUrl?: string;
  desc?: string;
  nft?: INFTsDto;
}

/** 用于请求nfr的类型 */
export interface INFRTypeForRequest {
  type: string | number;
  price: number;
  druation: number;
  quantity: number;
  nftId?: number | string;
  nftContractAddress?: string;
  desc?: string;
  details?: string;
  avatar?: string;
  attributes?: unknown;
  nftName: string;
  [key: string]: unknown;
}

// 创建的nft
export interface ICreateNFT {
  campaignId: number;
  collection: string;
  contractAddress: string;
  createTime: string;
  creator: string;
  deleteFlag: number;
  description: string;
  id: number;
  imageUrl: string;
  name: string;
  originalData: string;
  price: string;
  status: string;
  tokenId: string;
  updateTime: string;
  nfrOrderId: number | null;
  nftOrderId: number | null;
}

// wear下collection的nft
export interface IWearCollectionNFT {
  contractAddress: string;
  imageUrl: string;
  name: string;
  ownerAddressList:Array<string>,
  tokenId: string;
  traits: [
    {
      displayType: string;
      traitType: string;
      value: string;
    }
  ]
}
