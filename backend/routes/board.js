import express from 'express';
import { createBoard, getBoard, removeBoard, addSection, getBoardById} from '../controllers/board.js';

const router = express.Router();

router.post('/', createBoard);
router.get('/', getBoard);
router.get('/:id', getBoardById);
router.delete('/:id', removeBoard)
router.put('/:id', addSection)
export default router;
