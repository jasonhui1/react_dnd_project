import React, { useState, useEffect } from 'react';
import * as api from './api';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Flex } from '@chakra-ui/react';

const responseGoogle = (response: any) => {
  localStorage.setItem('user', JSON.stringify(response));
};

const logout = () => {
  console.log('logout')
  localStorage.clear();
  googleLogout()
}

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

interface NewTodo {
  title: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<NewTodo>({ title: '' });

  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  })
  useEffect(() => {
    async function fetchTodos() {
      const { data } = await api.fetchTodo();
      setTodos(data);
      console.log('data', data)
    }
    fetchTodos()
  }, []);

  async function postTodo(todo: NewTodo) {
    const { data } = await api.createTodo(todo);
    setTodos([...todos, data]);
    setNewTodo({ title: '' });
  }

  async function updateTodo(id: string, completed: boolean) {
    const { data } = await api.updateTodo(id, { completed: !completed });
    const updatedTodos = todos.map((todo) => {
      if (todo._id === data._id) {
        return data;
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  }

  async function deleteTodo(id: string) {
    try {
      await api.deleteTodo(id);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postTodo(newTodo)
  };

  const handleComplete = (id: string, completed: boolean) => {
    updateTodo(id, completed)
  };

  const handleDelete = (id: string) => {
    deleteTodo(id)
  };

  return (
    <div>
      <Flex >

        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => {
            console.log('Login Failed');
          }}
        />;
        <button onClick={logout}>LOGOUT</button>
      </Flex>


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ title: e.target.value })}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.length >= 0 && todos.map((todo) => {
          return (
            <li key={todo._id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleComplete(todo._id, todo.completed)}
              />
              <span>{todo.title}</span>
              <button onClick={() => handleDelete(todo._id)}>Delete</button>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
