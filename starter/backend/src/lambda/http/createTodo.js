import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log('Creating TODO: ', event)

    const todoId = uuidv4()
    // REFACTOR
    const userId = '8e262baa-a694-4579-afa0-a596572aed5f'

    const parsedBody = JSON.parse(event.body)

    const newTodo = {
      todoId: todoId,
      userId: userId,
      ...parsedBody 
    }

    const createCommand = {
      TableName: todosTable,
      Item: newTodo
    }

    await dynamoDbClient.put(createCommand)

    return {
      statusCode: 201,
      body: JSON.stringify({
        newTodo
      })
    }
  })