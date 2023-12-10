export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export type AnyProps = Record<string, any>;
