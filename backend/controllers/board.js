import express from 'express';
import mongoose from 'mongoose';
import { Board, Section } from '../models/board.js';

const router = express.Router();

export const getBoard = async (req, res) => {

    try {
        const sections = await Board.find()
        console.log('sections', sections)
        res.status(200).json(sections)

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//Get related section -> related todos
export const getBoardById = async (req, res) => {
    const { id } = req.params;

    try {
        const sections = await Board.findOne({ _id: id }).populate('sections')


        console.log('sections', sections)
        res.status(200).json(sections)

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Get related section -> related todos
export const updateBoard = async (req, res) => {
    const { sections } = req.body;


    async function updateAll() {
        let result;
        for (const section of sections) {
            result = await Section.updateOne({ _id: section._id }, { $set: section }, { new: true });
          }

          return result;
    }

    const result = await updateAll();
    console.log('result', result)
    if (result) {
        res.status(200).json(result)

    } else {
        res.status(409).json({ message: "updateFail" })
    }





    // try {
    //     const result = await Board.findOneAndUpdate({_id:id}, {sections:sections})
    //     console.log('result', result)
    //     res.status(200).json(result)

    // } catch (error) {
    //     res.status(404).json({ message: error.message });
    // }
}

//Create a board + a default section 
export const createBoard = async (req, res) => {

    try {
        req.body = { ...req.body, 'title': 'default' }
        const section = await createSection(req)
        const newBoard = new Board({ sections: [section._id] })

        await newBoard.save();
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const createSection = async (req, res) => {
    const section = req.body;
    const newSectionMessage = new Section({ ...section })

    try {
        await newSectionMessage.save();
        return newSectionMessage
    } catch (error) {
        console.log('error', error)
    }
}

export const addSection = async (req, res) => {
    const { board_id, section_id } = req.body;
    const update = { $push: { sections: section_id } }; //$push the id to the childs array.
    const updatedSection = await Board.updateOne({ _id: board_id }, update,);
    console.log('section_id', section_id)
    console.log('updatedSection', updatedSection)

    if (section_id) {
        return res.status(200).json(updatedSection)
    } else {
        return res.status(409).json({ message: 'add section failed' },)

    }
}

//Delete certain todo with certain user
export const removeBoard = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const result = await Board.findByIdAndRemove(id);

    if (result) {
        res.json({ message: "Todo deleted successfully." });

    } else {
        res.status(409).json({ message: "Todo deleted failed." });

    }
}


export default router;