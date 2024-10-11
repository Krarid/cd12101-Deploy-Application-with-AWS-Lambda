import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export async function handler(event) {

  console.log('Creating TODO: ', event)
  const todoId = uuidv4()
  // REFACTOR
  const userId = uuidv4()

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
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newTodo
    })
  }
}

