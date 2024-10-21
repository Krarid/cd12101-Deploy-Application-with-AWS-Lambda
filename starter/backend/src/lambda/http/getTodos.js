import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { getTodos } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log("Getting TODOs: " + event)

    const items = await getTodos(event)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
