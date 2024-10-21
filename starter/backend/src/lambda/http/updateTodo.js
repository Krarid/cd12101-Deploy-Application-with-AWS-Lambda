import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log("Updating TODO: " + event)

    try {
      const items = await updateTodo(event)

      return {
        statusCode: 204,
        body: JSON.stringify({
          items
        })
      }
    } catch(error) {
      console.error(`Error: ${error}`)
      return {
        statusCode: 500,
        body: JSON.stringify({error})
      }
    }
  })