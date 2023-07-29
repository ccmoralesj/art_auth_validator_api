import { google } from 'googleapis';
import { generateGoogleClient } from './index.js';
import { logger } from '../../logger/logger.js';
import internal from 'stream';

export async function generatePDF(fileId: string) {
  const googleClient = await generateGoogleClient()
  // @ts-ignore
  const googleDrive = google.drive({ version: 'v3', auth: googleClient })
  try {
    const finalFile = await googleDrive.files.export(
      {
        fileId,
        mimeType: "application/pdf",
      },
      { responseType: "stream" }
    )
    logger.info({ resData: finalFile })
    // logger.info({ resData: finalFile.data })
    logger.info({ resStatus: finalFile.status })
    return finalFile.data
    // return Buffer.from(res.data as ArrayBuffer).toString("base64")
  } catch (error) {
    logger.error('Soemthing happened exporting the PDF')
    logger.error(error)
  }
}