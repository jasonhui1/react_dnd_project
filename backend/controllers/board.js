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
  const {id} = req.params.id
  const userId = req.userId

  try {
    const board = await Board.findById(req.params.id).where('createdBy').equals(userId);
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
  try {
    const board = await Board.findByIdAndDelete(id);
    if (!board) {
      return res.status(404).send();
    }
    res.send(board);
  } catch (error) {
    res.status(500).send(error);
  }
};

// export default router;
