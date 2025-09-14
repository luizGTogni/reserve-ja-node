import type { IHasher } from "@/application/services/IHasher";
import type { CompareParams } from "@/application/services/types/IHasher.types";
import bcrypt from "bcryptjs";

export class BcryptHasher implements IHasher {
  async toHash(plain: string) {
    return await bcrypt.hash(plain, 6);
  }

  async compare({ plain, hashed }: CompareParams) {
    return await bcrypt.compare(plain, hashed);
  }
}
