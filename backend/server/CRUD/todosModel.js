
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
    if (res.deletedCount === 0) {   // if a todo is not deleted then throw error.
        const err = new Error("Todo not found");
        err.name = "TodoNotFound";
        throw err;
    }
}

async function updateTodoInTodoModel(userId, todoId) {

    const updated = await todosModel.findOneAndUpdate(
        { userId: userId, _id: todoId },
        [{ $set: { isDone: { $not: "$isDone" } } }]
    );

    if (!updated) {
        const err = new Error("Invalid todo");
        err.name = "InvalidTodo";
        throw err;
    }
}

module.exports = { FetchTodosfromTodosModel, addTodoInTodoModel, deleteTodoInTodoModel, updateTodoInTodoModel };