import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { createTodos } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log("Creating TODO: " + event)

    const newTodo = await createTodos(event)

    return {
      statusCode: 201,
      body: JSON.stringify({
        newTodo
      })
    }
  })