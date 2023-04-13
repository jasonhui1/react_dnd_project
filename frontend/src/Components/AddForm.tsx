import { Flex, Input } from '@chakra-ui/react'
import React from 'react'
import AddButton from './AddButton'

interface Props {
    onClick: (event: React.MouseEvent) => void
    setState: React.Dispatch<any>
}

export default function AddForm({setState, onClick}:Props) {
    return (
        <Flex gap='2' mt='5' mb='1' align='center'>
            <Input type="text" bg='white' onChange={(e)=>setState(e.target.value)} />
            <AddButton onClick={onClick} />
        </Flex>
    )
}
