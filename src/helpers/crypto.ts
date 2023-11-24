import crypto from 'crypto'
import { VALIDATION_PHRASE_TAG_BASE } from './consts/index.js';
import { checkValidationPhraseParams, createValidationPhraseParams } from '../types/index.js';
import { logger } from '../logger/logger.js';

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

export function checkValidationPrhase(
  {
    pin,
    secret,
  }: checkValidationPhraseParams
) {
  // TODO Search secret in the DB
  // Extract validationPrashe
  const myvalidationPhraseExample= 'CM.d1bd7ee7c26a76a71274766c6003211732a29ebdbdbf2bbb927d0863cd9413cf.b0e9ffcf04136d38629714597008d4ae4e571a33133ab2efbe3996203e753fdf'
  const dbPinHash = myvalidationPhraseExample.split('.').pop()
  
  logger.info({ dbPinHash })

  const comparePinHash = createHmac('sha256', secret) 
                              .update(pin) 
                              .digest('hex'); 

  logger.info({ comparePinHash })
  return comparePinHash === dbPinHash
}