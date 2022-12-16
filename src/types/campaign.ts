/* eslint-disable no-magic-numbers */
export interface ICampaign {
  banner: string;
  campaignName: string;
  endTime: string;
  ownerEtherAddr: string;
  ownerId: number;
  startTime: string;
  link: string;
  content: string;
}
export interface IcampaignId {
  id: number;
}
export interface INFT {
  id: number;
  collection: string;
  contractAddress: string;
  createTime: string;
  imageUrl: string;
  name: string;
  originalData: string;
  tokenId: string;
  updateTime: string;
  description: string;
  price: string;
}
export interface INFR {
  amount: number;
  chain: string;
  createdAt: string;
  creator: string;
  description: string;
  duration: number;
  extra: string;
  id: number;
  image: string;
  nfrTokenAddress: string;
  nfrTokenId: string;
  nftId: string;
  nftMeta: string;
  nftOwnerAddress: string;
  nftTokenAddress: string;
  nftTokenType: string;
  orderOnChain: string;
  orderOnChainHash: string;
  selledAmount: number;
  status: number;
  templateId: string;
  tokenType: string;
  totalPrice: string;
  type: string;
  unitPrice: string;
  updatedAt: string;
}
export interface ICampaignDetail {
  id: number;
  banner: string;
  campaignName: string;
  endTime: string;
  ownerEtherAddr: string;
  ownerId: number;
  startTime: string;
  link: string;
  content: string;
  nftTokenIds: string;
  nfts: INFT[],
  nfrs: INFR[]
}

export interface IWear {
  accountAddress: string,
  accountId: number,
  fee: string,
  id: number,
  meta: string,
  parentPic1: string,
  parentPic2: string,
  parentTokenId1: string,
  parentTokenId2: string,
  parentType1: 1|2,
  parentType2: 1|2,
  tokenAddress1: string,
  tokenAddress2: string,
  tokenId: string,
  tokenType1: string,
  tokenType2: string,
  status: 0|1|2|3,
  resultType: 1|2,
  wearMeta?: {
    description: string,
    expirationDate: string;
    image: string,
    name: string
  },
  wearOrderId: number
}
export interface IWearItem {
  image: string;
  tokenId: string;
  // eslint-disable-next-line no-magic-numbers
  type: 1| 2;
  tokenAddress: string;
}
export interface IRequestV {
  amount: number;
  chain: string;
  createdAt: string;
  creator: string;
  description: string;
  duration: number;
  extra: string;
  id: number;
  image: string;
  nfrTokenAddress: string;
  nftId: string;
  nftMeta: string;
  nftOwnerAddress: string;
  nftTokenAddress: string;
  nftTokenType: string;
  orderOnChain: string;
  orderOnChainHash: string;
  selledAmount: number;
  status: string;
  templateId: string;
  tokenType: string;
  totalPrice: string;
  type: string;
  unitPrice: string;
  updatedAt: string;
}
