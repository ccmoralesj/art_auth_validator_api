import { GoogleAuth } from 'google-auth-library'
import { getGoogleCredentialsJSON } from "../../helpers/googleCredentials.js"
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth.js'

export async function generateGoogleClient (): Promise<GoogleAuth<JSONClient>> {
  const googleCredentialsJSON = await getGoogleCredentialsJSON()
  const googleJSONClient = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/drive'],
    credentials: googleCredentialsJSON
  })
  return googleJSONClient
}
