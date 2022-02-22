import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, AccountInfo } from '@solana/web3.js';
import Dotenv from 'dotenv';

Dotenv.config();

async function getBalanceUsingJSONRPC(address: PublicKey): Promise<number> {
    const url = clusterApiUrl('devnet')
    console.log(url);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": [
                address.toBase58()
            ]
        })
    }).then(response => response.json())
    .then(json => {
        if (json.error) {
            throw json.error
        }

        return json['result']['value'] as number;
    })
    .catch(error => {
        throw error
    })
}

async function getBalanceUsingWeb3(address: PublicKey): Promise<number> {
    const connection = new Connection(clusterApiUrl('devnet'));
    return connection.getBalance(address);
}

async function getAccountInfo(address: PublicKey): Promise<AccountInfo<Buffer> | null> {
    const connection = new Connection(clusterApiUrl('devnet'));
    return connection.getAccountInfo(address);
}

async function sendSol(origin: Keypair, recipient: PublicKey, amount: number) {
    // Create a new transaction
    const transaction = new Transaction();

    // Add SystemProgram.transfer instructions to transfer SOL
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: origin.publicKey,
            toPubkey: recipient,
            lamports: LAMPORTS_PER_SOL * amount
        })
    )

    const connection = new Connection(clusterApiUrl('devnet'));

    // Actually send the transaction
    return sendAndConfirmTransaction(
        connection,
        transaction,
        [origin]
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
}

// If you don't already have a private key in your env file, you can add an existing one 
// or generate a new one using `const ownerKeypair = Keypair.generate()`
// Once you have a keypair you can log the secret key to the console `ownerKeypair.secretkey` 
// You can copy this array from the console and paste it into your `.env` file as a string
// that you can then parse into an array
const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
const secretKey = Uint8Array.from(secret)
const owner = Keypair.fromSecretKey(secretKey)

// We're going to send some SOL to somebody (on devnet so it doesn't have any real value)
// You can find a random public address to put here, use this one, or generate a new one
const repicient = new PublicKey('BpnBxp5KvnupqYVutjYwyhmQi7wQrU5xZXXGRgZcKDSj')

getBalanceUsingJSONRPC(owner.publicKey).then(balance => {
    console.log(`The balance for address ${owner.publicKey} is ${JSON.stringify(balance)}`);
}).catch(error => {
    console.log(`Error getting balance for address ${owner.publicKey}. Error: ${JSON.stringify(error)}`)
})

getBalanceUsingWeb3(owner.publicKey).then(balance => {
    console.log(`The balance for address ${owner.publicKey} is ${JSON.stringify(balance)}`);
}).catch(error => {
    console.log(`Error getting balance for address ${owner.publicKey}. Error: ${JSON.stringify(error)}`)
})

getAccountInfo(owner.publicKey).then(info => {
    console.log(info);
})

sendSol(owner, repicient, 0.1);