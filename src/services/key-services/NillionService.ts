import { type KeyProviderConstructor } from "../../types/key.types";
import { BaseKeyService } from "./BaseKeyService";

export class NillionService extends BaseKeyService {
    
    constructor(keyProvider: Omit<KeyProviderConstructor, "provider">) {
        super(keyProvider);
    }

    async generateAndStoreKey() {
        const keyPair = await this.generateECDSAKey();
        const userSeed = this.keyProvider.options.apiKey;
        const ttl = this.keyProvider.options.ttl ?? 30; 
    }
}   