import express from 'express';
import { createTodo , getTodos, updateTodo, deleteTodo} from '../controllers/todo.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createTodo);
router.get('/', auth, getTodos);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;