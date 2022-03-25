export declare const PROJECT_PATH: string;
declare const git: import("simple-git").SimpleGit;
export default git;
/**
 * 获取分支信息
 *
 * @export
 * @return {*}
 */
export declare function getBranch(): Promise<import("simple-git").BranchSummary>;
/**
 * 检测本地仓库git是否干净
 *
 * @export
 * @return {*}
 */
export declare function checkAndCommitRepo(): Promise<boolean>;
/**
 * 执行commit
 *
 * @export
 * @param {string} [commitMsg]
 */
export declare function commit(commitMsg?: string): Promise<void>;
/**
 * 打tag
 *
 * @export
 * @param {*} version
 */
export declare function tag(version: any): Promise<void>;
/**
 * 获取git地址
 *
 * @export
 * @return {*}
 */
export declare function getGitUrl(): Promise<string>;
/**
 * 获取changelog
 *
 * @export
 * @return {*}
 */
export declare function getChangelog(): string;
/**
 * 生成changelog
 *
 * @export
 * @param {*} version
 */
export declare function generatorChangelog(version: any): Promise<void>;
