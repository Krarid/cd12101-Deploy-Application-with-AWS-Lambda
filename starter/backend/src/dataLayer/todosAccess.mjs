import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs'

export class TodosAccess {
    
    constructor() {
        this.dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
        this.todosTable = process.env.TODOS_TABLE
    }

    async getTodos(userId) {
        const queryCommand = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }

        const result = await this.dynamoDbClient.query(queryCommand)
        return result.Items
    }

    async createTodo(userId, body) { 
        const parsedBody = JSON.parse(body)
        const todoId = uuidv4()

        const newTodo = {
            todoId: todoId,
            userId: userId,
            done: false,
            createdAt: new Date().toISOString(),
            ...parsedBody 
        }

        const createCommand = {
            TableName: this.todosTable,
            Item: newTodo
        }

        await this.dynamoDbClient.put(createCommand)

        return newTodo
    }

    async updateTodo(userId, todoId, body) {
        const updatedTodo = JSON.parse(body)

        const updateCommand = {
            TableName: this.todosTable,
            Key: { todoId, userId },
            UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: {
                ':name': updatedTodo.name,
                ':dueDate': updatedTodo.dueDate,
                ':done': updatedTodo.done
            }
        }

        const result = await this.dynamoDbClient.update(updateCommand)
        return result.Items
    }

    async deleteTodo(userId, todoId) {
        const deleteCommand = {
            TableName: this.todosTable,
            Key: { todoId, userId }
        }

        const result = await this.dynamoDbClient.delete(deleteCommand)
        return result.Items
    }

    async uploadUrl(userId, todoId) {
        await this.saveImage(userId, todoId)
        return await getUploadUrl(todoId)
    }

    async saveImage(userId, todoId) {

        const bucketName = process.env.IMAGES_S3_BUCKET

        const updateCommand = {
            TableName: this.todosTable,
            Key: { todoId, userId },
            UpdateExpression: 'set #url = :attachmentUrl',
            ExpressionAttributeNames: { '#url': 'attachmentUrl' },
            ExpressionAttributeValues: {
            ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
            }
        }
    
        const result = await this.dynamoDbClient.update(updateCommand)
        const items = result.Items
    
        return {
            statusCode: 201,
            body: JSON.stringify({
                items
            })
        }
    }
}