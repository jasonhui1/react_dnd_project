import { AddIcon} from '@chakra-ui/icons'
import React from 'react'

interface Props{
    onClick: (event: React.MouseEvent) => void
}

export default function AddButton({onClick}:Props) {
  return (
    <AddIcon ml='auto' onClick={onClick} color='black' cursor={'pointer'}/>
  )
}
