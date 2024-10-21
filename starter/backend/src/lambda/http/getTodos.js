import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { getTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs' 

const logger = createLogger('utils')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    logger.info(`Retrieving TODO items`)

    try {
      const items = await getTodos(event)

      logger.info(`TODO items retrieved successfully`)

      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
    } catch(error) {
      logger.error(`TODO items failed to be retrieved: ${error}`)

      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
  })
