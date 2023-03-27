import express from 'express';
// import auth from '../middleware/auth.js';
import { createSection, getSections, createSectionChild, removeSectionChild, swapChild, swapSection } from '../controllers/section.js';

const router = express.Router();

router.post('/', createSection);
router.get('/', getSections);
router.post('/card', createSectionChild);
router.delete('/card', removeSectionChild);

router.put('/swap', swapChild);
router.put('/swapSection', swapSection);

export default router;
