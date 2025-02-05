import {
    Admin,
    type AdminConfig,
    type AgentConfig,
    type PkpInfo,
} from "@lit-protocol/agent-wallet";
import type { AUTH_METHOD_SCOPE_VALUES } from "@lit-protocol/constants";

export class LitTool {
    private admin: Admin | null = null;

    /**
     * Initialize the Lit Protocol Admin
     * @param adminConfig Configuration for the Admin role
     * @param agentConfig Configuration for the agent
     */
    async initialize(
        adminConfig: AdminConfig,
        agentConfig?: AgentConfig
    ): Promise<void> {
        try {
            this.admin = await Admin.create(adminConfig, agentConfig);
        } catch (error) {
            throw new Error(
                `Failed to initialize Lit Admin: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Create a new Agent Wallet by minting a PKP
     * @returns Promise resolving to the PKP info
     */
    async createWallet(): Promise<PkpInfo> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.mintPkp();
        } catch (error) {
            throw new Error(
                `Failed to create wallet: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Transfer ownership of a PKP to a new address
     * @param pkpTokenId The token ID of the PKP
     * @param newOwnerAddress The address of the new owner ( You can send Zero Address to burn the NFT and make agent completely autonomous )
     */
    async transferWalletOwnership(
        pkpTokenId: string,
        newOwnerAddress: string
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.transferPkpOwnership(pkpTokenId, newOwnerAddress);
        } catch (error) {
            throw new Error(
                `Failed to transfer wallet ownership: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get all PKPs owned by the Admin
     * @returns Promise resolving to array of PKP info
     */
    async getOwnedWallets(): Promise<PkpInfo[]> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.getPkps();
        } catch (error) {
            throw new Error(
                `Failed to get owned wallets: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get information about a specific PKP
     * @param tokenId The token ID of the PKP
     * @returns Promise resolving to PKP info
     */
    async getWalletInfo(tokenId: string): Promise<PkpInfo> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.getPkpByTokenId(tokenId);
        } catch (error) {
            throw new Error(
                `Failed to get wallet info: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Clean up resources by disconnecting the Lit client
     */
    disconnect(): void {
        if (this.admin) {
            this.admin.disconnect();
        }
    }

    /**
     * Add a delegatee to an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @param delegateeAddress The Ethereum address of the delegatee
     */
    async addDelegatee(
        pkpTokenId: string,
        delegateeAddress: string
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.addDelegatee(pkpTokenId, delegateeAddress);
        } catch (error) {
            throw new Error(
                `Failed to add delegatee: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Remove a delegatee from an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @param delegateeAddress The Ethereum address of the delegatee
     */
    async removeDelegatee(
        pkpTokenId: string,
        delegateeAddress: string
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.removeDelegatee(pkpTokenId, delegateeAddress);
        } catch (error) {
            throw new Error(
                `Failed to remove delegatee: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get all delegatees for an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @returns Array of delegatee addresses
     */
    async getDelegatees(pkpTokenId: string): Promise<string[]> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.getDelegatees(pkpTokenId);
        } catch (error) {
            throw new Error(
                `Failed to get delegatees: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Check if an address is a delegatee for an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @param delegateeAddress The Ethereum address to check
     * @returns Boolean indicating if the address is a delegatee
     */
    async isDelegatee(
        pkpTokenId: string,
        delegateeAddress: string
    ): Promise<boolean> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.isDelegatee(pkpTokenId, delegateeAddress);
        } catch (error) {
            throw new Error(
                `Failed to check delegatee status: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Register a tool for use with an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     * @param options Optional configuration for tool registration
     */
    async registerTool(
        pkpTokenId: string,
        toolIpfsCid: string,
        options?: {
            signingScopes?: AUTH_METHOD_SCOPE_VALUES[];
            enableTools?: boolean;
        }
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.registerTool(pkpTokenId, toolIpfsCid, options);
        } catch (error) {
            throw new Error(
                `Failed to register tool: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Remove a tool from an Agent Wallet
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     */
    async removeTool(pkpTokenId: string, toolIpfsCid: string): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.removeTool(pkpTokenId, toolIpfsCid);
        } catch (error) {
            throw new Error(
                `Failed to remove tool: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Enable a registered tool
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     */
    async enableTool(pkpTokenId: string, toolIpfsCid: string): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.enableTool(pkpTokenId, toolIpfsCid);
        } catch (error) {
            throw new Error(
                `Failed to enable tool: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Disable a registered tool
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     */
    async disableTool(pkpTokenId: string, toolIpfsCid: string): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.disableTool(pkpTokenId, toolIpfsCid);
        } catch (error) {
            throw new Error(
                `Failed to disable tool: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Check if a tool is registered
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     * @returns Object containing registration and enabled status
     */
    async isToolRegistered(
        pkpTokenId: string,
        toolIpfsCid: string
    ): Promise<{ isRegistered: boolean; isEnabled: boolean }> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.isToolRegistered(pkpTokenId, toolIpfsCid);
        } catch (error) {
            throw new Error(
                `Failed to check tool registration: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get information about a registered tool
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     */
    async getRegisteredTool(
        pkpTokenId: string,
        toolIpfsCid: string
    ): Promise<any> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.getRegisteredTool(pkpTokenId, toolIpfsCid);
        } catch (error) {
            throw new Error(
                `Failed to get tool info: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Get all registered tools and their delegatees
     * @param pkpTokenId The token ID of the PKP
     */
    async getRegisteredToolsAndDelegatees(pkpTokenId: string): Promise<any> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.getRegisteredToolsAndDelegateesForPkp(
                pkpTokenId
            );
        } catch (error) {
            throw new Error(
                `Failed to get tools and delegatees: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Permit a tool for a specific delegatee
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     * @param delegatee The address of the delegatee
     */
    async permitToolForDelegatee(
        pkpTokenId: string,
        toolIpfsCid: string,
        delegatee: string
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.permitToolForDelegatee(
                pkpTokenId,
                toolIpfsCid,
                delegatee
            );
        } catch (error) {
            throw new Error(
                `Failed to permit tool for delegatee: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Unpermit a tool for a specific delegatee
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     * @param delegatee The address of the delegatee
     */
    async unpermitToolForDelegatee(
        pkpTokenId: string,
        toolIpfsCid: string,
        delegatee: string
    ): Promise<void> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            await this.admin.unpermitToolForDelegatee(
                pkpTokenId,
                toolIpfsCid,
                delegatee
            );
        } catch (error) {
            throw new Error(
                `Failed to unpermit tool for delegatee: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }

    /**
     * Check if a tool is permitted for a specific delegatee
     * @param pkpTokenId The token ID of the PKP
     * @param toolIpfsCid The IPFS CID of the tool
     * @param delegatee The address of the delegatee
     */
    async isToolPermittedForDelegatee(
        pkpTokenId: string,
        toolIpfsCid: string,
        delegatee: string
    ): Promise<{ isPermitted: boolean; isEnabled: boolean }> {
        if (!this.admin) {
            throw new Error(
                "Lit Admin not initialized. Call initialize() first."
            );
        }

        try {
            return await this.admin.isToolPermittedForDelegatee(
                pkpTokenId,
                toolIpfsCid,
                delegatee
            );
        } catch (error) {
            throw new Error(
                `Failed to check tool permission: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }
}
