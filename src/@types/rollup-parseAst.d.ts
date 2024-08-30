// src/types/rollup-parseAst.d.ts
declare module "rollup/parseAst" {
  export function parseAst(input: string): any; // Substitua `any` por um tipo mais específico, se conhecido
  export function parseAstAsync(input: string): Promise<any>; // Substitua `any` por um tipo mais específico, se conhecido
}
