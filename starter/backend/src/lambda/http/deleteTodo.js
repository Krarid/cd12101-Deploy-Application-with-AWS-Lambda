import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {

  console.log('Deleting TODO: ', event)

  const todoId = event.pathParameters.todoId
  const userId = '8e262baa-a694-4579-afa0-a596572aed5f'

  const deleteCommand = {
    TableName: todosTable,
    Key: { todoId, userId }
  }

  const result = await dynamoDbClient.delete(deleteCommand)
  const items = result.Items

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

