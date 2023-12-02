import { Context, Next } from "koa"
import { findAccessTokenBykey } from "../../schemas/AcessTokens.js"
import { logger } from "../../logger/logger.js"
import { WHITE_LIST_ROUTES } from "../../helpers/consts/index.js"

  export function getKeyFromHeader (authorization: string) {
    const parts = authorization.split(' ')

    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1]
    } else {
      throw new Error(
        'Invalid authorization header format. Format is { Authorization: Bearer [token] }'
      )
    }
  }

  export async function getTokenFromRequest (ctx: Context, _next: Next) {
    const { authorization } = ctx.request.header

    if (authorization) {
      const key = getKeyFromHeader(authorization)
      return key ? await findAccessTokenBykey(key) : null
    } else if (ctx.query._token) {
      const key = ctx.query._token

      if (!key || typeof key !== 'string') {
        throw new Error(
          'Invalid authorization header format. Format is { Authorization: Bearer [token] }'
        )
      }
      // Remove token from querystring now that we don't need it anymore.
      delete ctx.query._token

      return key ? await findAccessTokenBykey(key) : null
    }
    return null
  }

  export async function  middlewareAuth(ctx: Context, next: Next) {
    const fullUrl = ctx.url
    const [, queryParams] = fullUrl.split('?')
    const APIExactEndpoint = fullUrl.replace(`?${queryParams}`, '')
    const isWhiteList = WHITE_LIST_ROUTES.find(endpoint => {
      const { method, path } = endpoint
      return (method === ctx.method && path === APIExactEndpoint)
    })
    if (isWhiteList) {
      return next()
    }
    if (ctx.state.token) {
      // request is already authenticated in a different way
      return next()
    }
  
    try {
      const accessTokenRow = await getTokenFromRequest(ctx, next)
  
      if (!accessTokenRow || accessTokenRow.key === undefined) {
        ctx.response.status = 403
        ctx.response.message = 'Invalid Token'
        return
      }
  
      const { endpoints } = accessTokenRow
      if (!endpoints) {
        ctx.response.status = 403
        ctx.response.message = 'Token has no access to endpoints'
        return
      }
  
      const allowEntrance = endpoints.find(endpoint => {
        // const { method, path } = endpoint
        return (
          //(method === ctx.method && path === APIExactEndpoint) ||
          endpoint === '*'
        )
      })
  
      if (!allowEntrance) {
        ctx.response.status = 403
        ctx.response.message = 'You can\'t access this endpoint. Please request the addition of this endpoint to your token'
        return
      }
  
      ctx.state.token = accessTokenRow
    } catch (err: unknown) {
      ctx.response.status= 403
      ctx.response.message = (err as Error).message
      logger.error(err)
      return
    }
  
    // Execute the action.
    await next()
  }