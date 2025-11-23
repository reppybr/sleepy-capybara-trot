import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { program, backendKeypair } from '../config/anchor';

class SolanaService {
  /**
   * Creates a new batch on the Solana blockchain.
   * The backend wallet now pays for the account rent and transaction fee directly.
   * The brand owner's wallet is only required to sign to prove authorization.
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
    const connection = program.provider.connection;

    // 1. Get the main instruction from Anchor
    const createBatchIx = await program.methods
      .createBatch(id, producerName, brandId, initialHolderKey)
      .accounts({
        batch: batchKeypair.publicKey,
        brandOwner: brandOwnerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    // 2. Get the rent required for the new batch account
    const rent = await connection.getMinimumBalanceForRentExemption(program.account.batch.size);

    // 3. Create the instruction to create the account, with the BACKEND as the payer
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: backendKeypair.publicKey, // SERVER PAYS FOR RENT
      newAccountPubkey: batchKeypair.publicKey,
      lamports: rent,
      space: program.account.batch.size,
      programId: program.programId,
    });

    // 4. Build the transaction with both instructions
    const transaction = new Transaction().add(createAccountIx, createBatchIx);

    // 5. Send and confirm the transaction.
    // Signers:
    // - backendKeypair: Pays for rent and transaction fee.
    // - batchKeypair: Authorizes the creation of its own account.
    // - brandOwnerKeypair: Authorizes the action as required by the on-chain program.
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      backendKeypair,
      batchKeypair,
      brandOwnerKeypair,
    ]);
    
    return signature;
  }

  /**
   * Adds a new stage to an existing batch on-chain.
   * The transaction fee is paid by the backend wallet.
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
    // No rent needed, backend wallet pays the small transaction fee.
    const tx = await program.methods
      .addStage(stageName, ipfsCid, partnerType)
      .accounts({
        batch: batch,
        currentHolder: currentHolderKeypair.publicKey,
      })
      .signers([currentHolderKeypair])
      .rpc();

    return tx;
  }

  /**
   * Transfers custody of a batch to a new holder.
   * The transaction fee is paid by the backend wallet.
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
    // No rent needed, backend wallet pays the small transaction fee.
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
   * The transaction fee is paid by the backend wallet.
   * @param batch - The public key of the batch account.
   * @param brandOwnerKeypair - The keypair of the brand owner, who must sign.
   * @returns The transaction signature.
   */
  async finalizeBatchOnChain(
    batch: PublicKey,
    brandOwnerKeypair: Keypair
  ): Promise<string> {
    // No rent needed, backend wallet pays the small transaction fee.
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