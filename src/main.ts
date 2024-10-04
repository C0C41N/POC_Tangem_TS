import { TronWeb } from 'tronweb'

import { publicKeyToAddress } from './address'
import { prompt } from './utils/prompt'

const tronWeb = new TronWeb({ fullHost: 'https://nile.trongrid.io', privateKey: '' })

async function createTransaction(fromAddress: string, toAddress: string, amount: number) {

  try {

    const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, +tronWeb.toSun(amount), fromAddress)
    const extendedTransaction = await tronWeb.transactionBuilder.extendExpiration(transaction, 600)

    console.log(extendedTransaction) // eslint-disable-line no-console

    return extendedTransaction

  }
  catch (err) {

    console.error('Error creating transaction:', err)
    return null

  }

}

async function signAndBroadcastTransaction(rawTx: any, signedHex: any) {

  try {

    rawTx.signature = [signedHex]
    const broadcast = await tronWeb.trx.sendRawTransaction(rawTx)

    console.log('Broadcast result:', broadcast) // eslint-disable-line no-console

    return broadcast

  }
  catch (err) {

    console.error('Error broadcasting transaction:', err)
    return null

  }

}

async function main() {

  const amount = 1 // Amount in TRX

  const fromPublicKey = '261tNC22med7Yn6pxp5iKfxUF231KXVtfjEYmsPbWqGjx'

  const fromAddress = publicKeyToAddress(fromPublicKey)
  const toAddress = 'TMgJvQaXEPRjCbinHNeGogZLFGSjLpydjp'

  const transaction = await createTransaction(fromAddress, toAddress, amount)

  const signedHex = await prompt('Enter signed hex: ')

  await signAndBroadcastTransaction(transaction, signedHex)

}

main()
