/**
 * @file 封装合约相关
 */

import { ethers } from 'ethers';
import * as buffer from 'buffer';

const useContract = () => {
  window.Buffer = window.Buffer || buffer.Buffer;

  /** buy nft */
  const buyNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    //合约接⼝, 暂时⽤这个，不同环境会变，需要能配置。
    const nft721Address = '0x8E4fbBA66396fB606e8aa4057b5381277D024fA7';
    const nft721abi = ['function batchMint(uint256[] memory _ids) public'];
    const nft721Contract = new ethers.Contract(nft721Address, nft721abi, signer);
    //获取还有没mint的NftId数组（NftId是bigInt, 前后端接⼝要注意精度损失问题）
    const nftIds = getUnmintedNftIdsFromServer(campaignId);
    //预估GasFee
    const gasFee = await provider.getGasPrice();
    //发起交易，这⾥要注意异常处理（⽐如⽤⼾拒绝了签名）
    const mintResult = await nft721Contract.batchMint(nftIds, { gasPrice: gasFee });
    //保存交易提交结果到服务器
    // saveResultToServer();
    //轮循交易提交结果，这⼀步不是必须的，因为链上交易⽐较慢，主要清空是靠
    let txReceipt = await provider.getTransactionReceipt(mintResult.hash);
    let count = 20;
    while (!(txReceipt && txReceipt.blockNumber) && count-- > 0) {
      txReceipt = await provider.getTransactionReceipt(mintResult.hash);
      const TIME = 1000;
      await new Promise((resolve) => setTimeout(resolve, TIME));
    }
    if (txReceipt && txReceipt.blockNumber) {
      // saveSuccessResultToServer();
      // TODO
      console.log('saveSuccessResultToServer');
    } else {
      //如果还是没结果，就让服务端去轮询吧。
    }
  };

  return {
    buyNFT,
  };
};

export default useContract;
