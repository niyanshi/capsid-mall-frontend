/**
 * @file 封装合约相关
 */

import * as buffer from 'buffer';
import { ethers } from 'ethers';
import { httpMintNFT } from '@/api/nft';
import { httpSaveOrderData,httpsaveOrderResult } from '@/api/wear';
import { nftContractAddress, wearContractAddress } from './var';
import { message } from 'ant-design-vue';
import { ERR, WAIT_TIME } from '@/utils/constant';
import { useI18n } from 'vue-i18n';

const useContract = () => {
  window.Buffer = window.Buffer || buffer.Buffer;
  const { t } = useI18n();

  const saveResultToServer = async (nftIds: bigint[], type: string, result: boolean) => {
    const nftTokenIds = nftIds.join(',');
    const res = await httpMintNFT({ nftTokenIds, type, result });
    return res.code === 0;
  };

  /** mint nft */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const mintNFt = async (nftIds: bigint[]) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    //合约接⼝, 暂时⽤这个，不同环境会变，需要能配置。
    const nft721Address = nftContractAddress;
    const nft721abi = ['function batchMint(uint256[] memory _ids) public'];
    const nft721Contract = new ethers.Contract(nft721Address, nft721abi, signer);
    //预估GasFee
    const gasFee = await provider.getGasPrice();
    window.console.log('gasFee', gasFee);
    //发起交易，这⾥要注意异常处理（⽐如⽤⼾拒绝了签名）
    try {
      //  gasLimit: 0
      const mintResult = await nft721Contract.batchMint(nftIds, { gasPrice: gasFee });
      // 保存交易提交结果到服务器
      saveResultToServer(nftIds, 'pending', false);
      //轮循交易提交结果，这⼀步不是必须的，因为链上交易⽐较慢，主要清空是靠
      let txReceipt = await provider.getTransactionReceipt(mintResult.hash);
      let count = 120;
      while (!(txReceipt && txReceipt.blockNumber) && count-- > 0) {
        txReceipt = await provider.getTransactionReceipt(mintResult.hash);
        window.console.log('txReceipt', txReceipt);
        const TIME = 1000;
        await new Promise((resolve) => setTimeout(resolve, TIME));
      }
      if (txReceipt && txReceipt.blockNumber) {
        const res = await saveResultToServer(nftIds, 'mint', true);
        window.console.log('saveSuccessResultToServer');
        if (res) {
          const resWait = await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, WAIT_TIME);
          });
          // eslint-disable-next-line max-depth
          if(resWait) return 'success';
          else return 'waiting';
        }
      } else {
        //如果还是没结果，让服务端去轮询。
        saveResultToServer(nftIds, 'mint', false);
        return 'waiting';
      }
    } catch (err) {
      window.console.log('mintNFt err', err);
      if ((err as IOpenseaErrorType).code === ERR.RejectMessage) {
        message.error(t('err-msg.reject'));
      } else {
        message.error(t('err-msg.request-fail'));
      }
      return 'error';
    }
    return 'waiting';
  };

  /** transfer eth */
  const transferETH = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    try {
      const transferResult = await signer.sendTransaction({
        to: '0x9b50D129DE67D1764A888eCfE27dC6B0f3B6820B',
        value: ethers.utils.parseEther('0.01'),
      });
      // 轮询交易结果
      let txReceipt = await provider.getTransactionReceipt(transferResult.hash);
      let count = 120;
      while (!(txReceipt && txReceipt.blockNumber) && count-- > 0) {
        txReceipt = await provider.getTransactionReceipt(transferResult.hash);
        window.console.log('txReceipt', txReceipt);
        const TIME = 1000;
        await new Promise((resolve) => setTimeout(resolve, TIME));
      }
      if (txReceipt && txReceipt.blockNumber) {
        window.console.log('success');
      } else {
        //如果还是没结果，让服务端去轮询。
        window.console.log('no error');
      }
    } catch (err) {
      window.console.log('error====',err);
    }
  };

  /** 生成wear订单 */
  const saveOrderResult = async (wearId: string|number,orderId: number,transactionResult: number) => {
    const res = await httpsaveOrderResult({wearId,orderId,transactionResult});
    return res.code === 0;
  };
  // eslint-disable-next-line complexity
  const mintAndPay = async (fee: string, nftId: string, wearId: number,orderId: number):Promise<{message:string,value: string}> => {
    window.console.log('now start mint');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    //合约接⼝, 暂时⽤这个，不同环境会变，需要能配置。
    const wearNftAddr = wearContractAddress;
    const wearNftAddrAbi = [
      'function withdraw(address payable to) public',
      'function mint(uint256 id) payable',
    ];
    const wearNft = new ethers.Contract(wearNftAddr, wearNftAddrAbi, signer);
    //预估GasFee
    const gasFee = await provider.getGasPrice();
    // 轮询结果 1成功，-1失败，2没结果
    const SUCCESS = 1;
    const FAIL = -1;
    const PENDING = 2;
    try {
      //发起交易，这⾥要注意异常处理（⽐如⽤⼾拒绝了签名）
      const mintResult = await wearNft.mint(nftId, {gasPrice: gasFee, value: ethers.utils.parseEther(fee)});
      try {
        //保存交易提交结果到服务器
        const orderRes = await httpSaveOrderData({
          orderId,
          transactionHash: mintResult.hash,
          wearId
        });
        if(orderRes.code !== 0) {
          // 保存交易数据失败
          return {message: 'hashFail',value: mintResult.hash};
        }
      } catch (err) {
        window.console.log('save hash fail',err);
        return {message: 'hashFail',value: mintResult.hash};
      }
      //轮循交易提交结果，最后要靠后端轮询来保证
      let txReceipt = await provider.getTransactionReceipt(mintResult.hash);
      const TIME = 1000;
      let count = 120;
      while (!(txReceipt && txReceipt.blockNumber) && count-- > 0) {
        txReceipt = await provider.getTransactionReceipt(mintResult.hash);
        window.console.log('txReceipt', txReceipt);
        await new Promise((resolve) => setTimeout(resolve, TIME));
      }
      try {
        if (txReceipt && txReceipt.blockNumber) {
          saveOrderResult(wearId,orderId,SUCCESS);
          window.console.log('success');
          return {message: 'success',value: ''};
        } else {
          //如果还是没结果，就让服务端去轮询。
          saveOrderResult(wearId,orderId,PENDING);
          return {message: 'pending',value: mintResult.hash};
        }
      } catch (err) {
        window.console.log('saveOrderResult ERR',err);
        return {message: 'pending',value: mintResult.hash};
      }
    } catch(err) {
      window.console.log('wear err', err);
      if ((err as IOpenseaErrorType).code === ERR.RejectMessage) {
        message.error(t('err-msg.reject'));
      } else {
        message.error(t('err-msg.request-fail'));
      }
      saveOrderResult(wearId,orderId,FAIL);
      return {message: 'fail',value: ''};
    }
  };


  return {
    mintNFt,
    transferETH,
    mintAndPay
  };
};

export default useContract;
