import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {

    console.log('Deleting TODO: ', event)

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const deleteCommand = {
      TableName: todosTable,
      Key: { todoId, userId }
    }

    const result = await dynamoDbClient.delete(deleteCommand)
    const items = result.Items

    return {
      statusCode: 204,
      body: JSON.stringify({
        items
      })
    }
  })

