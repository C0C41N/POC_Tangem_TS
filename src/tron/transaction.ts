import { TronWeb } from 'tronweb'

const tronWeb = new TronWeb({ fullHost: 'https://nile.trongrid.io', privateKey: '' })

export async function createTransaction(fromAddress: string, toAddress: string, amount: number) {

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

export async function signAndBroadcastTransaction(rawTx: any, signedHex: any) {

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
