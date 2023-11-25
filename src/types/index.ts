export type AuthenticityCertificate = {
  title: string
  series: string
  creationYear: number
  dimensions: string
  limitedEdition: string
  creationDate: string
  createdAt?: string
}

export type createValidationPhraseParams = {
  certificateData: AuthenticityCertificate,
  secret: string
}

export type checkValidationPhraseParams = {
  pin: string,
  secret: string
}

export type EndpointObject = Array<string>

export type AccessToken = {
  createdAt?: string,
  name: string,
  key: string,
  endpoints: EndpointObject,
}

export type RouteDeepStructure = { method: string, path: string, auth: boolean }
export type RouteStructure = { [key: string]: RouteDeepStructure }