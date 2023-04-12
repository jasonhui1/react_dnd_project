
import React, { useState, useEffect } from 'react';
import * as api from '../api';
import { OrderedList, ListItem, Flex, Checkbox, Button, Text, Box, Heading, Input, Divider, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';


interface Board {
    _id: string
    title: string
}

export default function Sidebar() {

    const [boards, setBoards] = useState<Board[]>()
    const [title, setTitle] = useState('')

    useEffect(() => {
        async function fetchBoards() {
            const { data } = await api.fetchBoard();
            if (!data) {
                console.log('fetchBoard fail')
                return
            }
            console.log('boards', data)
            setBoards(data)
        }
        fetchBoards()
    }, [])

    const onClickAdd = async () => {
        const data = await api.createBoard(title)
        console.log('add board', data)
    }

    return (
        <>
            <Box p='2' bg={'gray.200'} h='calc(100vh)'>
                <Heading textAlign={'center'}>Sidebar</Heading>
                <Divider my='5' />

                <Stack>
                    {boards && boards.map((board) => (
                        <Link to={`/${board._id}`} key={board._id}>{board.title}</Link>
                    ))}

                    {/* Add new board */}
                    <Flex gap='2' mt='5' mb='1' align='center' justify={'center'}>
                        <Input w='min(200px)' type="text" bg='white' onChange={(e) => setTitle(e.target.value)} />
                        <AddIcon onClick={onClickAdd} color='black' />
                    </Flex>
                </Stack>
            </Box>
        </>
    )
}
