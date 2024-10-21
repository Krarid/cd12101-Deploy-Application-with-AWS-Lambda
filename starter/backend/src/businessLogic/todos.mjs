import { getUserId } from "../lambda/utils.mjs"
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodosAccess()

export const getTodos = async (event) => {
    const userId = getUserId(event)
    return todosAccess.getTodos(userId)
}

export const createTodo = async (event) => {
    const userId = getUserId(event)
    return todosAccess.createTodo(userId, event.body)
}

export const updateTodo = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.updateTodo(userId, todoId, event.body)
}

export const deleteTodo = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.deleteTodo(userId, todoId)
}

export const generateUrl = async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    return todosAccess.uploadUrl(userId, todoId)
}