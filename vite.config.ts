import { ConfigEnv, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';

/** 代理目标 */
const targetObj = {
    wg: 'http://172.100.3.19:8080',
    // cj: 'http://172.100.3.188:9002',
    wq: 'http://172.100.3.144:9080',
    test: 'http://172.100.3.188:9092',
};

/**
 * 处理代理
 * @param prefix 前缀数组
 * @param target 代理目标
 * @param isRewrite 是否覆盖前缀
 * @returns
 */
const processProxy = (prefix: string[], target: string, rewriteStr?: string, isRewrite = false) => {
    const obj = {};
    if (!isRewrite) {
        prefix.forEach((item) => {
            obj[item] = {
                target,
                changeOrigin: true,
            };
        });
    } else {
        const regex = new RegExp(`^${rewriteStr}`);

        prefix.forEach((item) => {
            obj[item] = {
                target,
                changeOrigin: true,
                rewrite: (path: string) => path.replace(regex, ''),
            };
        });
    }
    return obj;
};

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv) =>
    defineConfig({
        plugins: [
            vue(),
            vueI18n({
                include: [resolve(__dirname, './locales/**')],
            }),
            viteMockServe({
                mockPath: 'mock',
                localEnabled: command === 'serve',
            }),
        ],
        base: './',
        server: {
            host: '0.0.0.0',
            port: 8080,
            proxy: {
                '/api': {
                    target: targetObj.test,
                    // rewrite:path => path.replace(/^\/api/, '')
                },
                // '/api': {
                //   target: targetObj.xjy,
                //   rewrite: (path) => path.replace(/^\/api/, ''),
                // },
                ...processProxy(
                    ['/api/v1/login', '/api/nft', '/api/nfr-order', '/api/collections', '/api/nfr-trans'],
                    targetObj.wg,
                ),
                ...processProxy(
                    [
                        '/api/nfr-request',
                        '/api/campaigns',
                        '/api/activity',
                        '/api/account',
                        '/api/wear',
                        '/api/campaign-nft',
                    ],
                    targetObj.wq,
                    '/api',
                    true,
                ),
            },
        },
        build: {
            outDir: 'dist',
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/global.scss";',
                },
            },
        },
        resolve: {
            alias: {
                '@': resolve('src'),
            },
        },
    });
