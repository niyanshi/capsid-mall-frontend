import { MockMethod } from 'vite-plugin-mock';
import { mock } from 'mockjs';

const prefix = '/mock/explore';

export default [
  // 获取nft collections列表
  {
    url: `${prefix}/get-collections-list`,
    method: 'get',
    response: () => {
      const res = mock({
        'list|18': [
          {
            'id|+1': 1,
            'title|+1': ['BAYC', 'MAYC', 'AZUKI', 'BAKC', 'DOODLES', 'CLONE X'],
            nfrs: 5534,
            floorPrice: 6.42,
            listings: 123,
            'avatar|+1': [
              '/mock-data/bayc.png',
              '/mock-data/mayc.png',
              '/mock-data/azuki.png',
              '/mock-data/bakc.png',
              '/mock-data/doodles.png',
              '/mock-data/clonex.png',
            ],
          },
        ],
      });

      return {
        code: 0,
        data: res.list,
        msg: 'ok',
      };
    },
  },

  {
    url: `${prefix}/get-nfts-list`,
    method: 'get',
    response: () => {
      const res = mock({
        'list|24': [
          {
            'id|+1': 1,
            'name|+1': [
              'BAYC #0000',
              'MAYC #129010',
              'AZUKI #908212',
              'BAKC #908212',
              'DOODLES #908212',
              'CLONE X',
            ],
            'avatar|+1': [
              '/mock-data/nft1.png',
              '/mock-data/nft2.png',
              '/mock-data/nft3.png',
              '/mock-data/nft4.png',
            ],
          },
        ],
      });

      return {
        code: 0,
        data: res.list,
        msg: 'ok',
      };
    },
  },
] as MockMethod[];
