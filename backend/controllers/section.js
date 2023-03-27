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

    const doc = await SectionMessage.findById(section_id);
    if (!doc) return res.status(404).send(`No section with id: ${section_id}`)

    try {
        const { childs } = doc
        const newChilds = [...childs, todo_id]
        const todoUpdate = { _id: section_id, childs: newChilds }

        const updatedSection = await SectionMessage.findByIdAndUpdate(section_id, todoUpdate, { new: true });
        res.status(200).json(updatedSection)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const removeSectionChild = async (req, res) => {
    const { section_id, todo_id } = req.body;

    const doc = await SectionMessage.findById(section_id);
    if (!doc) return res.status(404).send(`No section with id: ${section_id}`)

    try {
        const itemIdToRemove = todo_id; // replace with the id of the item to remove
        const update = { $pull: { childs: itemIdToRemove } }; //$pull removes all matching elements from the array.
        const result = await SectionMessage.updateOne({ _id: section_id }, update);

        res.status(200).json(result)
    } catch (error) {
        res.status(409).json({ message: error.message });
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