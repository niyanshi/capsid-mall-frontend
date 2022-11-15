/**
 * @file 关于nft collection数据的类型定义
 */

export interface ICollectionsItemType {
  title: string;
  id: number | string;
  avatar?: string;
  nfrs?: number;
  floorPrice?: number;
  listings?: number;
}

/** 返回的Collection数据结构 */
export interface ICollectionsItemDto {
  name: string;
  nfrCount: number | string;
  imageUrl: string;
  floorPrice: string;
  listings: number;
  slug: string;
}
