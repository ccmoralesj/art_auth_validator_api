import { JWTInput } from 'google-auth-library'
import contractJSON from '../../public/contractapp-394202.json' assert { type: "json" }

export async function getGoogleCredentialsJSON (): Promise<JWTInput> {
  return contractJSON
}
