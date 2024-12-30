import { LitService } from "../services/key-services/LitService";
import { type KeyProviderConstructor } from "../types/key.types";
import { NillionService } from "../services/key-services/NillionService";

export class KeyProviderFactory {

    private readonly litService: LitService | undefined;
    private readonly nillionService: NillionService | undefined;

        constructor(keyProvider: KeyProviderConstructor) {
        switch (keyProvider.provider) {
            case "lit":
                this.litService = new LitService(keyProvider);
                break;
            case "nillion":
                this.nillionService = new NillionService(keyProvider);
                break;
        }
    }
}
