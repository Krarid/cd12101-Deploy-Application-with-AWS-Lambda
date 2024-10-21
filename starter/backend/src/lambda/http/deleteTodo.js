import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { deleteTodos } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log("Deleting TODO: " + event)

    const items = await deleteTodos(event)

    return {
      statusCode: 204,
      body: JSON.stringify({
        items
      })
    }
  })

