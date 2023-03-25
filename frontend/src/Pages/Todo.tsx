import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'
import { Box, Text, Button, Checkbox, Flex, ListItem, OrderedList, Input, FormControl, Container, Divider } from '@chakra-ui/react';


interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

interface NewTodo {
    title: string;
}

export default function Todo() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<NewTodo>({ title: '' });
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const navigate = useNavigate()

    const responseGoogle = (response: any) => {
        localStorage.setItem('user', JSON.stringify(response));
        navigate(0)
    };

    const logout = () => {
        localStorage.clear();
        googleLogout()
        navigate(0)

    }

    useEffect(() => {
        async function fetchTodos() {
            const { data } = await api.fetchTodo();
            setTodos(data);
            console.log('data', data)
        }
        setIsLogin(!!localStorage.getItem('user'))
        fetchTodos()
    }, [isLogin]);

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
        <Container>
            <Box my='5' w='fit-content' ml="auto" >
                    {!isLogin ? (
                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />) : (
                        <Button onClick={logout}>LOGOUT</Button>
                    )}
            </Box>

            <Divider />

            {
        isLogin && (
            <Box my='5'>
                <form onSubmit={handleSubmit}>
                    <FormControl  >
                        <Input w='min(50%,400px)' 
                            type="text"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({ title: e.target.value })}
                        />
                        <Button type="submit" ml='5'>Add Todo</Button>
                    </FormControl>
                </form>
                <OrderedList spacing={3}>
                    {todos.length >= 0 && todos.map((todo) => {
                        return (
                            <ListItem key={todo._id}>
                                <Flex gap='2' alignItems='center'>
                                    <Checkbox
                                        isChecked={todo.completed}
                                        onChange={() => handleComplete(todo._id, todo.completed)}
                                    />
                                    <Text as='span'>{todo.title}</Text>
                                    <Button onClick={() => handleDelete(todo._id)}>Delete</Button>
                                </Flex>
                            </ListItem>
                        )
                    })}
                </OrderedList>
            </Box>
        )
    }

        </Container >
    );
}
