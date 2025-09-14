import type { CompareParams } from "./types/IHasher.types";

export interface IHasher {
  toHash(plain: string): Promise<string>;
  compare(params: CompareParams): Promise<boolean>;
}
