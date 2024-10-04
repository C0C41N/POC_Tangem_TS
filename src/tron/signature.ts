import { Buffer } from 'node:buffer'

import { ec as EC } from 'elliptic'

import { uncompressPublicKey } from './address'

const secp256k1 = new EC('secp256k1')

function extractRS(signatureHex64: string) {

  const r = signatureHex64.slice(0, 64)
  const s = signatureHex64.slice(64)

  const hex = { r, s }
  const buffer = { r: Buffer.from(r, 'hex'), s: Buffer.from(s, 'hex') }

  return { buffer, hex }

}

export function signatureHex64To65(signatureHex64: string, trxId: string, publicKeyBase58: string) {

  const { r, s } = extractRS(signatureHex64).buffer

  const publicKeyHex = uncompressPublicKey(publicKeyBase58).toString('hex')

  const trxIdBuffer = Buffer.from(trxId, 'hex')

  for (const v of [27, 28]) {

    try {

      const recoveredKey = secp256k1.recoverPubKey(trxIdBuffer, { r, s }, v - 27)
      const recoveredPublicKey = recoveredKey.encode('hex', false)

      if (recoveredPublicKey === publicKeyHex)
        return Buffer.concat([r, s, Buffer.from([v])]).toString('hex')

    }
    catch (err) { // eslint-disable-line unused-imports/no-unused-vars

      // ignore

    }

  }

  throw new Error('Failed to recover public key')

}
