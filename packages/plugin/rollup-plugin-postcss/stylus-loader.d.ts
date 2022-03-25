declare const _default: {
    name: string;
    test: RegExp;
    process({ code }: {
        code: any;
    }): Promise<{
        code: any;
        map: any;
    }>;
};
export default _default;
