import { type KeyProviderConstructor } from "../../types/key.types";
import { webcrypto } from 'crypto';

export class BaseKeyService {
    public readonly keyProvider: Omit<KeyProviderConstructor, "provider">;

    constructor(keyProvider: Omit<KeyProviderConstructor, "provider">) {
        this.keyProvider = keyProvider;
    }

    async generateECDSAKey() : Promise<webcrypto.CryptoKeyPair> {
        const keyPair = await webcrypto.subtle.generateKey({
            name: "ECDSA",
            namedCurve: "P-256",
        }, true, ["sign", "verify"]);
        return keyPair;
    }
}