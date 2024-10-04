import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import bs58 from 'bs58'
import { ec as EC } from 'elliptic'
import keccak from 'keccak'

const ec = new EC('secp256k1')

export function publicKeyToAddress(base58PublicKey: string) {

  const compressedPubKeyBuffer = Buffer.from(bs58.decode(base58PublicKey))

  const key = ec.keyFromPublic(compressedPubKeyBuffer, 'array')
  const uncompressedPubKeyArray = key.getPublic(false, 'array') // 'false' for uncompressed
  const uncompressedPubKeyBuffer = Buffer.from(uncompressedPubKeyArray.slice(1)) // Remove the first byte

  const keccakHash = keccak('keccak256').update(uncompressedPubKeyBuffer).digest()

  const addressPayload = Buffer.concat([Buffer.from([0x41]), keccakHash.subarray(-20)]) // 0x41 prefix

  const checksum = createHash('sha256').update(addressPayload).digest()
  const checksumFinal = createHash('sha256').update(checksum).digest().subarray(0, 4)

  const finalAddress = Buffer.concat([addressPayload, checksumFinal])

  return bs58.encode(finalAddress)

}
