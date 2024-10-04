import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import bs58 from 'bs58'
import { ec as EC } from 'elliptic'
import keccak from 'keccak'

const secp256k1 = new EC('secp256k1')

export function decompressPublicKey(base58PublicKey: string) {

  const compressedPubKeyBuffer = Buffer.from(bs58.decode(base58PublicKey))

  const key = secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array')
  const decompressedPubKeyArray = key.getPublic(false, 'array')
  const decompressedPubKeyBuffer = Buffer.from(decompressedPubKeyArray)

  return decompressedPubKeyBuffer

}

export function publicKeyToAddress(base58PublicKey: string) {

  const decompressedPubKeyBuffer = decompressPublicKey(base58PublicKey)
  const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1)

  const keccakHash = keccak('keccak256').update(decompressedPubKeyBufferDropFirst).digest()

  const addressPayload = Buffer.concat([Buffer.from([0x41]), keccakHash.subarray(-20)]) // 0x41 prefix

  const checksum = createHash('sha256').update(addressPayload).digest()
  const checksumFinal = createHash('sha256').update(checksum).digest().subarray(0, 4)

  const finalAddress = Buffer.concat([addressPayload, checksumFinal])

  return bs58.encode(finalAddress)

}
