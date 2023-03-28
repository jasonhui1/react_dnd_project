import express from 'express';
import { createBoard, getBoard, removeBoard, addSection, getBoardById, updateBoard} from '../controllers/board.js';

const router = express.Router();

router.post('/', createBoard);
router.get('/', getBoard);
router.get('/:id', getBoardById);
router.delete('/:id', removeBoard)
router.post('/:id', addSection)
router.put('/:id', updateBoard)


export default router;
