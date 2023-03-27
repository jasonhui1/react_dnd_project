import express from 'express';
import { createTodo , getTodos, updateTodo, deleteTodo} from '../controllers/todo.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);


export default router;