import { Context, Next } from 'koa';
import Router from 'koa-router';
import { SECRET_TAG_BASE } from '../../helpers/consts/index.js';
import { stringToHexString } from '../../helpers/stringToHex.js';
import { randomIntFromInterval } from '../../helpers/randomNumberBetween.js';
import { generateQR, generateQRFileName } from '../../services/QRgenerator/index.js';
import { checkValidationPrhase, createUUID, createValidationPrhase } from '../../helpers/crypto.js';
import { AuthenticityCertificate, checkValidationPhraseParams } from '../../types/index.js';
import { logger } from '../../logger/logger.js';
import { testingDB } from '../../services/supabase/connection.js';

const router = new Router();
const ROUTE_BASE = '/validators'

router.get(`${ROUTE_BASE}`, async (ctx: Context, _next: Next) => {
  await testingDB()
  ctx.body = {
    msg: 'Hello Koa from validators'
  };
});

router.get(`${ROUTE_BASE}/generate-qr`, async (ctx: Context, _next: Next) => {
  const randomNumber = randomIntFromInterval(10000,99999)
  const secret = `${stringToHexString(SECRET_TAG_BASE)}-${createUUID()}`
  logger.info({ secret })
  const QRGenerated = await generateQR(secret)
  const QRCodeName = generateQRFileName()
  ctx.response.set("content-type", 'image/svg+xml');
  ctx.response.set('Content-disposition', `filename=${QRCodeName}`)
  ctx.body = QRGenerated
});

router.post(`${ROUTE_BASE}/generate-validator`, (ctx: Context, _next: Next) => {
  const { secret } = ctx.query
  if (typeof secret !== 'string') {
    // TODO Better error handling
    return ctx.body = {
      msg: 'secret must be just one string'
    }
  }
  // const { certificateData } = ctx.body
  const certificateData: AuthenticityCertificate = {
    title: 'Trazos de Luz',
    series: '1/6',
    creationYear: 2023,
    dimensions: ' A2 (60cmx42cm)',
    limitedEdition: 'YES',
    creationDate: '11/23/2023',
  }
  const validationPhrase = createValidationPrhase({
    certificateData,
    secret
  })
  ctx.body = {
    validationPhrase
  };
});

router.post(`${ROUTE_BASE}/check-authenticity`, (ctx: Context, _next: Next) => {
  const { secret, pin } = ctx.request.body as checkValidationPhraseParams

  const isAuthentic = checkValidationPrhase({ secret, pin })
  const validationResponse = isAuthentic ? '✅ VALID ✅' : '❌ WRONG ❌'  
  ctx.body = {
    msg: `${validationResponse} Certificate of Authenticity`
  };
});

export default router;