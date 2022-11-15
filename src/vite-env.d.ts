/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

// 声明以太坊接口
interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

declare interface Window {
  ethereum: {
    request: (args: RequestArguments) => Promise<unknown>;
    chainId: string;
    on: (key: string, event: (e: unknown) => void) => void;
    removeListener: (key: string, event: (e: unknown) => void) => void;
  };
}

interface ImportMetaEnv {
  readonly VITE_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
