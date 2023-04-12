
import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading, Input, Divider, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { Board } from '../Pages/Board';

interface SidebarProps {
    boards: Board[]
    onClickAdd: (title: string) => Promise<string>
}

export default function Sidebar({ boards, onClickAdd }: SidebarProps) {

    const [title, setTitle] = useState('')

    const onClick = async () => {
        const result = await onClickAdd(title)
        console.log('result', result)
        if (result === 'success') {
            setTitle('')
        }
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
                        <Input w='min(200px)' type="text" bg='white' onChange={(e) => setTitle(e.target.value)} value={title}/>
                        <AddIcon onClick={()=>onClick()} color='black' />
                    </Flex>
                </Stack>
            </Box>
        </>
    )
}
