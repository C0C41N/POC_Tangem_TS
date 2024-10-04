import { prompt } from '../utils/prompt'

import { publicKeyToAddress } from './address'
import { signatureHex64To65 } from './signature'
import { createTransaction, signAndBroadcastTransaction } from './transaction'

export async function pocTron() {

  const amount = 1 // Amount in TRX
  const fromPublicKey = '261tNC22med7Yn6pxp5iKfxUF231KXVtfjEYmsPbWqGjx' // tangem secp256k1 public key

  const fromAddress = publicKeyToAddress(fromPublicKey)
  const toAddress = 'TMgJvQaXEPRjCbinHNeGogZLFGSjLpydjp' // TronLink wallet address

  const transaction = await createTransaction(fromAddress, toAddress, amount)

  const signedHex64 = await prompt('Enter signed hex: ')
  const signedHex65 = signatureHex64To65(signedHex64, transaction.txID, fromPublicKey)

  await signAndBroadcastTransaction(transaction, signedHex65)

}
