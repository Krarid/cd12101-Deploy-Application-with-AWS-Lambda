import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { createTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log("Creating TODO: " + event)

    try {
      const newTodo = await createTodo(event)

      return {
        statusCode: 201,
        body: JSON.stringify({
          newTodo
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