import { Routes, Route } from 'react-router-dom'
import './index.css';
import Todo from './Pages/Todo';
import DND from './Pages/DND';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path='/' element={<Todo/>}/>
        <Route path='/dnd' element={<DND/>}/>
      </Routes>
    </DndProvider>
  );
}

export default App;
