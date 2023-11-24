export function stringToHexString(text: string) {
  const bufferText = Buffer.from(text, 'utf8');
  return bufferText.toString('hex');
}