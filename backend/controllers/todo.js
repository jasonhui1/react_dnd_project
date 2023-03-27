import express from 'express';
import mongoose from 'mongoose';
import TodoMessage from '../models/todo.js';

const router = express.Router();

//Find todo with certain user
export const getTodos = async (req, res) => {
    try {
        // const todos = await TodoMessage.find()
        const todos = await TodoMessage.find({creater_ID: req.userId})
        res.status(200).json(todos)

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Create todo with certain user
export const createTodo = async (req, res) => {
    const todo = req.body;
    const newPostMessage = new TodoMessage({ ...todo, creater_ID: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

//Update certain todo with certain user
export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const {creater_ID} = await TodoMessage.findById(id)

    //Check the todo is created by the requested user
    if (creater_ID === req.userId){
        const todoUpdate = { _id: id, completed: completed }
        const newTodo = await TodoMessage.findByIdAndUpdate(id, todoUpdate, { new: true });
        res.status(200).json(newTodo)
    } else {
        res.status(409).send("UPDATE: WRONG USER")
    }
}

//Delete certain todo with certain user
export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const {creater_ID} = await TodoMessage.findById(id)

    //Check the todo is created by the requested user
    if (creater_ID === req.userId){
        await TodoMessage.findByIdAndRemove(id);
        res.json({ message: "Todo deleted successfully." });
    } else {
        console.log('creater id', creater_ID, 'id', id, "DELETE: WRONG USER")
        res.status(409).send("WRONG USER")
    }
}




export default router;