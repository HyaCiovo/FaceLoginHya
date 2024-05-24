

interface Obj<T = any> {
  [k: string]: T;
}

type NullAble<T> = T | null;

interface Window {
  tracking: any;
}

interface HTMLElement {
  showModal: () => void;
}


declare module 'ali-oss';
