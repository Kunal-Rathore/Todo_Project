
const { todosModel } = require("../db/db.js");

// here operations will be -> fetch, add and delete

async function FetchTodosfromTodosModel(userId) { // it will have userId by passing isValid in auth.js 
    const todos = await todosModel.find({
        userId: userId // find all todos for the specific user 
    }).sort({ date: -1 });
    return todos;
}

async function addTodoInTodoModel(data, userId) {

    const title = data.title, isDone = data.isDone;
    await todosModel.create({
        title: title,
        isDone: isDone,
        userId: userId
    });
}

async function deleteTodoInTodoModel(userId, todoId) {

    const res = await todosModel.deleteOne({
        userId: userId,
        _id: todoId
    });
    if (res.deletedCount != 0) {   // if a todo is deleted (deletedCount != 0) then return true.
        return true;
    }
    return false;
}

async function updateTodoInTodoModel(userId, todoId) {

    try {
        const todo = await todosModel.findOne({
            userId: userId,
            _id: todoId
        });

        if (!todo) { return false }

        const result = await todosModel.updateOne(
            { userId: userId, _id: todoId },
            { $set: { isDone: !todo.isDone } });
        return result.modifiedCount > 0;
    } catch (error) {
        throw new Error(error);

    }
}

module.exports = { FetchTodosfromTodosModel, addTodoInTodoModel, deleteTodoInTodoModel, updateTodoInTodoModel };