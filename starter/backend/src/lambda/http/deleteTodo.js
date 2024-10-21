import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs' 

const logger = createLogger('utils')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    logger.info(`Deleting TODO item: ${event.pathParameters.todoId}`)

    try {
      const items = await deleteTodo(event)

      logger.info(`TODO item deleted successfully`)

      return {
        statusCode: 204,
        body: JSON.stringify({
          items
        })
      }
    } catch(error) {
      logger.error(`TODO item failed to be deleted: ${error}`)

      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
  })

