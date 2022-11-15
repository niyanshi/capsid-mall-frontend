/**
 * @file 封装metamask相关
 */
import { httpGetRandomString } from '@/api/common';
import { ethers } from 'ethers';

const useMetaMask = () => {
  const { ethereum, open } = window;
  /** 连接钱包 */
  const connectWallet = async () => {
    if (typeof ethereum === 'undefined') {
      open('https://metamask.app.link/dapp');
      throw new Error('未安装钱包');
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = (await provider.send('eth_requestAccounts', [])) as string[];
      // 获取字符串
      const resStr = await httpGetRandomString({
        address: accounts[0],
        chain: ethereum.chainId,
      });
      if (!resStr.data) {
        throw new Error('获取随机字符串失败');
      }
      const res = await signer.signMessage(resStr.data);
      return {
        signature: res,
        address: accounts[0],
        chain: ethereum.chainId,
      };
    } catch (error) {
      console.error('连接账户失败');
      throw error;
    }
  };

  /** 获取公钥 */
  const getAddress = async () => {
    if (typeof ethereum === 'undefined') {
      return '';
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = (await provider.send('eth_requestAccounts', [])) as string[];
    return accounts[0];
  };

  /** 监听账户切换 */
  // const monitorAccountChange = async (event: (e: unknown) => void) => {
  //   ethereum.on('accountsChanged', event);
  //   return ethereum.removeListener('accountsChanged', event);
  // };

  return {
    connectWallet,
    getAddress,
    // monitorAccountChange,
  };
};

export default useMetaMask;
