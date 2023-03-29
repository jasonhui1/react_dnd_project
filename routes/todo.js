import express from 'express';
import { createTodo , getTodos, updateTodo, deleteTodo} from '../controllers(old)/todo.js';
import auth from '../backend/middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTodos);
router.post('/', auth, createTodo);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);


export default router;