/* eslint-disable */
/**
 * @file 封装合约相关
 */
import { INFRTypeForRequest, ICreateNFT } from '@/types/nft';
import { Seaport } from '@opensea/seaport-js';
import { ethers } from 'ethers';
import * as buffer from 'buffer';
import { wethAddress, nfrContractAddress, nftContractAddress } from './var';
import wethAbi from './wethAbi.json';
import { toNonExponential } from '@/utils/util';
import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { ItemType } from '@opensea/seaport-js/lib/constants';

interface IBigOrderTtpe {
  order: string;
  amount?: number | string;
  orderId?: number | string;
}

interface IMetaDataType {
  name?: string;
  description?: string;
  image?: string;
  properties?: unknown;
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

/** 格式化nftmeta */
function formatNFTsMeta(data: INFRTypeForRequest): string {
  const obj: IMetaDataType = {
    name: String(data.type),
    description: data.desc,
    image: data.avatar,
    properties: { ...(data.attributes as object), token_type: 'NFR' },
  };
  console.log('formatNFTsMeta', obj);
  return JSON.stringify(obj);
}

const useSeaport = () => {
  window.Buffer = window.Buffer || buffer.Buffer;

  /** 获取weth余额 */
  const getWethBalance = async (address: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(wethAddress, wethAbi, provider);
    const balance = await contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  };

  /** 请求NFR */
  const requestNFR = async (data: INFRTypeForRequest) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    const signer = provider.getSigner();
    const accounts = (await provider.send('eth_requestAccounts', [])) as string[];
    getWethBalance(accounts[0]);
    const c = await signer.getBalance(provider.blockNumber);
    console.log(ethers.utils.formatEther(c));
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
      nftMeta: formatNFTsMeta(data),
      nftTokenAddress: String(data.nftContractAddress),
      orderOnChain: JSON.stringify(resOrder),
      orderOnChainHash: seaport.getOrderHash(resOrder.parameters),
      price: String(data.price),
      templateId: data.type,
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
      nftMeta: formatNFTsMeta(data),
      nftTokenAddress: String(data.nftContractAddress),
      orderOnChain: JSON.stringify(resOrder),
      orderOnChainHash: seaport.getOrderHash(resOrder.parameters),
      price: String(data.price),
      templateId: data.type,
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

  const poll = async (hash:string) => {
    console.log('🚀 ~ poll ~ hash', hash);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let txReceipt = await provider.getTransactionReceipt(hash);
    let count = 120;
    while (!(txReceipt && txReceipt.blockNumber) && count-- > 0) {
      txReceipt = await provider.getTransactionReceipt(hash);
      console.log('🚀 ~ mintNFt ~ txReceipt', txReceipt);
      const TIME = 1000;
      await new Promise((resolve) => setTimeout(resolve, TIME));
    }
    if (txReceipt && txReceipt.blockNumber) {
      window.console.log('success');
      return true;
    } else {
      return false;
    }
  }

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

  /** listinng nft */
  const listNFT = async (data: ICreateNFT) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    const tokenAddress = nftContractAddress;
    // 最大持续时间
    const MAX_DURATION = 365000;

    const order = {
      allowPartialFills: true,
      offer: [
        {
          itemType: ItemType.ERC721,
          token: tokenAddress,
          identifier: data.tokenId,
          amount: '1',
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther(String(data.price)).toString(),
        },
      ],
      salt: salt(tokenAddress, String(data.tokenId), Number(MAX_DURATION)),
    };
    console.log('order data', order);
    const { executeAllActions } = await seaport.createOrder(order);
    const resOrder = await executeAllActions();
    return {
      amount: String(1),
      chain: 'ethereum',
      description: data.description || '',
      nftTokenAddress: nftContractAddress,
      nftId: data.id,
      nftTokenType: 'ERC721',
      orderOnChain: JSON.stringify(resOrder),
      orderOnChainHash: seaport.getOrderHash(resOrder.parameters),
      unitPrice: String(data.price),
      creator: data.creator,
      status: 'active',
    };
  };

  /** buy nft */
  const buyNFT = async (order: OrderWithCounter, accountAddress: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const seaport = new Seaport(provider);
    console.log('order data', order);
    const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
      order,
      accountAddress: accountAddress,
    });

    const transaction = await executeAllFulfillActions();
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

    getWethBalance,

    listNFT,
    buyNFT,
    poll
  };
};

export default useSeaport;
