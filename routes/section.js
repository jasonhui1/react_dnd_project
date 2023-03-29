import express from 'express';
// import auth from '../middleware/auth.js';
import { createSection, getSections, deleteSection, createSectionChild, removeSectionChild, swapChild } from '../controllers(old)/section.js';

const router = express.Router();


router.post('/card', createCard);
router.delete('/card', removeSectionChild);

router.put('/swap', swapChild);
// router.put('/swapSection', swapSection);

export default router;
