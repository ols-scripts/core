declare const _default: {
    name: string;
    alwaysProcess: boolean;
    process({ code, map }: {
        code: any;
        map: any;
    }): Promise<{
        code: string;
        map: any;
        extracted: any;
    }>;
};
export default _default;
