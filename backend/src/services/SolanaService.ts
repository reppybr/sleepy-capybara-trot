import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { program } from '../config/anchor';

class SolanaService {
  /**
   * Creates a new batch on the Solana blockchain.
   * @param batchKeypair - The new account for the batch.
   * @param brandOwnerKeypair - The keypair of the brand owner, who must sign.
   * @param id - The off-chain generated ID for the batch.
   * @param producerName - The name of the producer.
   * @param brandId - The UUID of the brand from Supabase.
   * @param initialHolderKey - The public key of the initial holder.
   * @returns The transaction signature.
   */
  async createBatchOnChain(
    batchKeypair: Keypair,
    brandOwnerKeypair: Keypair,
    id: string,
    producerName: string,
    brandId: string,
    initialHolderKey: PublicKey
  ): Promise<string> {
    const tx = await program.methods
      .createBatch(id, producerName, brandId, initialHolderKey)
      .accounts({
        batch: batchKeypair.publicKey,
        brandOwner: brandOwnerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([batchKeypair, brandOwnerKeypair]) // New account and instruction authority
      .rpc();
    
    return tx;
  }

  /**
   * Adds a new stage to an existing batch on-chain.
   * @param batch - The public key of the batch account.
   * @param currentHolderKeypair - The keypair of the current holder, who must sign.
   * @param stageName - The name of the stage.
   * @param ipfsCid - The IPFS CID for stage metadata.
   * @param partnerType - The role of the partner adding the stage.
   * @returns The transaction signature.
   */
  async addStageOnChain(
    batch: PublicKey,
    currentHolderKeypair: Keypair,
    stageName: string,
    ipfsCid: string,
    partnerType: string
  ): Promise<string> {
    const tx = await program.methods
      .addStage(stageName, ipfsCid, partnerType)
      .accounts({
        batch: batch,
        currentHolder: currentHolderKeypair.publicKey,
      })
      .signers([currentHolderKeypair]) // Provider wallet pays fees
      .rpc();

    return tx;
  }

  /**
   * Transfers custody of a batch to a new holder.
   * @param batch - The public key of the batch account.
   * @param currentHolderKeypair - The keypair of the current holder, who must sign.
   * @param nextHolderKey - The public key of the new holder.
   * @returns The transaction signature.
   */
  async transferCustodyOnChain(
    batch: PublicKey,
    currentHolderKeypair: Keypair,
    nextHolderKey: PublicKey
  ): Promise<string> {
    const tx = await program.methods
      .transferCustody(nextHolderKey)
      .accounts({
        batch: batch,
        currentHolder: currentHolderKeypair.publicKey,
      })
      .signers([currentHolderKeypair])
      .rpc();

    return tx;
  }

  /**
   * Finalizes a batch, preventing further modifications.
   * @param batch - The public key of the batch account.
   * @param brandOwnerKeypair - The keypair of the brand owner, who must sign.
   * @returns The transaction signature.
   */
  async finalizeBatchOnChain(
    batch: PublicKey,
    brandOwnerKeypair: Keypair
  ): Promise<string> {
    const tx = await program.methods
      .finalizeBatch()
      .accounts({
        batch: batch,
        brandOwner: brandOwnerKeypair.publicKey,
      })
      .signers([brandOwnerKeypair])
      .rpc();

    return tx;
  }
}

export default new SolanaService();