import express from 'express';
import {  createBoard, getBoard, getBoardById, deleteBoard, patchSectionPosition} from '../controllers/board.js';
import {  createSection, deleteSection, patchCardSection, swapCard} from '../controllers/section.js';
import { createCard, deleteCard } from '../controllers/card.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createBoard);
router.get('/', auth, getBoard);
router.get('/:id', auth, getBoardById);
router.delete('/:id', auth, deleteBoard);

router.post('/:boardId/section/', auth, createSection)
router.delete('/:boardId/section/:sectionId', auth, deleteSection)

router.patch('/:boardId/cardSection/', auth, patchCardSection)
router.patch('/:boardId/cardPosition/', auth, swapCard)
router.patch('/:boardId/sectionPosition/', auth, patchSectionPosition)

router.post('/:boardId/section/:sectionId/card', auth, createCard)
router.delete('/:boardId/section/:sectionId/card/:cardId', auth, deleteCard)

export default router;
