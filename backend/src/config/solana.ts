import { Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const solanaRpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');

export const connection = new Connection(solanaRpcUrl, 'confirmed');

console.log('Attempting to connect to Solana devnet...');