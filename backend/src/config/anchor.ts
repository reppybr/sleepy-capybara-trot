import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { connection } from './solana';
import idl from '../idl.json';
import dotenv from 'dotenv';
import * as bip39 from 'bip39';

dotenv.config();

const programId = new PublicKey(process.env.ANCHOR_PROGRAM_ID!);

if (!process.env.BACKEND_PRIVATE_KEY) {
  throw new Error('BACKEND_PRIVATE_KEY is not set in the environment variables.');
}
if (!process.env.ANCHOR_PROGRAM_ID) {
  throw new Error('ANCHOR_PROGRAM_ID is not set in the environment variables.');
}

// Load the backend's wallet from the mnemonic phrase in the environment variable.
// The previous implementation attempted to JSON.parse this value, which failed.
// This new implementation correctly handles a mnemonic phrase.
const mnemonic = process.env.BACKEND_PRIVATE_KEY;

if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('BACKEND_PRIVATE_KEY is not a valid mnemonic phrase.');
}

const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // The second argument is the passphrase, often empty
const backendKeypair = Keypair.fromSeed(seed.slice(0, 32)); // Use the first 32 bytes of the seed for the keypair

const wallet = new Wallet(backendKeypair);

// Create the Anchor provider
const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: 'processed',
  commitment: 'confirmed',
});

// Create the program instance
const program = new Program(idl as any, programId, provider);

export { provider, program, backendKeypair };