import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).credential}`;
    }
  
    return req;
  });

export const fetchTodo = () => API.get(`/todo/`);
export const createTodo = (newTodo) => API.post('/todo/', newTodo);
export const updateTodo = (id, updatedPost) => API.put(`/todo/${id}`, updatedPost);
export const deleteTodo = (id) => API.delete(`/todo/${id}`);


export const fetchSection = () => API.get(`/section/`);
export const createSection= (newSection) => API.post('/section/', newSection);
export const swapSection = (newSectionInfo) => API.put('/section/swap', newSectionInfo);


export const fetchBoard = () => API.get('/board/6421fbfd31171d7a9b9a30fe');


// export const updateTodo = (id, updatedPost) => API.put(`/todo/${id}`, updatedPost);
// export const deleteTodo = (id) => API.delete(`/todo/${id}`);