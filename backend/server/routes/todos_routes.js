// post -> addtodo, deletetodo 
// get -> fetchtodo

const express = require("express");
const { Todos } = require("../auth/auth.js");
const { FetchTodosfromTodosModel, addTodoInTodoModel, deleteTodoInTodoModel, updateTodoInTodoModel } = require("../CRUD/todosModel.js");

const todos = express();
todos.use(express.json());

// first need to check token is correct or not then need to fetch the todos for corresponding userId
todos.get("/fetchtodos", Todos, async (req, res) => {

    try {
        const userId = req.userId;
        const todos = await FetchTodosfromTodosModel(userId);
        res.status(200).json({ message: "Todos fetched successfully", todos: todos });

    } catch (error) {
        console.log("FetchTodosfromTodosModel error- ", error);
        res.status(400).json({ message: error.message });
    }

});

todos.post("/addtodo", Todos, async (req, res) => {
    try {
        const userId = req.userId;
        await addTodoInTodoModel(req.body, userId); // pass the title and isDone input and the userId to add
        res.status(200).json({ message: "Todo added successfully" });

    } catch (error) {
        console.log("addTodoInTodoModel error- ", error);
        res.status(400).json({ message: error.message });
    }
});

todos.delete("/deletetodo/:id", Todos, async (req, res) => {

    try {
        const userId = req.userId;
        const respond = await deleteTodoInTodoModel(userId, req.params.id);     // here req.body will have _id after fetching the todos
        if (respond) {
            res.status(200).json({ message: "Todo deleted successfully" });
        }
        else {
            res.status(400).json({ message: "Invalid todo" });
        }
    }
    catch (error) {
        console.log("deleteTodoInTodoModel error- ", error);
        res.status(400).json({ message: error.message });
    }

})

todos.put("/updatetodo/:id", Todos, async (req, res) => {

    try {
        const userId = req.userId;
        const respond = await updateTodoInTodoModel(userId, req.params.id);     // here req.body will have _id after fetching the todos
        if (respond) {
            res.status(200).json({ message: "Todo updated successfully" });
        }
        else {
            res.status(400).json({ message: "Invalid todo" });
        }
    }
    catch (error) {
        console.log("updateTodoInTodoModel error- ", error);
        res.status(400).json({ message: error.message });
    }

})


module.exports = todos;