import express from 'express';
// import auth from '../middleware/auth.js';
import { createSection, getSections, createSectionChild, removeSectionChild } from '../controllers/section.js';

const router = express.Router();

router.post('/', createSection);
router.get('/', getSections);
router.put('/', createSectionChild);
router.delete('/', removeSectionChild);

export default router;
