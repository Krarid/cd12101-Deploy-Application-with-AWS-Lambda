import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import createError from 'http-errors'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client()

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({credentials: true})
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    
    await saveImage(userId, todoId)
    
    try {
      const url = await getUploadUrl(todoId)
  
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url
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

async function saveImage(userId, todoId) {

  console.log('Saving image on todoId: ' + todoId)

  const updateCommand = {
    TableName: todosTable,
    Key: { todoId, userId },
    UpdateExpression: 'set #url = :attachmentUrl',
    ExpressionAttributeNames: { '#url': 'attachmentUrl' },
    ExpressionAttributeValues: {
      ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }
  }

  const result = await dynamoDbClient.update(updateCommand)
  const items = result.Items

  return {
    statusCode: 201,
    body: JSON.stringify({
      items
    })
  }
}

async function getUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}