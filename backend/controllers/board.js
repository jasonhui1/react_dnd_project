import express from 'express';
import { Board } from '../models/board.js';

const router = express.Router();

// Create a new board
export const createBoard = async (req, res) => {
  const {title} = req.body
  const userId = req.userId
  try {
    const board = new Board({title:title, createdBy:userId});
    await board.save();
    res.status(201).send(board);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all boards
export  const getBoard = async (req, res) => {
  const userId = req.userId

  try {
    const boards = await Board.find({createdBy:userId});
    res.send(boards);
  } catch (error) {
    res.status(500).send(error);
  }
};

// // Get a board by ID
export  const getBoardById = async (req, res) => {
  const {id} = req.params
  const userId = req.userId

  try {
    const board = await Board.findById(id).where('createdBy').equals(userId);
    if (!board) {
      return res.status(404).send();
    }
    res.send(board);
  } catch (error) {
    res.status(500).send(error);
  }
};

// // Update a board by ID
// router.patch('/boards/:id', async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['sections'];
//   const isValidOperation = updates.every(update => allowedUpdates.includes(update));

//   if (!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid updates!' });
//   }

//   try {
//     const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!board) {
//       return res.status(404).send();
//     }
//     res.send(board);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Delete a board by ID
export const deleteBoard =  async (req, res) => {
  const {id} = req.params
  const userId = req.userId

  try {
    const board = await Board.findByIdAndDelete(id).where('createdBy').equals(userId);
    if (!board) {
      return res.status(404).send();
    }
    res.send(board);
  } catch (error) {
    res.status(500).send(error);
  }
};

//Drop section to a new position
export const patchSectionPosition = async (req, res) => {
  const { boardId } = req.params;
  const { sectionId, newIndex } = req.body;
  const userId = req.userId

  try {
    const document = await Board.findById(boardId).where('createdBy').equals(userId);
    if (!document) throw new Error(`No document found with id: ${boardId}`);


    //Get section
    const prevIndex = document.sections.findIndex(section => section._id.toString() === sectionId)

    let section = document.sections[prevIndex]
    section = section.toObject() //cannot push with existing _id

    //Swap
    document.sections.splice(prevIndex, 1)
    document.sections.splice(newIndex, 0, section)

    // Save the updated document
    console.log('document', document)
    const updatedDocument = await document.save();
    res.status(200).json(updatedDocument)
} catch (error) {
    res.status(409).json({ message: "swap fail" })
}
};
