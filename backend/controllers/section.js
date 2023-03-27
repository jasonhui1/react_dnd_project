import express from 'express';
import mongoose from 'mongoose';
import SectionMessage from '../models/section.js';

const router = express.Router();

export const getSections = async (req, res) => {
    try {
        const sections = await SectionMessage.find()
        res.status(200).json(sections)

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createSection = async (req, res) => {
    const section = req.body;
    const newSectionMessage = new SectionMessage({ ...section })
    try {
        await newSectionMessage.save();
        res.status(201).json(newSectionMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const createSectionChild = async (req, res) => {
    const { section_id, todo_id } = req.body;

    const update = { $push: { childs: todo_id } }; //$push the id to the childs array.
    const updatedSection = await SectionMessage.updateOne({ _id: section_id }, update);

    if (updatedSection) {
        res.status(200).json(updatedSection)
    } else {
        res.status(404).send(`No section found with id: ${section_id}`);
    }
}

export const removeSectionChild = async (req, res) => {
    const { section_id, todo_id } = req.body;

    const update = { $pull: { childs: todo_id } }; //$pull removes all matching elements from the childs array.
    const result = await SectionMessage.updateOne({ _id: section_id }, update);

    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).send(`No section found with id: ${section_id}`);
    }
}

export const swapSectionChild = async (req, res) => {

    console.log('swapping')

    const { section_id, index1, index2 } = req.body;

    try {
        const document = await SectionMessage.findById(section_id);
        if (!document) throw new Error(`No document found with id: ${section_id}`);
        if (document.childs.length <= index1 || document.childs.length <= index2) throw new Error(`index exceeds length`);

        //Swap
        // [document.childs[index1], document.childs[index2]] = [document.childs[index2], document.childs[index1]];//give error
        const temp = document.childs[index1];
        document.childs[index1] = document.childs[index2];
        document.childs[index2] = temp;

        // Save the updated document
        const updatedDocument = await document.save();
        return updatedDocument;
    } catch (error) {
        console.error(error);
    }
}

//TODO: update title and remove section

// //Update certain todo with certain user
// export const updateTodo = async (req, res) => {
//     const { id } = req.params;
//     const { completed } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

//     const {creater_ID} = await TodoMessage.findById(id)

//     //Check the todo is created by the requested user
//     if (creater_ID === req.userId){
//         const todoUpdate = { _id: id, completed: completed }
//         const newTodo = await TodoMessage.findByIdAndUpdate(id, todoUpdate, { new: true });
//         res.status(200).json(newTodo)
//     } else {
//         res.status(409).send("UPDATE: WRONG USER")
//     }
// }

// //Delete certain todo with certain user
// export const deleteTodo = async (req, res) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

//     const {creater_ID} = await TodoMessage.findById(id)

//     //Check the todo is created by the requested user
//     if (creater_ID === req.userId){
//         await TodoMessage.findByIdAndRemove(id);
//         res.json({ message: "Todo deleted successfully." });
//     } else {
//         console.log('creater id', creater_ID, 'id', id, "DELETE: WRONG USER")
//         res.status(409).send("WRONG USER")
//     }
// }


export default router;