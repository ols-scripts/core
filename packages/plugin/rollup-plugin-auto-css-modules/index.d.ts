import { Visitor } from '@babel/traverse';
export interface IOpts {
    ctx?: any;
}
export default function autoCssModules(): {
    visitor: Visitor<{}>;
};
