import { DeleteIcon } from '@chakra-ui/icons'
import React from 'react'

interface Props{
    onClick: (event: React.MouseEvent) => void
}

export default function DeleteButton({onClick}:Props) {
  return (
    <DeleteIcon ml='auto' onClick={onClick} color='white' cursor={'pointer'}/>
  )
}
