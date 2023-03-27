import express from 'express';
// import auth from '../middleware/auth.js';
import { createSection, getSections, createSectionChild, removeSectionChild, swapSectionChild } from '../controllers/section.js';

const router = express.Router();

router.post('/', createSection);
router.get('/', getSections);
router.put('/', createSectionChild);
router.delete('/', removeSectionChild);
router.put('/swap', swapSectionChild);

export default router;
