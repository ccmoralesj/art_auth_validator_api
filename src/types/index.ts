export type AuthenticityCertificate = {
  title: string
  series: string
  creationYear: number
  dimensions: string
  limitedEdition: string
  creationDate: string
}

export type createValidationPhraseParams = {
  certificateData: AuthenticityCertificate,
  secret: string
}

export type checkValidationPhraseParams = {
  pin: string,
  secret: string
}