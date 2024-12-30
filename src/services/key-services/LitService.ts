import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { BaseKeyService } from "./BaseKeyService";
import { type KeyProviderConstructor } from "../../types/key.types";
import { ethers, type Signer } from "ethers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { type LIT_NETWORK_VALUES } from "@lit-protocol/constants";
import { generateAuthSig } from "@lit-protocol/auth-helpers";
import { debug } from "node:console";
import { createSiweMessageWithRecaps, type LitResourceAbilityRequest } from "@lit-protocol/auth-helpers";
import { trace } from "console";
import { generateIdSync } from "../../utils";
import { type SessionSigsMap, type ExecuteJsResponse } from "@lit-protocol/types";

export class LitService extends BaseKeyService {

    private readonly litNodeClient: LitNodeClient;
    private readonly litContracts: LitContracts;
    private readonly litNetwork: LIT_NETWORK_VALUES = "datil-dev";
    private readonly isConnected: boolean;

    constructor(keyProvider: Omit<KeyProviderConstructor, "provider">) {
        super(keyProvider);
        this.litNodeClient = new LitNodeClient({
            alertWhenUnauthorized: true,
            litNetwork: this.litNetwork,
        });
        this.litContracts = new LitContracts({
            network: this.litNetwork,
            signer: this.getMinterWallet(),
          });
        this.litContracts.connect();
        this.litNodeClient.connect();
        this.isConnected = true;
    }

    public async getLitNodeClient() {
        return this.litNodeClient;
    }

    public async disconnect() {
        await this.litNodeClient.disconnect();
    }   

    getMinterWallet(rpc_url = "https://yellowstone-rpc.litprotocol.com/") {
        const provider = rpc_url
          ? new ethers.providers.JsonRpcProvider(rpc_url)
          : ethers.getDefaultProvider();
    
        if (!process.env['MINTER_PRIVATE_KEY']) {
          throw new Error("MINTER_PRIVATE_KEY is not set");
        }
        const pvtKey = process.env['MINTER_PRIVATE_KEY'];
        const wallet = new ethers.Wallet(pvtKey, provider);
    
        return wallet;
      }
      
  async generateSessionSigs(
    signer: Signer,
    resources: LitResourceAbilityRequest[],
    chainId = 1,
    expirationTime?: string,
    statement = "Generate a session signature"
  ) {
    trace("[generateSessionSigs] generate request: %O", {
      resources,
      chainId,
      expirationTime,
      statement,
    });
    const sessionSigs = await this.litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration:
        expirationTime ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      resourceAbilityRequests: resources,
      capabilityAuthSigs: [await this.createCapacityDelegationAuthSig()],
      authNeededCallback: async (callbackParams) => {
        const { resourceAbilityRequests, uri, expiration } = callbackParams;
        debug("[generateSessionSigs] AuthCallbackParams: %O", callbackParams);
        const toSign = await createSiweMessageWithRecaps({
          uri: uri ?? "",
          resources: resourceAbilityRequests ?? [],
          expiration:
            expiration ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          chainId,
          walletAddress: await signer.getAddress(),
          nonce: generateIdSync(16, "0123456789"),
          domain: "covalenthq.com",
          statement,
          litNodeClient: this.litNodeClient,
          version: "1",
        });
        trace("[generateSessionSigs:authNeededCallback] toSign: %O", toSign);
        return generateAuthSig({
          signer,
          toSign,
          address: await signer.getAddress(),
        });
      },
    });
    debug("[generateSessionSigs] Session sigs: %O", sessionSigs);
    return sessionSigs;
  }

  async createCapacityDelegationAuthSig(
    pkpEthAddress?: string,
    signer?: Signer
  ) {
    console.log(
      "[createCapacityDelegationAuthSig] Creating capacity delegation auth sig"
    );
    signer = signer ?? this.getMinterWallet();
    let capacityTokenId = process.env['LIT_CAPACITY_CREDIT_TOKEN_ID'] ?? "";
    if (capacityTokenId === "" || capacityTokenId === undefined) {
      console.log("No Capacity Credit provided, minting a new one...");
      capacityTokenId = (
        await this.litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 7,
        })
      ).capacityTokenIdStr;
      console.log(`Minted new Capacity Credit with ID: ${capacityTokenId}`);
    } else {
      console.log(
        `Using provided Capacity Credit with ID: ${process.env['LIT_CAPACITY_CREDIT_TOKEN_ID']}`
      );
    }
    const { capacityDelegationAuthSig } =
      await this.litNodeClient.createCapacityDelegationAuthSig({
        uses: "1",
        dAppOwnerWallet: signer,
        capacityTokenId,
        delegateeAddresses: [
          ...(pkpEthAddress != null ? [pkpEthAddress] : []),
          await signer.getAddress(),
        ],
      });
    console.log(
      "[createCapacityDelegationAuthSig] Capacity delegation auth sig created",
      capacityDelegationAuthSig
    );
    return capacityDelegationAuthSig;
  }

  // Only supports ethers@5.7 and jwt package, else need to be bundled and uploaded to IPFS
  async executeLitAction(
    sessionSigs: SessionSigsMap,
    code: string,
    ipfsHash?: string,
    jsParams?: { [key: string]: any }
  ) : Promise<ExecuteJsResponse> {

    let response: ExecuteJsResponse;

    if(ipfsHash) {
      response = await this.litNodeClient.executeJs({
        sessionSigs,
        ipfsId: ipfsHash,
        jsParams,
      });
    } else {
      response = await this.litNodeClient.executeJs({
        sessionSigs,
        code,
        jsParams,
      });
    }

    return response;
  }
}   