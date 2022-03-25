export default class Loaders {
    use: any;
    loaders: any[];
    constructor(options?: any);
    registerLoader(loader: any): this;
    removeLoader(name: any): this;
    isSupported(filepath: any): boolean;
    /**
     * Process the resource with loaders in serial
     * @param {object} resource
     * @param {string} resource.code
     * @param {any} resource.map
     * @param {object} context
     * @param {string} context.id The absolute path to resource
     * @param {boolean | 'inline'} context.sourceMap
     * @param {Set<string>} context.dependencies A set of dependencies to watch
     * @returns {{code: string, map?: any}}
     */
    process({ code, map }: {
        code: any;
        map: any;
    }, context: any): any;
    getLoader(name: any): any;
}
