/**
 * @file 封装合约相关
 */

import * as buffer from 'buffer';
import { ethers } from 'ethers';
import { httpMintNFT } from '@/api/nft';
import { nftContractAddress } from './var';
import { message } from 'ant-design-vue';
import { ERR } from '@/utils/constant';
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
  const mintNFt = async (nftIds: bigint[]) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    //合约接⼝, 暂时⽤这个，不同环境会变，需要能配置。
    const nft721Address = nftContractAddress;
    const nft721abi = ['function batchMint(uint256[] memory _ids) public'];
    const nft721Contract = new ethers.Contract(nft721Address, nft721abi, signer);
    //预估GasFee
    const gasFee = await provider.getGasPrice();
    console.log('🚀 ~ mintNFt ~ gasFee', gasFee);
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
        console.log('🚀 ~ mintNFt ~ txReceipt', txReceipt);
        const TIME = 1000;
        await new Promise((resolve) => setTimeout(resolve, TIME));
      }
      if (txReceipt && txReceipt.blockNumber) {
        const res = await saveResultToServer(nftIds, 'mint', true);
        window.console.log('saveSuccessResultToServer');
        if(res) return 'success';
      } else {
        //如果还是没结果，让服务端去轮询。
        saveResultToServer(nftIds, 'mint', false);
        return 'waiting';
      }
    } catch (err) {
      console.log('🚀 ~ mintNFt ~ err', err);
      if ((err as IOpenseaErrorType).code === ERR.RejectMessage) {
        message.error(t('err-msg.reject'));
      } else {
        message.error(t('err-msg.request-fail'));
      }
      return 'error';
    }
  };

  return {
    mintNFt,
  };
};

export default useContract;
