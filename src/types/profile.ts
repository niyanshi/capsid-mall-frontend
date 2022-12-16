export interface IProfile {
  avartar: string;
  description: string;
  etherAddr: string;
  id: number;
  twitter: string;
  username: string;
}
export interface IActivity {
  accountId: number;
  from: string;
  id: number;
  item: string;
  price: number;
  quantity: number;
  to: string;
  transTime: string;
  type: string;
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
export interface ITrait {
  displayType: string;
  traitType: string;
  value: string;
}
export interface INFT {
  contractAddress: string;
  imageUrl: string;
  name: string;
  tokenId: string;
  traits: ITrait[];
}
