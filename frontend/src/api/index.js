import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).credential}`;
    }
  
    return req;
  });

// export const fetchTodo = () => API.get(`/todo/`);
// export const createTodo = (newTodo) => API.post('/todo/', newTodo);
// export const updateTodo = (id, updatedPost) => API.put(`/todo/${id}`, updatedPost);
// export const deleteTodo = (id) => API.delete(`/todo/${id}`);

export const fetchBoard = ()=>API.get('/board')
export const fetchBoardById = (id)=>API.get(`/board/${id}`)

export const createSection = (boardId, title)=>API.post(`/board/${boardId}/section/`, {title:title})
export const deleteSection = (boardId, sectionId)=>API.delete(`/board/${boardId}/section/${sectionId}`)

export const changeCardSection = (boardId, cardId, prevSectionIndex, newSectionIndex )=>API.patch(`/board/${boardId}/cardSection/`, {cardId:cardId, prevSectionIndex:prevSectionIndex, newSectionIndex:newSectionIndex})



export const createCard = (boardId, sectionId, title)=>API.post(`/board/${boardId}/section/${sectionId}/card`, {title:title})
export const deleteCard = (boardId, sectionId, cardId)=>API.delete(`/board/${boardId}/section/${sectionId}/card/${cardId}`)



// // export const fetchSection = () => API.get(`/section/`);
// export const createSection= (title) => API.post('/section/', {title:title});
// export const deleteSection= (id) => API.delete(`/section/${id}`);
// export const swapChild = (section_id, index1, index2 ) => API.put('/section/swap', {section_id:section_id, index1:index1, index2:index2});


// export const fetchBoard = () => API.get('/board/6421fbfd31171d7a9b9a30fe');
// export const updateBoard = (sections) => API.put('/board/6421fbfd31171d7a9b9a30fe', {sections:sections});


// export const updateTodo = (id, updatedPost) => API.put(`/todo/${id}`, updatedPost);
// export const deleteTodo = (id) => API.delete(`/todo/${id}`);