export interface IOfferItemType {
  amount: string;
  token: string;
}

export interface IConsiderationItemType {
  itemType: number;
  token: string;
  salt: string;
  identifiers: unknown[];
  amount: string;
}

export interface IOrderType {
  offer: IOfferItemType[];
  consideration: IConsiderationItemType[];
}
