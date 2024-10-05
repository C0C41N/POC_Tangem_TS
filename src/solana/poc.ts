import { Buffer } from 'node:buffer'

import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

import { prompt } from '../utils/prompt'

export async function pocSolana() {

  await createAndSendTransaction()

}

async function createAndSendTransaction() {

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  const senderPublicKey = new PublicKey('EPFHi2vvpVeuuZU3TDXYxFfwEGxZhceL1h2tmia6wLgh')
  const receiverPublicKey = new PublicKey('96fuzKSqE7tCYY3sm6SxfujhrRy5JpN3gkQqAWnsB8mm')

  const amount = LAMPORTS_PER_SOL * 0.00001

  const transaction = new Transaction().add(SystemProgram.transfer({
    fromPubkey: senderPublicKey,
    lamports: amount,
    toPubkey: receiverPublicKey,
  }))

  const { blockhash } = await connection.getLatestBlockhash()

  transaction.recentBlockhash = blockhash
  transaction.feePayer = senderPublicKey

  const serializedTransaction = transaction.serializeMessage()
  const transactionHex = serializedTransaction.toString('hex')

  console.log('Transaction hex:', transactionHex) // eslint-disable-line no-console

  const signedHex = await prompt('Enter signed hex: ')

  const signature = Buffer.from(signedHex, 'hex')

  transaction.addSignature(senderPublicKey, signature)

  const rawTransaction = transaction.serialize()

  const txId = await connection.sendRawTransaction(rawTransaction)
  console.log('Transaction sent, ID:', txId) // eslint-disable-line no-console

}
