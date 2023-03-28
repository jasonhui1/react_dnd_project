import express from 'express';
import { createBoard, getBoard, removeBoard, getBoardById, updateBoard} from '../controllers/board.js';

const router = express.Router();

router.post('/', createBoard);
router.get('/', getBoard);
router.get('/:id', getBoardById);
router.delete('/:id', removeBoard)


router.put('/:id', updateBoard)


export default router;
