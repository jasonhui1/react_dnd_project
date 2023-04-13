import React, { useState } from 'react';
import { Flex, Button, Box, Heading, Input, Stack, Divider } from '@chakra-ui/react';
import { useDrop } from "react-dnd";
import Card, { PassProp } from './Card';
import { Todo } from '../../types/Todo';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useBoardContext } from '../../context/board';


interface SectionProps {
    properties: Section,
    positionIndex: number,
}

interface DropSectionProps {
    positionIndex: number,
    children: React.ReactNode
}

function DropSection({ positionIndex, children }: DropSectionProps) {

    const { handleDrop } = useBoardContext();

    //Drop to the section->Add it
    const [{ isOver }, drop] = useDrop({
        accept: "todo",
        drop: (item: PassProp, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) return //Drop on cards already

            const { _id, sectionIndex } = item
            const prevSectionIndex = sectionIndex
            handleDrop(_id, prevSectionIndex, positionIndex,)

        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });


    return (
        <Flex direction='column' h='calc(100vh)' ref={drop}>

            <Box
                w="full"
                bg="red.500"
                opacity={isOver ? 0.5 : 1}
                rounded={'3xl'}
            >
                {children}
            </Box>
        </Flex>
    );
}

export default function SectionComponent({ properties, positionIndex }: SectionProps) {

    const [title, setTitle] = useState('')
    const {onClickDeleteSection, onClickAddCard} = useBoardContext();

    return (
        <DropSection positionIndex={positionIndex}>
            <Flex direction='column' justify='space-between' h='full' p='3'>
                <Box>
                    <Flex gap='2' mt='5' mb='1' align='center'>

                        <Heading as='h2' size={'lg'}>{properties.title}</Heading>
                        <DeleteIcon ml='auto' onClick={() => onClickDeleteSection(properties._id)} mt='' color='white' />
                    </Flex>
                    <Divider my={5} />
                    <CardList properties={properties} positionIndex={positionIndex}/>

                    <Flex gap='2' mt='5' mb='1' align='center'>

                        <Input type="text" bg='white' onChange={(e) => setTitle(e.target.value)} />
                        <AddIcon onClick={() => onClickAddCard(properties._id, title)} color='white' />
                    </Flex>

                </Box>
            </Flex>
        </DropSection>


    );
}

export interface Section {
    _id: string
    title: string
    cards: Todo[]
}


interface CardListsProps {
    properties: Section,
    positionIndex: number,
}

function CardList({ properties, positionIndex}: CardListsProps) {
    const {onClickDeleteCard } = useBoardContext();

    return (
        <Stack gap={1}>
            {
                properties.cards.map((card: Todo, index) => {
                    return (
                        <Card key={card._id} properties={card} positionIndex={index} sectionIndex={positionIndex}
                            onDelete={() => onClickDeleteCard(properties._id, card._id)} />

                    )
                })
            }
        </Stack>
    )
}
