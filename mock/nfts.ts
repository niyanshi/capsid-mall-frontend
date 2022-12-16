import { MockMethod } from 'vite-plugin-mock';
import { mock } from 'mockjs';

const prefix = '/mock/nft';

const nftName = 'Doodle #9090';
const nftAvatar = '/mock-data/nft1.png';
export default [
  // 获取nft详情
  {
    url: `${prefix}/get-details`,
    method: 'get',
    response: () => {
      const res = mock({
        data: {
          id: 1234,
          name: nftName,
          avatar: nftAvatar,
          props: [
            'Bacground #0000',
            'Color #0001',
            'Bacground #00002',
            'Color #000',
            'Bacground #00004',
            'Color #02005',
          ],
        },
      });
      return {
        code: 0,
        data: res.data,
        msg: 'ok',
      };
    },
  },

  // 获取nfrs
  {
    url: `${prefix}/get-nfrs`,
    method: 'get',
    response: () => {
      const res = mock({
        'data|4': [
          {
            'id|+1': 1,
            name: 'NFR: Exhibition Purpose',
            expire: Date.now(),
            'total|+1': 10,
            price: 123.5,
            avatar: nftAvatar,
          },
        ],
      });
      return {
        code: 0,
        data: res.data,
        msg: 'ok',
      };
    },
  },

  // 获取nfr详情
  {
    url: `${prefix}/get-nfr-details`,
    method: 'get',
    response: () => {
      const res = mock({
        data: {
          'id|+1': 1,
          name: 'NFR: Exhibition Purpose',
          expire: Date.now(),
          'total|+1': 10,
          price: 123.5,
          avatar: '/mock-data/nft2.png',
          desc: 'This PoR serves as the reference of a collab between both sides to commercially use Bored Ape Yacht Club #00001 to produce and sell derivative works.',
          detailsUrl:
            'https://opensea.io/assets/ethereum/0x656d34a8309363302e46de99853f4cef30b85a1d/4887',
          issued: 'Alice',
          receive: 'Bob',
          remain: 9,
          nft: {
            id: 1234,
            name: nftName,
            avatar: nftAvatar,
            props: [
              'Bacground #0000',
              'Color #0001',
              'Bacground #00002',
              'Color #000',
              'Bacground #00004',
              'Color #02005',
            ],
          },
        },
      });
      return {
        code: 0,
        data: res.data,
        msg: 'ok',
      };
    },
  },
] as MockMethod[];
