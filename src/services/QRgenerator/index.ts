import { makeRequestRaw } from "../../helpers/fecthRequest.js";
import { randomIntFromInterval } from "../../helpers/randomNumberBetween.js";
import { logger } from "../../logger/logger.js";
import { QR_GENERATOR_API_URL } from "./consts.js";

export function generateQRFileName() {
  const now = new Date();
  const stringDateFormat = `${
    now.getMonth() + 1
  }-${now.getDate()}-${now.getFullYear()}`;
  const stringDateTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  return `generated-qr-${randomIntFromInterval(
    100,
    999
  )}-${stringDateFormat}-${stringDateTime}`;
}

export async function generateQR(secret: string) {
  const DOMAIN_URI_REDIRECT = process.env.FRONTEND_URI;
  logger.info({ DOMAIN_URI_REDIRECT });
  const secretEncoded = encodeURI(secret);
  const queryTo = `${DOMAIN_URI_REDIRECT}/validate-form/?secret=${secretEncoded}`;
  const QRCodeURL = `${QR_GENERATOR_API_URL}${queryTo}`;
  const QRCOde = await makeRequestRaw("GET", QRCodeURL, {
    headers: {
      "Content-Type": "image/png",
    },
  });
  return QRCOde;
}
