export declare const CONFIG_FILES: string[];
export declare function getExistFile({ cwd, files }: {
    cwd: any;
    files: any;
}): string;
export declare function getUserConfigPath(cwd?: string): string;
export default function getUserConfig(): any;
