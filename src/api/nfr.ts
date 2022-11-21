import http, { prefix } from './http';
import { IResponseDto } from './types';

/** list NFR */
export const httpListNFR = async (data: Record<string, unknown>) => {
  const res = await http.post(`${prefix}/nfr-order/listing`, { ...data });
  return res.data;
};

/** request NFR */
export const httpRequestNFR = async (data: Record<string, unknown>) => {
  const res = await http.post(`${prefix}/nfr-order/request`, { ...data });
  return res.data;
};

/**
 * 获取nft下的nfr
 * @returns
 */
export const httpGetNFRsList = async (params: {
  nftTokenAddress: string;
  nftTokenId: string;
  type: 'listing' | 'request';
  pageNum?: number;
  pageSize?: number;
}) => {
  const res = await http.get(`${prefix}/nfr-request`, { params });
  return res.data;
};

/**
 * 获取nfr详情
 * @returns
 */
export const httpGetNFRsDetails = async (id: string): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nfr-request/detail`, { params: { nfrOrderId: id } });
  return res.data;
};

/**
 * 取消nfr 订单
 */
export const httpCancelNFRsOrder = async (
  id: string,
  status: 'pending' | 'cancel' | 'active',
): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nfr-order/cancel`, { params: { nfrOrderId: id, status } });
  return res.data;
};

/**
 * Accept nfr 订单
 */
export const httpAcceptNFRsOrder = async (id: string): Promise<IResponseDto> => {
  const res = await http.post(
    `${prefix}/nfr-trans/accept`,
    {},
    {
      params: { nfrOrderId: id },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

/**
 * Buy nfr
 * @param id 订单id
 * @param buyAmount 购买数量
 */
export const httpBuyNFRs = async (
  id: string,
  buyAmount: string | number,
): Promise<IResponseDto> => {
  const res = await http.post(
    `${prefix}/nfr-trans/buy`,
    {},
    {
      params: { nfrOrderId: id, buyAmount },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

/** 通知交易状态 */
export const httpNoticeStatus = async (id: string, transStatus: 'submitted' | 'failed') => {
  const res = await http.post(
    `${prefix}/nfr-trans/noticeStatus`,
    {},
    {
      params: { nfrTransId: id, transStatus },
    },
  );
  return res.data;
};

/** 获取type类型 */
export const httpGetType = async (): Promise<IResponseDto> => {
  const res = await http.get(`${prefix}/nfr-template`);
  return res.data;
};
