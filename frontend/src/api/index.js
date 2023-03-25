import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/todo' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).credential}`;
    }
  
    return req;
  });

export const fetchTodo = () => API.get(`/`);
export const createTodo = (newTodo) => API.post('/', newTodo);
export const updateTodo = (id, updatedPost) => API.put(`/${id}`, updatedPost);
export const deleteTodo = (id) => API.delete(`/${id}`);