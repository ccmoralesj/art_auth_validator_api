const QR_SIZE = 250
const QR_FORMAT= 'svg'
export const QR_GENERATOR_API_URL = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&format=${QR_FORMAT}&data=`