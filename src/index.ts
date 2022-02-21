import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransferParams } from '@solana/web3.js';
import Dotenv from 'dotenv';

Dotenv.config();

// If you don't already have a private key in your env file, you can add an existing one 
// or generate a new one using `const ownerKeypair = Keypair.generate()`
// Once you have a keypair you can log the secret key to the console `ownerKeypair.secretkey` 
// You can copy this array from the console and paste it into your `.env` file as a string
// that you can then parse into an array
const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]

const secretKey = Uint8Array.from(secret)
const ownerKeypair = Keypair.fromSecretKey(secretKey)
console.log(ownerKeypair.secretKey);
const repicientPubkey = new PublicKey('BpnBxp5KvnupqYVutjYwyhmQi7wQrU5xZXXGRgZcKDSj')
const transaction = new Transaction();

transaction.add(
    SystemProgram.transfer({
        fromPubkey: ownerKeypair.publicKey,
        toPubkey: repicientPubkey,
        lamports: LAMPORTS_PER_SOL * 0.1
    })
)

const connection = new Connection(clusterApiUrl('devnet'));

sendAndConfirmTransaction(
    connection,
    transaction,
    [ownerKeypair]
).then((signature) => {
    // When a transaction succeeds it returns the transaction signature
    // You can view all transactions with the Solana Explorer
    console.log(`TRANSACTION SUCCEEDED! Go to https://explorer.solana.com/tx/${signature}?cluster=devnet to see the transaction details.`);
}).catch((error) => {
    // Your transaction will probably fail if this is your first time since you have no SOL
    // You can get test SOL for devnet at https://solanatools.xyz/faucet/devnet.html
    // You'll need to provide your base58 address, which you can get by logging 
    // `ownerKeypair.publicKey.toBase58()` to the console
    console.log('TRANSACTION FAILED:', error);
})
