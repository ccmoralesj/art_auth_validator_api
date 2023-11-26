import { Context, Next } from 'koa';
import Router from 'koa-router';
import { SECRET_TAG_BASE } from '../../helpers/consts/index.js';
import { stringToHexString } from '../../helpers/stringToHex.js';
import { generateQR, generateQRFileName } from '../../services/QRgenerator/index.js';
import { checkValidationPrhase, createUUID, createValidationPrhase } from '../../helpers/crypto.js';
import { AuthenticityCertificate, RouteStructure, checkValidationPhraseParams } from '../../types/index.js';
import { logger } from '../../logger/logger.js';
import { createCertificate, testingDB } from '../../schemas/Certificates.js';

const router = new Router();
const ROUTE_BASE = '/validators'

export const allRoutes: RouteStructure  = {
  [ROUTE_BASE]: {
    path: ROUTE_BASE,
    method: 'GET',
    auth: false
  },
  [`${ROUTE_BASE}/generate-qr`]: {
    path: `${ROUTE_BASE}/generate-qr`,
    method: 'GET',
    auth: true
  },
  [`${ROUTE_BASE}/generate-validator`]: {
    path: `${ROUTE_BASE}/generate-validator`,
    method: 'POST',
    auth: true
  },
  [`${ROUTE_BASE}/check-authenticity`]: {
    path: `${ROUTE_BASE}/check-authenticity`,
    method: 'POST',
    auth: false
  },
  [`${ROUTE_BASE}/validate-form`]: {
    path: `${ROUTE_BASE}/validate-form`,
    method: 'GET',
    auth: false
  }
}

router.get(`${ROUTE_BASE}`, async (ctx: Context, _next: Next) => {
  await testingDB()
  ctx.body = {
    msg: 'Hello Koa from validators'
  };
});

router.get(`${ROUTE_BASE}/generate-qr`, async (ctx: Context, _next: Next) => {
  const secret = `${stringToHexString(SECRET_TAG_BASE)}-${createUUID()}`
  logger.info({ secret })
  const QRGenerated = await generateQR(secret)
  const QRCodeName = generateQRFileName()
  ctx.response.set("content-type", 'image/svg+xml');
  ctx.response.set('Content-disposition', `filename=${QRCodeName}`)
  ctx.body = QRGenerated
});

router.post(`${ROUTE_BASE}/generate-validator`, async (ctx: Context, _next: Next) => {
  const { secret } = ctx.query
  if (typeof secret !== 'string') {
    ctx.response.status = 400
    ctx.response.message = 'secret must be just one string'
    return
  }
  const certificateData = ctx.request.body as AuthenticityCertificate
  const {
    validationPhrase,
    pinToArt
  } = createValidationPrhase({
    certificateData,
    secret
  })
  const newCertificate = await createCertificate({
    artInfo: certificateData,
    hash: validationPhrase,
    secret,
  })
  logger.info({ newCertificate })

  ctx.body = {
    ...newCertificate,
    pinToArt
  };
});

router.post(`${ROUTE_BASE}/check-authenticity`, async (ctx: Context, _next: Next) => {
  const { secret, pin } = ctx.request.body as checkValidationPhraseParams

  const isAuthentic = await checkValidationPrhase({ secret, pin })
  const validationResponse = isAuthentic ? '✅ VALID ✅' : '❌ WRONG ❌'  
  ctx.body = {
    msg: `${validationResponse} Certificate of Authenticity`
  };
});

export default router;