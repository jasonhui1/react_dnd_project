import { useNavigate, Routes, Route } from 'react-router-dom'
import Todo from './Pages/Todo';
import { Box, Text, Button, Checkbox, Flex, ListItem, OrderedList, UnorderedList, Input, FormControl, Container } from '@chakra-ui/react';



function App() {

  return (
    <Routes>
      <Route path='/' element={<Todo/>}/>

    </Routes>
  );
}

export default App;
