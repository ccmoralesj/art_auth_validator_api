import fetch, { RequestInit } from 'node-fetch'
import { logger } from '../logger/logger.js'

export type RequestProps = RequestInit & {
  headers: {
    Authorization?: string;
  }
}

export async function makeRequest (method: string, path: string, opt?: RequestInit) {
  try {
    const innerOpts: Partial<RequestProps> = {}
    innerOpts.method = method
    innerOpts.headers = opt?.headers || {}
    innerOpts.headers['Content-Type'] = opt?.headers['Content-type'] || 'application/json;charset=utf-8'

    if (opt?.body) {
      innerOpts.body = opt.body
    }

    const fetchConfigResult = await fetch(path, innerOpts)
    const jsonResult = await fetchConfigResult.json()
    logger.info({ jsonResult })

    return jsonResult
  } catch (error) {
    logger.error(`Something happend trying to fecth from ${path}`)
    logger.error(error)
    return {
      error
    }
  }
}