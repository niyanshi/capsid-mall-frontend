export interface IInfoBtnType {
  title: string;
  icon?: string;
  type?: 'main' | 'vice';
  event?: (e: unknown) => unknown;
}
