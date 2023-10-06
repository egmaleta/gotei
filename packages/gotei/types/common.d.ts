export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export declare const typeSymbol: unique symbol;
