import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {

  console.log('Updating TODO: ', event)

  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = '8e262baa-a694-4579-afa0-a596572aed5f'

  const updateCommand = {
    TableName: todosTable,
    Key: { todoId, userId },
    UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    }
  }

  const result = await dynamoDbClient.update(updateCommand)
  const items = result.Items

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
