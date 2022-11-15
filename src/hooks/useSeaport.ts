/**
 * @file 封装合约相关
 */
import { INFRTypeForRequest } from '@/types/nft';
import { Seaport } from '@opensea/seaport-js';
import { ethers } from 'ethers';
import * as buffer from 'buffer';
import { wethAddress, nfrContractAddress } from './var';

interface IBigOrderTtpe {
  order: string;
  amount?: number | string;
  orderId?: number | string;
}

/**
 * 哈希算法
 * @param token 40位16进制字符串
 * @param id 64位16进制字符串
 * @param duraiton  整数（天数）
 * @returns 加密字符串
 */
function salt(token: string, id: string, duraiton: number): string {
  const nums = 64;
  const nftId = `${String(id).padStart(nums, '0')}`;
  const params = `${[token, nftId, duraiton].join('')}`;
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(params));
}

const useSeaport = () => {
  window.Buffer = window.Buffer || buffer.Buffer;

  /** 请求NFR */
  const requestNFR = async (data: INFRTypeForRequest) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);

    const order = {
      offer: [
        {
          amount: ethers.utils.parseEther(String(data.price)).toString(),
          token: wethAddress,
        },
      ],
      consideration: [
        {
          itemType: 3,
          token: nfrContractAddress,
          salt: salt(nfrContractAddress, String(data.nftId), Number(data.druation)),
          identifiers: [],
          amount: String(data.quantity),
        },
      ],
    };
    const { executeAllActions } = await seaport.createOrder(order);
    const resOrder = await executeAllActions();
    console.log(resOrder);
    return {
      amount: String(data.quantity),
      chain: 'ethereum',
      description: data.desc || '',
      duration: String(data.druation),
      nfrTokenAddress: nfrContractAddress,
      nftId: String(data.nftId),
      nftMeta: JSON.stringify(data),
      nftTokenAddress: String(data.nftContractAddress),
      orderOnChain: JSON.stringify(resOrder),
      orderOnChainHash: seaport.getOrderHash(resOrder.parameters),
      price: String(data.price),
      templateId: '',
    };
  };

  /** listing NFR */
  const listNFR = async (data: INFRTypeForRequest) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    // const { chainId } = await provider.getNetwork();
    const tokenAddress = nfrContractAddress;
    const order = {
      allowPartialFills: true,
      offer: [
        {
          itemType: 3,
          token: tokenAddress,
          identifiers: [],
          amount: String(data.quantity),
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther(String(data.price)).toString(),
        },
      ],
      salt: salt(tokenAddress, String(data.nftId), Number(data.druation)),
    };
    console.log('order data', order);
    const { executeAllActions } = await seaport.createOrder(order);
    const resOrder = await executeAllActions();
    return {
      amount: String(data.quantity),
      chain: 'ethereum',
      description: data.desc || '',
      duration: String(data.druation),
      nfrTokenAddress: nfrContractAddress,
      nftId: String(data.nftId),
      nftMeta: JSON.stringify(data),
      nftTokenAddress: String(data.nftContractAddress),
      orderOnChain: JSON.stringify(resOrder),
      orderOnChainHash: seaport.getOrderHash(resOrder.parameters),
      price: String(data.price),
      templateId: '',
    };
  };

  /** cancel List  */
  const cancelNFRsOrder = async (bigOrder: IBigOrderTtpe) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    const order = JSON.parse(bigOrder.order);
    const orderHash = seaport.getOrderHash(order.parameters);
    const address = await provider.getSigner().getAddress();
    const result = await seaport.cancelOrders([order.parameters], address).transact();
    //result最好能保存下来，以便后续查询订单状态
    console.log(result);
    let orderStatus = await seaport.getOrderStatus(orderHash);
    let status = orderStatus.isCancelled;
    const ms = 1000;
    while (!status) {
      await new Promise((resolve) => setTimeout(resolve, ms));
      orderStatus = await seaport.getOrderStatus(orderHash);
      status = orderStatus.isCancelled;
      console.log('waiting for order to be cancelled, order status', orderStatus);
    }
    return status;
  };

  /** buy NFR  */
  const buyNFR = async (bigOrder: IBigOrderTtpe) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    const order = JSON.parse(bigOrder.order);
    const { orderId, amount } = bigOrder;
    const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      order,
      offerCriteria: [{ identifier: String(orderId), proof: [] }],
      unitsToFill: amount,
    });
    const transaction = await executeAllFulfillActions();
    console.log('transaction', transaction);
    return transaction;
  };

  /** accept NFR  */
  const acceptNFRsRequest = async (bigOrder: IBigOrderTtpe) => {
    const order = JSON.parse(bigOrder.order);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    const { executeAllActions } = await seaport.fulfillOrder({
      order,
      considerationCriteria: [{ identifier: String(bigOrder.orderId), proof: [] }],
    });
    const transaction = await executeAllActions();
    console.log('transaction', transaction);
    return transaction;
  };

  return {
    nfrContractAddress,
    wethAddress,

    requestNFR,
    acceptNFRsRequest,

    listNFR,
    cancelNFRsOrder,
    buyNFR,
  };
};

export default useSeaport;
