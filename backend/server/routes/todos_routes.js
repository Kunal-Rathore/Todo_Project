// post -> addtodo, deletetodo 
// get -> fetchtodo

const express = require("express");
const { checkTokenValid } = require("../middlewares/auth.js");
const { FetchTodosfromTodosModel, addTodoInTodoModel, deleteTodoInTodoModel, updateTodoInTodoModel } = require("../CRUD/todosModel.js");
const { checkInputs_ToAddTodo } = require("../validate/zod.js");

const todos = express.Router();
todos.use(express.json());

// first need to check token is correct or not then need to fetch the todos for corresponding userId
todos.get("/fetchtodos", checkTokenValid, async (req, res) => {

    try {
        const userId = req.userId;
        const todos = await FetchTodosfromTodosModel(userId);
        return res.status(200).json({ todos: todos });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

});

todos.post("/addtodo", checkTokenValid, async (req, res) => {
    try {
        const userId = req.userId;
        const zodResponse = checkInputs_ToAddTodo(req.body);
        if (!zodResponse.success) {
            const messages = zodResponse.error.issues.map(err => err.message);
            return res.status(400).json({ message: messages });
        }

        await addTodoInTodoModel(req.body, userId); // pass the title and isDone input and the userId to add
        return res.status(201).json({ message: "Todo added successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

todos.delete("/deletetodo/:id", checkTokenValid, async (req, res) => {

    try {
        const userId = req.userId;
        await deleteTodoInTodoModel(userId, req.params.id);

        return res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        if (error.name === "TodoNotFound") {
            return res.status(404).json({ message: error.message });

        }
        return res.status(500).json({ message: error.message });
    }

})

todos.put("/updatetodo/:id", checkTokenValid, async (req, res) => {

    try {
        const userId = req.userId;
        await updateTodoInTodoModel(userId, req.params.id);
        res.status(200).json({ message: "Todo updated successfully" });
    }
    catch (error) {
        if (error.name === "InvalidTodo") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
})


module.exports = todos;