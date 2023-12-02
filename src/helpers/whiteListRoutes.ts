import { RouteDeepStructure } from '../types/index.js'
import { allRoutes as accessTokenRoutes } from '../routes/accessToken/index.js'
import { WHITE_LIST_ROUTES } from './consts/index.js'
import { allRoutes as mainRoutes } from '../routes/main/index.js'
// import { allRoutes as userRoutes } from '../routes/user/index.js'
import { allRoutes as validatorsRoutes } from '../routes/validators/index.js'

const unifiedAllRoutes: RouteDeepStructure[] = []
                        .concat(Object.values(accessTokenRoutes))
                        .concat(Object.values(mainRoutes))
                        .concat(Object.values(validatorsRoutes))

export function fillWhiteListRoutes(allRoutes: RouteDeepStructure[]) {
  allRoutes.forEach(route => {
    if (!route.auth) {
      WHITE_LIST_ROUTES.push(route)
    }
  })
}

fillWhiteListRoutes(unifiedAllRoutes)