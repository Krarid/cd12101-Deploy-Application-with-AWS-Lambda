import { getUserId } from "../lambda/utils.mjs"
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodosAccess()

export const getTodos = async (event) => {
    const userId = getUserId(event)
    return todosAccess.getTodos(userId)
}

export const createTodos = async (event) => {
    const userId = getUserId(event)
    return todosAccess.createTodos(userId, event.body)
}

export const updateTodos = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.updateTodos(userId, todoId, event.body)
}

export const deleteTodos = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.deleteTodos(userId, todoId)
}

export const generateUrl = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.uploadUrl(userId, todoId)
}