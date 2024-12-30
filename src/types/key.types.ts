export interface KeyProviderConstructor {
    provider: "lit" | "nillion";
    options: {
        apiKey: string;
        ttl?: number; // Only for Nillion : Default 30 days
    }
}