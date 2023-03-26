import { Routes, Route } from 'react-router-dom'
import './index.css';
import TodoPage from './Pages/Todo';
import DND from './Pages/DND';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './Pages/Board';

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path='/' element={<TodoPage/>}/>
        <Route path='/dnd' element={<DND/>}/>
        <Route path='/board' element={<Board/>}/>
      </Routes>
    </DndProvider>
  );
}

export default App;
