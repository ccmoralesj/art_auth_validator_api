import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { VALIDATION_PHRASE_TAG_BASE } from './consts/index.js';
import { checkValidationPhraseParams, createValidationPhraseParams } from '../types/index.js';
import { logger } from '../logger/logger.js';
import { findCertificateBySecret } from '../schemas/Certificates.js';

const { JWT_SECRET } = process.env
const { createHmac } = crypto

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
  const PIN = artCertificateHash.substr(artCertificateHash.length - 7)
  const pinHash = createHmac('sha256', secret) 
                              .update(PIN) 
                              .digest('hex'); 
  const validationPhrase = `${VALIDATION_PHRASE_TAG_BASE}.${artCertificateHash}.${pinHash}`
  // TODO Save all data in a DB
  logger.info({
    PIN,
    validationPhrase
  })
  return validationPhrase
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
  const certificatePinHash = certificateValidationPhrase.split('.').pop()
  
  logger.info({ certificatePinHash })

  const comparePinHash = createHmac('sha256', secret) 
                              .update(pin) 
                              .digest('hex'); 

  logger.info({ comparePinHash })
  return comparePinHash === certificatePinHash
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