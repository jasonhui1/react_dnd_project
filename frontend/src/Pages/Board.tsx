import React, { useState, useEffect, } from 'react';
import * as api from '../api';
import { Flex, Button, Box, Stack } from '@chakra-ui/react';
import Sidebar from '../Components/Sidebar';

import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'
import Board from '../Components/Board/Board';

export interface Board {
  _id: string
  title: string
}

export default function Main() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [boards, onClickAdd] = useQueryBoard()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!!user) {
      setIsLogin(true)
    }
  }, [isLogin]);

  const responseGoogle = (response: any) => {
    localStorage.setItem('user', JSON.stringify(response));
    navigate(0)
  };

  const logout = () => {
    localStorage.clear();
    googleLogout()
    navigate(0)
  }

  const navigate = useNavigate()


  return (
    <>
      <Flex gap='5'>
        {boards && <Sidebar boards={boards} onClickAdd={onClickAdd} />}
        <Stack>
          <Box my='5' w='fit-content' >
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
          <Board />
        </Stack>
      </Flex>
    </>
  )
}

function useQueryBoard(): [Board[] | undefined, (title: string) => Promise<string>] {
  const [boards, setBoards] = useState<Board[]>([])

  useEffect(() => {
    async function fetchBoards() {
      const { data } = await api.fetchBoard();
      if (!data) {
        console.log('fetchBoard fail')
        return
      }
      setBoards(data)
    }
    fetchBoards()
  }, [])

  const onClickAdd = async (title: string) => {
    try {
      const { data } = await api.createBoard(title)
      const newBoard: Board = data
      setBoards([...boards, newBoard])
      return 'success'

    } catch (error) {
      console.log('error', error)

      return 'fail'

    }
  }
  return [boards, onClickAdd]
}