import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import bs58 from 'bs58'
import { ec as EC } from 'elliptic'
import keccak from 'keccak'

const secp256k1 = new EC('secp256k1')

export function uncompressPublicKey(base58PublicKey: string) {

  const compressedPubKeyBuffer = Buffer.from(bs58.decode(base58PublicKey))

  const key = secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array')
  const uncompressedPubKeyArray = key.getPublic(false, 'array')
  const uncompressedPubKeyBuffer = Buffer.from(uncompressedPubKeyArray)

  return uncompressedPubKeyBuffer

}

export function publicKeyToAddress(base58PublicKey: string) {

  const uncompressedPubKeyBuffer = uncompressPublicKey(base58PublicKey)
  const uncompressedPubKeyBufferDropFirst = uncompressedPubKeyBuffer.subarray(1)

  const keccakHash = keccak('keccak256').update(uncompressedPubKeyBufferDropFirst).digest()

  const addressPayload = Buffer.concat([Buffer.from([0x41]), keccakHash.subarray(-20)]) // 0x41 prefix

  const checksum = createHash('sha256').update(addressPayload).digest()
  const checksumFinal = createHash('sha256').update(checksum).digest().subarray(0, 4)

  const finalAddress = Buffer.concat([addressPayload, checksumFinal])

  return bs58.encode(finalAddress)

}
