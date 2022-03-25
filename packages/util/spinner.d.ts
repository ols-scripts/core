declare class Spinner {
    spinner: any;
    constructor();
    start(title?: string): void;
    stop(clear?: boolean): void;
    clear(): void;
    setTitle(title?: string): void;
    setString(string: string): void;
}
declare const _default: Spinner;
export default _default;
