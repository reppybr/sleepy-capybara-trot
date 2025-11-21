import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { connection } from './solana'; // Re-using existing connection
import idl from '../idl.json'; // The IDL we just created
import dotenv from 'dotenv';

dotenv.config();

const programId = new PublicKey(process.env.ANCHOR_PROGRAM_ID!);

if (!process.env.BACKEND_PRIVATE_KEY) {
  throw new Error('BACKEND_PRIVATE_KEY is not set in the environment variables.');
}
if (!process.env.ANCHOR_PROGRAM_ID) {
  throw new Error('ANCHOR_PROGRAM_ID is not set in the environment variables.');
}

// Load the backend's wallet from the private key
const secret = JSON.parse(process.env.BACKEND_PRIVATE_KEY) as number[];
const secretKey = Uint8Array.from(secret);
const backendKeypair = Keypair.fromSecretKey(secretKey);
const wallet = new Wallet(backendKeypair);

// Create the Anchor provider
const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: 'processed',
  commitment: 'confirmed',
});

// Create the program instance
const program = new Program(idl as any, programId, provider);

export { provider, program, backendKeypair };