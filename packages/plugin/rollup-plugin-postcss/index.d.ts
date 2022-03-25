/**
 * fork from https://github.com/egoist/rollup-plugin-postcss/blob/master/src/index.js
 * 通过修改部分代码，解决自动css modules问题
 */
declare const _default: (options?: any) => {
    name: string;
    transform(code: any, id: any): Promise<{
        code: any;
        map: any;
    }>;
    augmentChunkHash(): string;
    generateBundle(options_: any, bundle: any): Promise<void>;
};
export default _default;
