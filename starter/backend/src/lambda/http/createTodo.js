import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs' 

const logger = createLogger('utils')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    logger.info(`Creating TODO item: ${event.body}`)

    try {
      const newTodo = await createTodo(event)

      logger.info(`TODO item created successfully`)

      return {
        statusCode: 201,
        body: JSON.stringify({
          newTodo
        })
      }
    } catch(error) {
      logger.error(`TODO item failed to be created: ${error}`)

      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
  })