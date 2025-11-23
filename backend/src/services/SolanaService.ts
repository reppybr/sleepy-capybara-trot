import { Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { program, backendKeypair } from '../config/anchor';

class SolanaService {
  /**
   * Creates a new batch on the Solana blockchain.
   * The backend wallet funds the brand owner's account for rent if needed,
   * and pays the transaction fee directly.
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
    
    const brandOwnerBalance = await connection.getBalance(brandOwnerKeypair.publicKey);

    // If the brand owner can't afford the rent, the backend funds them.
    if (brandOwnerBalance < rent) {
      const amountToFund = rent - brandOwnerBalance + 5000; // Add a small buffer for tx fees
      console.log(`Brand owner ${brandOwnerKeypair.publicKey.toBase58()} has insufficient balance for rent. Funding with ${amountToFund} lamports...`);
      
      const fundingTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: backendKeypair.publicKey,
          toPubkey: brandOwnerKeypair.publicKey,
          lamports: amountToFund,
        })
      );
      
      // The backend wallet pays for this funding transaction.
      await sendAndConfirmTransaction(connection, fundingTx, [backendKeypair]);
      console.log(`Successfully funded brand owner ${brandOwnerKeypair.publicKey.toBase58()}.`);
    }

    // Now, the brand owner has enough SOL to pay for the batch account's rent.
    // The backend wallet (provider's wallet) will pay the transaction fee for this call.
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