import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { generateUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs' 

const logger = createLogger('utils')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {
    
    logger.info(`Saving image in TODO item: ${event.pathParameters.todoId}`)

    try {
      const url = await generateUrl(event)
  
      logger.info(`Image saved successfully`)

      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch(error) {
      logger.error(`Image failed to be saved: ${error}`)

      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
    
})