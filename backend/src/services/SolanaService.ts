import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { program, backendKeypair } from '../config/anchor';

class SolanaService {
  /**
   * Ensures an account has a minimum balance, funding it from the backend wallet if necessary.
   * @param publicKey - The public key of the account to check.
   * @param requiredLamports - The minimum number of lamports the account should have.
   */
  private async ensureAccountIsFunded(publicKey: PublicKey, requiredLamports: number): Promise<void> {
    const connection = program.provider.connection;
    const balance = await connection.getBalance(publicKey);

    if (balance < requiredLamports) {
      const amountToFund = requiredLamports - balance;
      console.log(`Account ${publicKey.toBase58()} has insufficient balance (${balance} lamports). Funding with ${amountToFund} lamports...`);
      
      const fundingTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: backendKeypair.publicKey,
          toPubkey: publicKey,
          lamports: amountToFund,
        })
      );
      
      await sendAndConfirmTransaction(connection, fundingTx, [backendKeypair]);
      console.log(`Successfully funded account ${publicKey.toBase58()}.`);
    }
  }

  /**
   * Creates a new batch on the Solana blockchain.
   * The brand owner's account is funded by the backend if it lacks SOL for rent.
   * The transaction fee is paid by the backend wallet.
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
    const rent = await connection.getMinimumBalanceForRentExemption(program.account.batch.size);
    
    // The brand owner account needs to pay for the new batch account's rent.
    // We ensure it has enough funds, plus a small buffer.
    await this.ensureAccountIsFunded(brandOwnerKeypair.publicKey, rent + 10000);

    const tx = await program.methods
      .createBatch(id, producerName, brandId, initialHolderKey)
      .accounts({
        batch: batchKeypair.publicKey,
        brandOwner: brandOwnerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([batchKeypair, brandOwnerKeypair])
      .rpc();
    
    return tx;
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
    // Ensure the signer account is not empty to avoid potential RPC issues.
    await this.ensureAccountIsFunded(currentHolderKeypair.publicKey, 10000);

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
    // Ensure the signer account is not empty.
    await this.ensureAccountIsFunded(currentHolderKeypair.publicKey, 10000);

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
    // Ensure the signer account is not empty.
    await this.ensureAccountIsFunded(brandOwnerKeypair.publicKey, 10000);

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