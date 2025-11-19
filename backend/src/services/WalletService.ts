import { Keypair } from '@solana/web3.js';
import { encrypt } from './EncryptionService';

export const createSolanaWallet = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  
  // The secret key is a Uint8Array of 64 bytes. We need to store it as a string.
  const secretKeyString = Buffer.from(keypair.secretKey).toString('base64');
  
  const encryptedSecretKey = encrypt(secretKeyString);

  return {
    publicKey,
    encryptedSecretKey,
  };
};