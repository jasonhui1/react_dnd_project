import express from 'express';
import {  createBoard, getBoard, getBoardById, deleteBoard} from '../controllers/board.js';
import {  createSection, deleteSection, patchCardSection} from '../controllers/section.js';
import { createCard, deleteCard } from '../controllers/card.js';

const router = express.Router();

router.post('/', createBoard);
router.get('/', getBoard);
router.get('/:id', getBoardById);
router.delete('/:id', deleteBoard);

router.post('/:boardId/section/', createSection)
router.delete('/:boardId/section/:sectionId', deleteSection)
router.patch('/:boardId/cardSection/', patchCardSection)

router.post('/:boardId/section/:sectionId/card', createCard)
router.delete('/:boardId/section/:sectionId/card/:cardId', deleteCard)



export default router;
