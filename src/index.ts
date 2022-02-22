import { AccountInfo, clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import Dotenv from 'dotenv';
import fetch from 'node-fetch';

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

// If you don't already have a private key in your env file, you can add an existing one 
// or generate a new one using `const ownerKeypair = Keypair.generate()`
// Once you have a keypair you can log the secret key to the console `ownerKeypair.secretkey` 
// You can copy this array from the console and paste it into your `.env` file as a string
// that you can then parse into an array
const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
const secretKey = Uint8Array.from(secret)
const owner = Keypair.fromSecretKey(secretKey)

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
