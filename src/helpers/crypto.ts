import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { PIN_CONDE_LENGTH, VALIDATION_PHRASE_TAG_BASE } from './consts/index.js';
import { checkValidationPhraseParams, createValidationPhraseParams } from '../types/index.js';
import { logger } from '../logger/logger.js';
import { findCertificateBySecret } from '../schemas/Certificates.js';

const { JWT_SECRET } = process.env
const { createHmac } = crypto

export function convertToBase64URISecure(text: string) {
  const buff = Buffer.from(text)
  return buff.toString('base64url')
}

export function convertFromBase64URISecure(text: string) {
  const buff = Buffer.from(text, 'base64url')
  return buff.toString('ascii')
}

export function createUUID() {
  return crypto.randomUUID()
}

export function createValidationPrhase(
  {
    certificateData,
    secret,
  }: createValidationPhraseParams
) {
  const artCertificateHash = createHmac('sha256', secret) 
                              .update(JSON.stringify(certificateData)) 
                              .digest('hex');
  const createPINHalf = artCertificateHash.substring(artCertificateHash.length - PIN_CONDE_LENGTH)
  
  const base64PIN = convertToBase64URISecure(createPINHalf)
  const pinHashHalf = createHmac('sha256', secret) 
                              .update(base64PIN) 
                              .digest('hex');

  const createPIN2Half = pinHashHalf.substring(pinHashHalf.length - PIN_CONDE_LENGTH)
  const pinToArt = convertToBase64URISecure(`${createPINHalf}${createPIN2Half}`)

  const pinHashFinal = createHmac('sha256', secret) 
                              .update(pinToArt) 
                              .digest('hex');

  const validationPhrase = `${VALIDATION_PHRASE_TAG_BASE}.${artCertificateHash}.${pinHashHalf}.${pinHashFinal}`

  logger.info({
    pinToArt,
    basicPIN: createPINHalf,
    pinHash: pinHashHalf,
    validationPhrase
  })
  return {
    validationPhrase,
    pinToArt
  }
}

export async function checkValidationPrhase(
  {
    pin,
    secret,
  }: checkValidationPhraseParams
) {
  // Find Certificate in DB
  const certificate = await findCertificateBySecret(secret)
  if (!certificate) {
    return false
  }
  const certificateValidationPhrase = certificate.hash
  const certificateValidationPhraseParts = certificateValidationPhrase.split('.')
  const certificatepinHashFinal = certificateValidationPhraseParts.pop()
  const certificatePinHashHalf = certificateValidationPhraseParts.pop()
  const certificatePinHash = certificateValidationPhraseParts.pop()

  const createPINHalf = certificatePinHash.substring(certificatePinHash.length - PIN_CONDE_LENGTH)
  const createPIN2Half = certificatePinHashHalf.substring(certificatePinHashHalf.length - PIN_CONDE_LENGTH)

  const pinGeneratedFromHash = convertToBase64URISecure(`${createPINHalf}${createPIN2Half}`)
  
  if (pin !== pinGeneratedFromHash) {
    return false
  }

  const comparePinHashFinal = createHmac('sha256', secret) 
                        .update(pinGeneratedFromHash) 
                        .digest('hex');
  logger.info({ certificatePinHash: certificatepinHashFinal, comparePinHash: comparePinHashFinal })
  return comparePinHashFinal === certificatepinHashFinal
}

export function createAutoHubJWT (entityName: string) {
  const today = new Date()
  const inAMonth = today.setDate(today.getDate() + 30)
  const standardInfo = {
    issuer: 'art-auth-validator-api',
    issuedAt: new Date(),
    expiration: new Date(inAMonth),
    entity: 'api',
    entityName
  }

  return jwt.sign(standardInfo, JWT_SECRET)
}